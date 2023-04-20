import sirv from 'sirv'
import polka from 'polka'
import WebSilo from 'picotool/web-silo.js'
import send from '@polka/send-type'
import { Level } from 'level'
import SSL from 'greenlock-express'
import Designer from './gptdesigner.js'
import { join } from 'node:path'
import cors from 'cors'

const PORT = parseInt(process.env.PORT ?? 5000)
const STATIC = process.env.STATIC ?? 'pub/'
const DATA = process.env.DATA ?? 'data/'
const DB = join(DATA, 'silo.lvl')
const MAINTAINER = process.env.MAINTAINER ?? 'bob@tld.com'

// This dosen't belong here - we're aware. LBD
const nip05 = polka()
  .use(cors())
  .get('/nostr.json', (req, res) => {
    send(res, 200, {
      names: {
        telamon: '0149170fe78b061ce6c7295fff2daa303f710ba17efd8fafd8343292b4295e84',
        Wonni: 'b7e9d0239b67f226503b50d53108a2378d497c1c86a521c44e7b1bc254889064',
        luxar: 'fd681d432d0bd7371ee7d06f35784ac7653e79a39a3d178873a14a98e29c4ae0'
      }
    })
  })

export default function Backend () {
  const assets = sirv(STATIC)
  const db = new Level(DB)
  const silo = WebSilo(db)
  silo.use(cors())
  return polka()
    .use(assets)
    .use('/designer', Designer())
    .use('/silo', silo)
    .use('/.well-known', nip05)
}

if (process.env.NODE_ENV === 'production') {
  process.on('unhandledRejection', err => console.error('Unhandled rejection:', err))
  const b = Backend()
  SSL.init({
    packageRoot: '.',
    configDir: join(DATA, 'greenlock.d'),
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
}
*/
