import esbuild from 'esbuild'
import plugin from 'node-stdlib-browser/helpers/esbuild/plugin'
import stdLibBrowser from 'node-stdlib-browser'

const production = process.env.NODE_ENV === 'production'

const config = {
  entryPoints: ['designer_html/index.js'],
  outfile: 'pub/designer.js',
  format: 'esm',
  platform: 'browser',
  bundle: true,
  keepNames: true,
  sourcemap: !production,
  minify: production,
  metafile: true,
  inject: ['./node_modules/node-stdlib-browser/helpers/esbuild/shim.js'],
  define: {
    global: 'global',
    // process: 'process',
    Buffer: 'Buffer'
  },
  plugins: [
    plugin(stdLibBrowser)
  ]
}

async function build () {
  const result = await esbuild.build(config)
  // print summary
  console.log('=== Build Summary ===')
  const { outputs } = result.metafile
  for (const k in outputs) {
    console.log(`${k} ${outputs[k].bytes}B`)
  }
  console.log('\n')
}

build()

async function serve (port) {
  const ctx = await esbuild.context(config)
  const { host } = await ctx.serve({
    servedir: 'pub',
    port
  })
  console.log(`Designer frontend dev-server on ${host}:${port}`)
}

if (production) {
  build()
} else {
  serve(5000)
}
