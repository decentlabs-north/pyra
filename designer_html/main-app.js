import Tonic from '@socketsupply/tonic'
import { combine } from 'piconuro'
import { mode, loading } from './logic.js'

export class MainApp extends Tonic {
  connected () {
    this.disconnected = combine({ mode, loading })(state => this.reRender(prev => ({ ...prev, ...state })))
  }

  render () {
    const { mode, loading } = this.props
    const mainArea = mode === 'preview'
      ? this.html`<sandbox-preview></sandbox-preview>`
      : this.html`<code-editor></code-editor>`

    return this.html`
       <!-- | Designer | Topsites | About | -->
       <tabs>

         <section name="Designer">
           <main class="flex column start xstretch">
             <publish-dialog></publish-dialog>
             <dialog id="globalLoader" style="background-color: #008080;" ${loading ? 'open' : ''}>
              <div class="lds-spinner" style="display: inline-block"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
             </dialog>
             <main-menu></main-menu>
             <div class="flex row start">
              <side-panel></side-panel>
              <div class="flex column grow3">${mainArea}</div>
             </div>
           </main>
         </section>

         <section name="Top Sites">
           <top-sites></top-sites>
         </section>

         <section name="About">
          <article>It's done when it's done</article>
         </section>
       </tabs>
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

      /* ai-minified spinner */
      .lds-spinner{display:inline-block;position:relative;width:80px;height:80px}.lds-spinner div{transform-origin:40px 40px;animation:lds-spinner 1.2s linear infinite}.lds-spinner div:after{content:" ";display:block;position:absolute;top:3px;left:37px;width:6px;height:18px;border-radius:20%;background:#fff}.lds-spinner div:nth-child(1){transform:rotate(0deg);animation-delay:-1.1s}.lds-spinner div:nth-child(2){transform:rotate(30deg);animation-delay:-1s}.lds-spinner div:nth-child(3){transform:rotate(60deg);animation-delay:-0.9s}.lds-spinner div:nth-child(4){transform:rotate(90deg);animation-delay:-0.8s}.lds-spinner div:nth-child(5){transform:rotate(120deg);animation-delay:-0.7s}.lds-spinner div:nth-child(6){transform:rotate(150deg);animation-delay:-0.6s}.lds-spinner div:nth-child(7){transform:rotate(180deg);animation-delay:-0.5s}.lds-spinner div:nth-child(8){transform:rotate(210deg);animation-delay:-0.4s}.lds-spinner div:nth-child(9){transform:rotate(240deg);animation-delay:-0.3s}.lds-spinner div:nth-child(10){transform:rotate(270deg);animation-delay:-0.2s}.lds-spinner div:nth-child(11){transform:rotate(300deg);animation-delay:-0.1s}.lds-spinner div:nth-child(12){transform:rotate(330deg);animation-delay:0}@keyframes lds-spinner{0%{opacity:1}100%{opacity:0}}
    `
  }
}
