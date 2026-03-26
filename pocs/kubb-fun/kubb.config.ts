import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginClient } from '@kubb/plugin-client'
import { pluginZod } from '@kubb/plugin-zod'
import { pluginFaker } from '@kubb/plugin-faker'

export default defineConfig({
  root: '.',
  input: {
    path: 'openapi.yml',
  },
  output: {
    path: './src/gen',
    clean: true,
  },
  plugins: [
    pluginOas(),
    pluginTs({
      output: { path: 'models' },
    }),
    pluginClient({
      output: { path: 'clients' },
    }),
    pluginZod({
      output: { path: 'zod' },
    }),
    pluginFaker({
      output: { path: 'mocks' },
    }),
  ],
})
