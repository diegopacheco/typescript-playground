import { mkdir, readdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { templates } from './templates.ts';
import type {
  DataBucket,
  Environment,
  Header,
  OpenApiOperation,
  OpenApiSpec,
  Route,
  RouteResponse
} from './mockoon-types.ts';

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const;

const mockDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(mockDir, '..');
const specDir = join(rootDir, 'spec');
const seedDir = join(mockDir, 'seed');
const buildDir = join(mockDir, '.build');
const outputFile = join(mockDir, 'mockoon-env.json');
const mockoonCli = join(rootDir, 'node_modules', '.bin', 'mockoon-cli');

const port = Number(process.env.MOCK_PORT ?? 3001);
const endpointPrefix = process.env.MOCK_PREFIX ?? 'api';

const uuidFrom = (seed: string): string => {
  const hash = new Bun.CryptoHasher('sha1').update(seed).digest('hex');
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    `4${hash.slice(13, 16)}`,
    `8${hash.slice(17, 20)}`,
    hash.slice(20, 32)
  ].join('-');
};

const toEndpoint = (path: string): string =>
  path.replace(/^\//, '').replace(/\{([^}]+)\}/g, ':$1');

const run = async (args: string[]): Promise<void> => {
  const proc = Bun.spawn([mockoonCli, ...args], {
    cwd: rootDir,
    stdout: 'pipe',
    stderr: 'pipe'
  });
  const [out, err, code] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited
  ]);
  if (code !== 0) {
    throw new Error(`mockoon-cli ${args.join(' ')} failed:\n${out}${err}`);
  }
};

const emptyResponse = (uuid: string): RouteResponse => ({
  uuid,
  rules: [],
  rulesOperator: 'OR',
  statusCode: 200,
  label: '',
  headers: [],
  body: '',
  latency: 0,
  bodyType: 'INLINE',
  filePath: '',
  databucketID: '',
  sendFileAsBody: false,
  disableTemplating: false,
  fallbackTo404: false,
  default: true,
  crudKey: 'id',
  callbacks: []
});

const jsonHeader: Header = { key: 'Content-Type', value: 'application/json' };

const crudRoute = (endpoint: string, bucketId: string, documentation: string): Route => ({
  uuid: uuidFrom(`crud:${endpoint}`),
  type: 'crud',
  documentation,
  method: '',
  endpoint,
  responses: [
    {
      ...emptyResponse(uuidFrom(`crud-response:${endpoint}`)),
      bodyType: 'DATABUCKET',
      databucketID: bucketId
    }
  ],
  responseMode: null,
  streamingMode: null,
  streamingInterval: 0
});

const templateRoute = (
  method: string,
  endpoint: string,
  documentation: string,
  templateName: string
): Route => {
  const template = templates[templateName];
  if (!template) {
    throw new Error(`Unknown x-mockoon template "${templateName}" on ${method} /${endpoint}`);
  }
  const key = `${method}:${endpoint}`;
  const guarded = template.before.map((extra, index) => ({
    ...emptyResponse(uuidFrom(`template-guard:${key}:${index}`)),
    statusCode: extra.statusCode,
    label: extra.label,
    headers: [jsonHeader],
    body: extra.body,
    rules: extra.rules,
    rulesOperator: 'AND' as const,
    default: false
  }));
  return {
    uuid: uuidFrom(`template:${key}`),
    type: 'http',
    documentation,
    method,
    endpoint,
    responses: [
      ...guarded,
      {
        ...emptyResponse(uuidFrom(`template-response:${key}`)),
        statusCode: template.statusCode,
        headers: [jsonHeader],
        body: template.body
      }
    ],
    responseMode: null,
    streamingMode: null,
    streamingInterval: 0
  };
};

const dataBucket = (id: string, value: unknown): DataBucket => ({
  uuid: uuidFrom(`bucket:${id}`),
  id,
  name: id,
  documentation: `Stateful store for /${id}`,
  value: JSON.stringify(value, null, 2)
});

const buildEnvironment = async (): Promise<Environment> => {
  const specFiles = (await readdir(specDir)).filter((file) => file.endsWith('.yaml')).sort();
  if (specFiles.length === 0) {
    throw new Error(`No OpenAPI specs found in ${specDir}`);
  }

  await mkdir(buildDir, { recursive: true });

  const routes: Route[] = [];
  const buckets: DataBucket[] = [];
  const uncovered: string[] = [];

  for (const specFile of specFiles) {
    const specPath = join(specDir, specFile);
    const importedPath = join(buildDir, specFile.replace(/\.yaml$/, '.json'));

    await run(['import', '--input', specPath, '--output', importedPath, '--prettify']);

    const imported = (await Bun.file(importedPath).json()) as Environment;
    const spec = Bun.YAML.parse(await Bun.file(specPath).text()) as OpenApiSpec;

    const findImported = (method: string, endpoint: string): Route | undefined =>
      imported.routes.find((route) => route.method === method && route.endpoint === endpoint);

    const templateRoutes: Route[] = [];
    const crudRoutes: Route[] = [];
    const claimed = new Set<string>();

    for (const [path, pathItem] of Object.entries(spec.paths)) {
      const endpoint = toEndpoint(path);
      const crudBucket = pathItem['x-mockoon']?.crud;

      for (const method of HTTP_METHODS) {
        const operation = pathItem[method] as OpenApiOperation | undefined;
        if (!operation) continue;
        const templateName = operation['x-mockoon']?.template;
        if (!templateName) continue;
        const source = findImported(method, endpoint);
        if (!source) {
          throw new Error(`Mockoon did not import ${method.toUpperCase()} ${path} from ${specFile}`);
        }
        templateRoutes.push(
          templateRoute(method, endpoint, operation.summary ?? source.documentation, templateName)
        );
        claimed.add(`${method}:${endpoint}`);
      }

      if (crudBucket) {
        const seedFile = join(seedDir, `${crudBucket}.json`);
        if (!(await Bun.file(seedFile).exists())) {
          throw new Error(`Missing seed file for data bucket "${crudBucket}": ${seedFile}`);
        }
        buckets.push(dataBucket(crudBucket, await Bun.file(seedFile).json()));
        crudRoutes.push(crudRoute(endpoint, crudBucket, `${spec.info.title} — stateful CRUD on /${endpoint}`));
        for (const route of imported.routes) {
          if (route.endpoint === endpoint || route.endpoint.startsWith(`${endpoint}/`)) {
            claimed.add(`${route.method}:${route.endpoint}`);
          }
        }
      }
    }

    for (const route of imported.routes) {
      if (!claimed.has(`${route.method}:${route.endpoint}`)) {
        uncovered.push(`${specFile}: ${route.method.toUpperCase()} /${route.endpoint}`);
      }
    }

    routes.push(...templateRoutes, ...crudRoutes);
  }

  if (uncovered.length > 0) {
    throw new Error(
      `These spec operations have no x-mockoon crud or template directive, so the mock would answer them with an empty body:\n  ${uncovered.join('\n  ')}`
    );
  }

  return {
    uuid: uuidFrom('environment:mockoon-react-fun'),
    lastMigration: 33,
    name: 'mockoon-react-fun',
    endpointPrefix,
    latency: 0,
    port,
    hostname: '',
    folders: [],
    routes,
    rootChildren: routes.map((route) => ({ type: 'route', uuid: route.uuid })),
    proxyMode: false,
    proxyHost: '',
    proxyRemovePrefix: false,
    tlsOptions: {
      enabled: false,
      type: 'CERT',
      pfxPath: '',
      certPath: '',
      keyPath: '',
      caPath: '',
      passphrase: ''
    },
    cors: true,
    headers: [
      { key: 'Access-Control-Allow-Origin', value: '*' },
      { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS' },
      {
        key: 'Access-Control-Allow-Headers',
        value: 'Content-Type, Origin, Accept, Authorization, Content-Length, X-Requested-With'
      },
      { key: 'Access-Control-Expose-Headers', value: 'X-Total-Count, X-Filtered-Count' }
    ],
    proxyReqHeaders: [{ key: '', value: '' }],
    proxyResHeaders: [{ key: '', value: '' }],
    data: buckets,
    callbacks: []
  };
};

const environment = await buildEnvironment();
await Bun.write(outputFile, `${JSON.stringify(environment, null, 2)}\n`);
await run(['validate', '--data', outputFile]);

const crudCount = environment.routes.filter((route) => route.type === 'crud').length;
const httpCount = environment.routes.length - crudCount;
console.log(
  `mock ready: ${outputFile}\n` +
    `  ${crudCount} stateful CRUD routes, ${httpCount} templated routes, ${environment.data.length} data buckets\n` +
    `  listening on http://localhost:${port}/${endpointPrefix} once started`
);
