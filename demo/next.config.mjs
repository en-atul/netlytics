import withMarkdoc from '@markdoc/next.js'
import path from 'path'
import { fileURLToPath } from 'url'

import withSearch from './src/markdoc/search.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'ts', 'tsx'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      netlytics: path.resolve(__dirname, '../src/index.ts'),
    }
    return config
  },
}

export default withSearch(
  withMarkdoc({ schemaPath: './src/markdoc' })(nextConfig),
)
