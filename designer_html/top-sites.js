import Tonic from '@socketsupply/tonic'

export class TopSites extends Tonic {
  async * render () {
    yield this.html`<p>Loading...</p>`

    // TODO:  const res = await fetch('/silo')
    // if (res.status !== 200) yield this.html`Failed Loading site`
    const sites = [{ title: 'fake site', hits: 5 }] // await res.json()

    const listItems = []
    for (const site of sites) {
      console.log('parsing site info', site) // todo: delete this line
      listItems.push(this.html`
        A website about cars <samp>1000hits</samp>
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
      ul {

      }
    `
  }
}
