import Tonic from '@socketsupply/tonic'
import { sourceCode, phex } from './logic.js'
import { bootloader0 } from './boot/index.js'

export class SandboxPreview extends Tonic {
  connected () {
    // this.disconnected = sourceCode(code => this.reRender(prev => ({ ...prev, code })))
    const unsubscribeReboot = sourceCode(code => {
      this.code = code
      this.reBoot()
    })
    const unsubscribeRender = phex(hex => this.reRender(state => ({ ...state, hex })))

    this.disconnected = () => {
      unsubscribeRender()
      unsubscribeReboot()
    }
  }

  render () {
    return this.html`<iframe id="render"></iframe>`
    /* return this.html`<iframe
      id="render"
      allow="camera; display-capture; geolocation; microphone"
      allowfullscreen="false"
      allowpaymentrequest="true"
      allowtransparency="false"
      loading="lazy"
      sandbox="
        allow-forms
        allow-modals
        allow-popups
        allow-same-origin
        allow-top-navigation-by-user-activation
      ">
    </iframe>`
    */
    // Excluded options for sandbox
    // allow-pointer-lock
    // allow-downloads
    // allow-presentation
    // allow-scripts
  }

  /**
   * TODO: backend header tweaks if necessary:
   * referrer-policy: no-referrer
   */
  updated () {
    this.reBoot()
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
