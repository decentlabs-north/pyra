import Tonic from '@socketsupply/tonic'

export class TopSites extends Tonic {
  async * render () {
    yield this.html`<p>Loading...</p>`

    const res = await fetch('https://pyra.se/silo')
    if (res.status !== 200) return this.html`Failed Loading site`
    const sites = await res.json()
    const listItems = []
    sites.sort((a, b) => b.hits - a.hits);
    for (const [index, site] of sites.entries()) {
      let stars = '';
      if (index < 5) {
        for (let i = 0; i < Math.min(site.hits, 5); i++) {
          stars += '⭐';
        }
      }
      listItems.push(this.html`
        <li><a class="link" href="https://pyra.se/silo/${site.key}" target="_blank">${site.title}</a><samp> hits: ${site.hits+''} </samp> ${stars} </li>
      `)
    }

    return this.html`
      <section id="top-sites" class="flex column xcenter">
        <h1>⭐Top Sites⭐</h1>
        <ol>
          ${listItems}
        </ol>
      </section>
    `
  }

  static stylesheet () {
    return `
      .link {
        color: white
      }
    `
  }
}
