/*
 * Heads up! I don't know what i'm doing, this is going to get hairy.
 * When works then clean up and separate.
 */

/** Yup this be a boot loader, now gotta wire it up properly.
 * bootloader needs to be bootable without other any deps.
 *
 * Origianl hypothesis:
 * @param {IFrameElement} the sandbox
 * @param {Feed} executable "the code++"
 * @param {Wire} wire An IPC to other protocols.
 */
export function bootloader0 (iframe, code) {
  const cWindow = iframe.contentWindow
  const doc = iframe.contentDocument
  const cElements = cWindow.customElements
  const BaseClass = cWindow.HTMLElement
  cElements.define('pop-hits', class PopCounter extends BaseClass {
    connectedCallback () {
      this.attachShadow({ mode: 'open' })
      const digits = doc.createElement('samp')
      digits.setAttribute('class', 'digits')
      digits.textContent = '0000'
      const style = doc.createElement('style')
      style.textContent = `.digits {
        font-size: 2em;
        color: purple;
        background-color: black;
        border: 2px double #333;
        padding: 4px 0.5em;
      }`
      this.shadowRoot.append(style, digits)
      cWindow.fetch('https://pyra.se/silo/stat/1317b34e402afb083bcd2e61e9dd46f09e0f2fdd5b00803ea232ed4da58fa7fd')
        .then(res => res.json())
        .then(({ hits }) => {
          digits.textContent = (hits + '').padStart(4, '0')
        })
    }
  })
  iframe.srcdoc = code
}
