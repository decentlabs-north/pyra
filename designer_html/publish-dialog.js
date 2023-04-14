import Tonic from '@socketsupply/tonic'
import { write, combine } from 'piconuro'
import { publish, $urls, phex } from './logic.js'

export const [showPublishDialog, setShowPublishDialog] = write(false)

const domains = [
  'pyra.se',
  'rboot.me'
]
const AVAILABLE = '✅'
const UNAVAILABLE = '❌'
const UNKNOWN = '❔'
const LOADING = '⏳'

export class PublishDialog extends Tonic {
  connected () {
    const [name, setName] = write('')
    this.setName = setName

    const [nameState, setNameState] = write(UNKNOWN)
    this.setNameState = setNameState

    this.disconnected = combine({
      showDialog: showPublishDialog,
      urls: $urls,
      phex,
      name,
      nameState
    })(state => this.reRender(prev => ({ ...prev, ...state })))
  }

  click (e) {
    if (Tonic.match(e.target, '#btn-cancel')) setShowPublishDialog(false)
    if (Tonic.match(e.target, '#btn-publish')) {
      publish()
      setShowPublishDialog(false)
    }
  }

  change (ev) {
    if (Tonic.match(ev.target, '#inp-name')) {
      const name = ev.target.value
      this.setNameState(LOADING)
      this.setName(name)
      // TODO: GET pyra.se/silo/name
      // if (status === 200) setNameState(UNAVAILABLE) else AVAILABLE
      setTimeout(() => this.setNameState(Math.random() > 0.5 ? UNAVAILABLE : AVAILABLE), 1000)
    }
  }

  render () {
    const { showDialog, urls, phex, name, nameState } = this.props
    if (!urls?.length) return

    const domainOptions = this.html(
      domains.map(tld => `<option value="${tld}">${tld}</option>`)
    )

    return this.html`
      <dialog ${showDialog ? 'open' : ''} aria-modal="true">
        <h2>Publish Website</h2>
        <p>
          Default address:
          <a class="silo-link" href="${urls[0]}">${urls[0]}</a>
        </p>

        <div>
          <p>
            Optional: register short name (POP-05)
            <br/>
            <br/>
            <small class="indicator-name ${nameState === LOADING ? 'loading' : ''}">${nameState}</small>
            <input id="inp-name" type="text" placeholder="firewater" value="${name}" />
            @
            <select>${domainOptions}</select>
          </p>

          <details>
            <summary>Custom domain</summary>
            <p>Create these records at your DNS-provider:</p>
            <samp>
              domain.tld A 3600 34.244.37.82<br/>
              domain.tld TXT 3600 site${phex}
            </samp>
          </details>
        </div>

        <row class="center">
          <button id="btn-cancel">cancel</button>
          <button id="btn-publish">publish</button>
        </row>
      </dialog>
    `
  }

  static stylesheet () {
    return `
      .silo-link {
        display: inline-block;
        max-width: 16em;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: bottom;
      }
      #inp-name {
        max-width: 11em;
        text-align: right;
      }
      .indicator-name { display: inline-block; }
      .indicator-name.loading {
        animation: spin 1s infinite linear;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
  }
}
