import sirv from 'sirv'
import bparser from 'body-parser'
import polka from 'polka'
import WebSilo from 'picotool/web-silo.js'
import { Level } from 'level'

// TODO: this does not belong here
const assets = sirv('pub/', {
  maxAge: 31536000, // 1Y
  immutable: true
})
const db = new Level('silo.lvl')
const silo = WebSilo(db)
polka()
  .use(assets)
  .use(bparser.json())
  .use('silo', silo)
  .listen(5000, () => console.log('Listening on 5000'))

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
