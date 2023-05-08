/*
 * Heads up! I don't know what i'm doing, this is going to get hairy.
 * When works then clean up and separate.
 * - A bootloader produces a nested SecureContext / 'realm'; Because we're tired of downloading custom browsers.
 * - The inputs that MUST be available to a realm are:
 *   - async getPublicKey() // => Returns emepheral / static identity of user
 *   - async signMessage() // => Creates content on the user's behalf.
 */

/** Yup this be a boot loader, now gotta wire it up properly.
 * bootloader needs to be bootable without other any deps.
 *
 * Original hypothesis:
 * @param {IFrameElement} the sandbox
 * @param {string} executable "the code++"
 * @param {Wire} wire An IPC to other protocols.
 */
export function bootloader0 (iframe, code) {
  console.log('BOOTLOADER Starting')
  // Register all Pico Widgets
  registerHitsWidget(iframe)
  // TODO: registerArticlesWidget(iframe)
  iframe.srcdoc = code
}

/**
 * Page Hits Pico Widget
 * @param {IFrameElement} iframe the Target IFrameElement
 */
function registerHitsWidget (iframe) {
  const cWindow = iframe.contentWindow
  const doc = iframe.contentDocument
  const cElements = cWindow.customElements
  const BaseClass = cWindow.HTMLElement

  cElements.define('hit-counter', class PopCounter extends BaseClass {
    connectedCallback () {
      this.attachShadow({ mode: 'open' }) // open so we can program it.

      // Create <samp>0000</samp>
      const digits = doc.createElement('samp')
      digits.setAttribute('class', 'digits')
      digits.textContent = '0000'

      // Add css
      const style = doc.createElement('style')
      style.textContent = `.digits {
        font-size: 2em;
        color: purple;
        background-color: black;
        border: 2px double #333;
        padding: 4px 0.5em;
      }`

      // add our <samp>0000</samp> to document / display it
      this.shadowRoot.append(style, digits)

      // Fetch current amout of hits from silo, and update 0000 to => 0699
      cWindow.fetch('https://pyra.se/silo/stat/1317b34e402afb083bcd2e61e9dd46f09e0f2fdd5b00803ea232ed4da58fa7fd')
        .then(res => res.json())
        .then(({ hits }) => {
          digits.textContent = (hits + '').padStart(4, '0')
        })
    }
  })
}

/**
 * Guest book pico widget
 */
function registerArticlesWidget (iframe) {
  // TODO: kenan widget nostr articles
}
