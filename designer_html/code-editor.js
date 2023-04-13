import Tonic from '@socketsupply/tonic'
import { combine } from 'piconuro'
import { sourceCode, setSourceCode, headers, bindInput } from './logic.js'

export class CodeEditor extends Tonic {
  // Connects neuron output to tonic input + cleanup on destroy
  connected () {
    this.disconnected = combine({ sourceCode, headers })(state => this.reRender(oldState => ({ ...oldState, ...state })))
  }

  change (event) {
    const codeArea = Tonic.match(event.target, '#code')
    if (codeArea) setSourceCode(codeArea.value)
  }

  render () {
    const { sourceCode, headers } = this.props
    if (!sourceCode) return this.html`<pre>No Source Code</pre>`
    // POP-04
    return this.html`
      <textarea id="headers">${headers}</textarea>
      <textarea id="code">${sourceCode}</textarea>
    `
  }

  updated () {
    // bindInput(this.querySelector('#code'), setSourceCode, null, { prevent: true })
  }

  static stylesheet () {
    return `
      #headers {
        height: 6em;
      }
      #code {
        height: calc(var(--content-height) - 6em);
        background-color: #333;
        color: white;
        border-radius: 5px;
      }
      code-editor textarea {
        width: 100%;
        padding: 8px 0px;
        border: none;
        font-size: 1.1em;
      }
    `
  }
}
