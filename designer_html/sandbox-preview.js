import Tonic from '@socketsupply/tonic'
import { sourceCode } from './logic.js'

export class SandboxPreview extends Tonic {
  // Connects neuron output to tonic input + cleanup on destroy
  connected () {
    this.disconnected = sourceCode(code => this.reRender(prev => ({ ...prev, code })))
  }

  render () {
    const { code } = this.props
    if (!code) return this.html`<pre>No Source Code</pre>`
    return this.html`
      <iframe id="render" srcdoc="${code}"></iframe>
    `
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
