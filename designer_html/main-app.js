import Tonic from '@socketsupply/tonic'
import { mode } from './logic.js'

export class MainApp extends Tonic {
  connected () {
    this.disconnected = mode(mode => this.reRender(prev => ({ ...prev, mode })))
  }

  render () {
    const { mode } = this.props
    const mainArea = mode === 'preview'
      ? this.html`<sandbox-preview></sandbox-preview>`
      : this.html`<code-editor></code-editor>`

    return this.html`
       <main class="flex column start xstretch">
         <publish-dialog></publish-dialog>
         <main-menu></main-menu>
         <div class="flex row start">
          <side-panel></side-panel>
          <div class="flex column grow3">${mainArea}</div>
         </div>
       </main>
    `
  }

  static stylesheet () {
    return `
      main {
        width: 100%;
        display: block;
        max-width: 90vw;
        border: 3px solid var(--frame);
        border-radius: 5px;
        margin-left: auto;
        margin-right: auto;
        background-color: var(--frame);
        padding: 2px;
        margin-bottom: 4em;
      }
    `
  }
}
