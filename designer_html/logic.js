/**
 * Heads up! This file contains N(e)urons.
 * expect spaghetti and eyeglaze but keep exports clean
 * and documentable.
 * (Because proto-pasta has to be boiled somewhere :shrug:)
 */
import {
  write,
  mute,
  init,
  get,
  combine,
  gate,
  memo
} from 'piconuro'

import Feed from 'picofeed'
import { pack } from 'picotool'

const [_mode, setMode] = write('preview')
export const toggleMode = () => setMode(get(mode) === 'preview' ? 'code' : 'preview')
export const mode = gate(_mode)

export const [promptLine, setPromptLine] = write('A fan-page about hamsters')

const [$sourceCode, _setSourceCode] = write(`
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Pico Website</title>
    <style>
      body { color: #333; background-color: #eee; }
    </style>
  </head>
  <body>
    <h1>Welcome to my website about everything</h1>
    <p>
      This is an extremely minimal but complete website in HTML.
    </p>
  </body>
</html>
`)
export const setSourceCode = _setSourceCode
export const sourceCode = mute($sourceCode, code => code.trim())

// The signing secret belongs to the website and indirectly to the author.
const $keys = memo(init(Feed.signPair(),
  mute(init(Feed.signPair()), async pair => {
    let persisted = false
    // Attempt to load public key via hastag
    if (window.location.hash.match(/^#?site[0-9A-Fa-f]{64}/)) {
      const pk = Buffer.from(window.location.hash.replace(/^#?site/, ''), 'hex')
      console.info('Attempting to load site', pk.toString('hex'))
      // TODO: attempt to fetch code from silos
      // check localstorage for secret
      let sk = window.localStorage.getItem('site' + pk.toString('hex'))
      // ask for secret via prompt
      if (sk) {
        console.info('Secret found in store')
        persisted = true
      } else {
        const input = window.prompt('Input secret for site to edit or press cancel to fork')
        // TODO: validate user input, should be 128-hexchars where 64last equals pubkey
        if (input) sk = Buffer.from(sk, 'hex')
      }
      if (sk) { // restore keys
        pair.sk = sk
        pair.pk = pk
      } // else give up and fork
    }
    if (!persisted) window.localStorage.setItem('site' + pair.pk.toString('hex'), pair.sk.toString('hex'))
    window.location.hash = 'site' + pair.pk.toString('hex')
    return pair
  })
))

export const phex = mute($keys, keys => keys?.pk.toString('hex'))
const $silos = init([
  'https://pyra.se/silo' // some relative web-silo
])

export const $urls = mute(
  combine($keys, $silos),
  ([keys, silos]) => silos.map(silo => silo + '/' + keys.pk.toString('hex'))
)

const [$headers, _setHeaders] = write(`Date: ${Date.now()}`)
export const setHeaders = _setHeaders
export const headers = mute(
  combine($headers, $urls, $keys),
  ([h, u, k]) => `Public-Key: ${k.pk.toString('hex')}\n` +
    h.trim() + '\n' +
    u.map(url => `Source: ${url}`).join('\n')
)

export async function publish () {
  console.log('Publishing website')
  const urls = get($urls)
  const src = get(sourceCode)
  const { sk } = get($keys)
  const feed = pack(sk, src)
  const body = feed.buf.slice(0, feed.tail)

  const result = await Promise.all(urls.map(async url => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'pico/feed' },
      body
    })
    // TODO: handle try catch for thrown errors
    if (res.status !== 201) {
      console.error('something went wrong:', await res.text())
      return -1
    }
    console.info('successfully published to', url)
    return 0
  }))

  const stats = { success: 0, failed: 0 }
  for (const returnCode of result) {
    if (returnCode < 0) stats.failed++
    else stats.success++
  }
  return stats
}
export const [loading, setLoading] = write(false)
const checkpoints = []
const checkpointsFwd = []

export async function think () {
  if (get(loading)) return
  setLoading(true)
  const prompt = get(promptLine).trim()
  const src = get(sourceCode).trim()
  const res = await fetch('/designer/do', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html: src, prompt })
  }).catch(err => {
    setLoading(false)
    console.error(err)
  })
  if (res.status === 200) {
    const data = await res.json()
    checkpoints.push({ html: src, prompt })
    setSourceCode(data.html)
  }
  setLoading(false)
}

export function undo () {
  console.log('Undo')
  if (!checkpoints.length) return
  checkpointsFwd.push({ // Store redo-history
    html: get(sourceCode).trim(),
    prompt: get(promptLine).trim()
  })
  const { html, prompt } = checkpoints.pop()
  setSourceCode(html)
  setPromptLine(prompt)
}

export function redo () {
  console.log('Redo')
  if (!checkpointsFwd.length) return
  checkpoints.push({ // Store undo-history
    html: get(sourceCode).trim(),
    prompt: get(promptLine).trim()
  })
  const { html, prompt } = checkpointsFwd.pop()
  setSourceCode(html)
  setPromptLine(prompt)
}

export function shortHash (input) {
  if (!input) return input
  if (Buffer.isBuffer(input)) input = input.toString('hex')
  return input.slice(0, 4) + '..' + input.splice(input.length - 4, input.length)
}

// DOM-helpers
/**
 * Sets up listeners for inputs and textareas
 * to cause changes on keyup besides on-change.
 * @param {HTMLElement} element - the input or textarea
 * @param {function} output - a set function taking single paramter 'value'
 * @param {function} onenter - a function to be invoked if 'Enter' was pressed.
 */
export function bindInput (element, output, onenter, options = {}) {
  const prevent = options.prevent ?? false
  console.info('bindInput(', element, output, onenter, ')')
  const update = ev => {
    const v = ev.target.value
    if (typeof output === 'function') output(v)
    return true
  }
  element.addEventListener('change', update)
  element.addEventListener('keyup', ev => {
    if (prevent) ev.preventDefault()
    console.log(ev.key)
    ev.key === 'Enter' && typeof onenter === 'function'
      ? update(ev) && onenter(ev.target.value)
      : update(ev)
  })
}
