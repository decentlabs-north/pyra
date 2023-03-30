import sirv from 'sirv'
import bparser from 'body-parser'
import polka from 'polka'
import WebSilo from 'picotool/web-silo.js'
import { Level } from 'level'
import SSL from 'greenlock-express'

const PORT = process.env.PORT ?? 5000
const STATIC = process.env.STATIC ?? 'pub/'
const DB = process.env.DB ?? 'silo.lvl'
const MAINTAINER = process.env.MAINTAINER ?? 'bob@tld.com'

export default function Backend () {
  const assets = sirv(STATIC)
  const db = new Level(DB)
  const silo = WebSilo(db)

  return polka()
    .use(assets)
    .use(bparser.json())
    .use('silo', silo)
}
if (process.env.NODE_ENV === 'production') {
  process.on('unhandledRejection', err => console.error('Unhandled rejection:', err))
  const b = Backend()
  SSL.init({
    packageRoot: __dirname,
    configDir: './greenlock.d',
    maintainerEmail: MAINTAINER,
    cluster: false
  })
    .serve(b.handler.bind(b))
} else {
  Backend().listen(PORT, onListen)
}

function onListen (err) {
  if (err) {
    console.error('Startup failed', err)
    process.exit(1)
  } else console.log(`Listening on ${PORT}, static path: ${STATIC}`)
}

// TODO: pico-ecosystem uses sodium instead of the new cool bip-driven
// libs, I don't mind switching. And Buffer also seems dead.
/*
if (!globalThis.crypto) { // node <= 18 shim
globalThis.crypto = {
  getRandomValues: typedArray => { // My node does not provide this method :'(
    const b = globalThis.crypto.randomBytes(typedArray.length)
    b.copy(typedArray)
    return typedArray
  },
  ...(await import('node:crypto'))
}
}*/
