import { pack } from 'picotool'
import Feed from 'picofeed'
const { sk, pk } = Feed.signPair()
async function main () {
  const btnPub = document.getElementById('publish')
  btnPub.addEventListener('click', publish)
  console.log('hej då', btnPub)
}
async function publish () {
  const area = document.getElementById('htmleditor')
  const feed = pack(sk, area.value.trim())
  const url = 'http://localhost:5000/silo/' + pk.toString('hex')
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'pico/feed' },
    body: feed.buf.slice(0, feed.tail)
  })
  if (res.status !== 201) {
    console.error(res.status, await res.text())
  }
  boot(url)
}
async function boot (url) {
  console.log('Booting', url)
  const area = document.getElementById('boot')
  area.innerHTML = ''
  const ctx = document.createElement('iframe')
  const res = await fetch(url)
  ctx.srcdoc = await res.text()
  area.appendChild(ctx)
}
main()
