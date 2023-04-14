import Tonic from '@socketsupply/tonic'
import { sourceCode } from './logic.js'
import { bootloader0 } from './boot/index.js'

export class SandboxPreview extends Tonic {
  connected () {
    // this.disconnected = sourceCode(code => this.reRender(prev => ({ ...prev, code })))
    this.disconnected = sourceCode(code => {
      this.code = code
      this.reBoot()
    })
  }

  render () {
    return this.html`<iframe id="render"></iframe>`
  }

  reBoot () {
    const frame = this.querySelector('#render')
    if (!this._loaded) {
      bootloader0(frame)
      this._loaded = true
    }
    console.info('reBoot site', frame)
    window.rnd = frame
    frame.srcdoc = this.code
  }

  static stylesheet () {
    return `
      iframe {
        width: 100%;
        display: block;
        height: var(--content-height);
        overflow: scroll;
        border: none;
        background-color: white;
      }
    `
  }

  /**
   * Leaving this here
   * incase srcdoc=${code} does not work
  updated () {
    const { code } = this.props
    if (!code) return
    const iframeElement = this.querySelector('#render')
    iframeElement.srcdoc = code
  }
  */
}
