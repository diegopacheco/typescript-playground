export type Header = { key: string; value: string };

export type ResponseRule = {
  target: 'body' | 'query' | 'header' | 'cookie' | 'params' | 'path' | 'method';
  modifier: string;
  value: string;
  invert: boolean;
  operator: 'equals' | 'regex' | 'regex_i' | 'null' | 'empty_array' | 'array_includes';
};

export type RouteResponse = {
  uuid: string;
  rules: ResponseRule[];
  rulesOperator: 'AND' | 'OR';
  statusCode: number;
  label: string;
  headers: Header[];
  body: string;
  latency: number;
  bodyType: 'INLINE' | 'FILE' | 'DATABUCKET';
  filePath: string;
  databucketID: string;
  sendFileAsBody: boolean;
  disableTemplating: boolean;
  fallbackTo404: boolean;
  default: boolean;
  crudKey: string;
  callbacks: unknown[];
};

export type Route = {
  uuid: string;
  type: 'http' | 'crud' | 'ws';
  documentation: string;
  method: string;
  endpoint: string;
  responses: RouteResponse[];
  responseMode: null;
  streamingMode: null;
  streamingInterval: number;
};

export type DataBucket = {
  uuid: string;
  id: string;
  name: string;
  documentation: string;
  value: string;
};

export type Environment = {
  uuid: string;
  lastMigration: number;
  name: string;
  endpointPrefix: string;
  latency: number;
  port: number;
  hostname: string;
  folders: unknown[];
  routes: Route[];
  rootChildren: { type: 'route'; uuid: string }[];
  proxyMode: boolean;
  proxyHost: string;
  proxyRemovePrefix: boolean;
  tlsOptions: {
    enabled: boolean;
    type: string;
    pfxPath: string;
    certPath: string;
    keyPath: string;
    caPath: string;
    passphrase: string;
  };
  cors: boolean;
  headers: Header[];
  proxyReqHeaders: Header[];
  proxyResHeaders: Header[];
  data: DataBucket[];
  callbacks: unknown[];
};

export type MockoonPathExtension = { crud?: string };
export type MockoonOperationExtension = { template?: string };

export type OpenApiOperation = {
  summary?: string;
  description?: string;
  operationId?: string;
  'x-mockoon'?: MockoonOperationExtension;
};

export type OpenApiSpec = {
  info: { title: string; version: string; description?: string };
  paths: Record<string, Record<string, unknown> & { 'x-mockoon'?: MockoonPathExtension }>;
};
