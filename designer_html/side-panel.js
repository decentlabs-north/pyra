import Tonic from '@socketsupply/tonic'

export class SidePanel extends Tonic {
  render () {
    return this.html`
      <panel>
        <h3>Widgets</h3>
        <ul id="widget-list">
          <li>
            📟
            <label>Page hit counter</label>
          </li>
          <li>
            🖼️
            <label>Image</label>
          </li>
          <li>
            📖
            <label>Guest book</label>
          </li>
          <li>
            🏷️
            <label>Price tag</label>
          </li>
          <li>
            🛒
            <label>Cart widget</label>
          </li>
        </div>
      </panel>
    `
  }

  static stylesheet () {
    return `
      #widget-list {
        list-style: none;
        padding: 0 1em;
      }
    `
  }
}
