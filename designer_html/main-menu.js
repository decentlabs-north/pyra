import Tonic from '@socketsupply/tonic'
import { combine } from 'piconuro'
import {
  // Actions
  undo,
  redo,
  think,
  // Neurons
  setPromptLine,
  mode,
  toggleMode,
  // Helper
  bindInput,
  promptLine,
  loading
} from './logic.js'
import { setShowPublishDialog } from './publish-dialog.js'

export class MainMenu extends Tonic {
  connected () {
    this.disconnected = combine({ mode, loading })(state => this.reRender(prev => ({ ...prev, ...state })))
  }

  click (e) {
    if (Tonic.match(e.target, '#btn-undo')) undo()
    if (Tonic.match(e.target, '#btn-redo')) redo()
    if (Tonic.match(e.target, '#btn-generate')) think()
    if (Tonic.match(e.target, '#btn-publish')) setShowPublishDialog(true)
    if (Tonic.match(e.target, '#btn-mode')) toggleMode()
  }

  change (e) {
    const el = Tonic.match(e.target, '#prompt')
    if (el) setPromptLine(el.value)
  }

  render () {
    const { mode, loading } = this.props
    return this.html`
      <nav class="flex row space-between">
        <!-- left of space -->
        <div class="left">
          <button id="btn-mode">${mode === 'preview' ? 'source' : 'boot'}</button>
          <button id="btn-undo">⬅️</button>
          <button id="btn-redo">➡️</button>
          <input ${loading ? 'disabled': ''} type="text" id="prompt" placeholder="Example: A social site for hamsters with orange theme">
          <button id="btn-generate">🧠</button>
          <button id="btn-publish" title="Publish page">🚀 </button>
        </div>
        <!-- right of space -->
        <div class="right">
          <a href="https://reboot.one">🔌</a>
        </div>
      </nav>
    `
  }

  updated () {
    bindInput(this.querySelector('#prompt'), setPromptLine, think, {input: promptLine})
  }

  static stylesheet () {
    return `
      nav {
        background-color: var(--frame);
        padding: 4px 0;
      }
      nav .left { width: 100%; }
      #prompt {
        display: inline-block;
        width: 70%;
        height: 1.3em;
      }
    `
  }
}
