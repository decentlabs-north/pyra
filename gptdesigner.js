import polka from 'polka'
import bparser from 'body-parser'
import send from '@polka/send-type'
import { Configuration, OpenAIApi } from 'openai'
import pretty from 'pretty'

const code = '\n```\n'
function codeBlock (str) {
  return code + str + code
}

const blankSite = `
<!DOCTYPE html>
<html>
  <head>
    <title>Minimal Website</title>
    <style>
      body { color: #333; background-color: #eee; }
    </style>
  </head>
  <body>
    <h1>Welcome to my website</h1>
    <p>This is an extremely minimal but complete website in HTML.</p>
  </body>
</html>
`.trim()
const firstSystem = `
You are embedded on a web-page.
You assist the user with creating a website according to their input.
- your responses are filtered.
- The user is only shown the first part of your response surrounded by triple backticks.
- You respond only with HTML.
`.trim()

const intro = [
  { role: 'system', content: firstSystem },
  { role: 'user', content: 'I want a minimal website' },
  { role: 'assistant', content: codeBlock(blankSite) }
]

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY })
const openai = new OpenAIApi(configuration)

export default function Designer () {
  return polka()
    .use(bparser.json())
    .post('/do', async (req, res) => {
      try {
        const { prompt, html } = req.body
        const result = await think(prompt, html)
        send(res, 200, { html: result })
      } catch (err) {
        console.error(err.message)
        console.error(err.stackTrace)
        if (err.response) {
          console.error(err.response.data)
        }
        send(res, 500, { error: 'No site for u!' })
      }
    })
}

async function think (prompt, html) {
  if (!prompt) throw new Error('Invalid prompt')
  const messages = [
    ...intro,
    { role: 'system', content: `The user is seeing: \n${codeBlock(html)}` },
    { role: 'user', content: prompt }
  ]
  console.error('RAW PROMPT ========\n', messages)
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages
  })
  const output = completion.data.choices[0].message
  if (!output.content) return console.error('DANTE wierd>', output)

  const lines = output.content
    .replace(/([^\n])```/g, '$1\n```')
    .replace(/```([^\n])/g, '```$1\n')
    .split('\n')
  let mode = false
  let block = ''
  let chat = ''
  for (const line of lines) {
    if (/^```/.test(line) && mode) break // stop after first block
    else if (/^```/.test(line)) mode = !mode
    else if (!mode) chat += line
    else block += line
  }
  console.log(chat)
  try {
    block = pretty(block)
  } catch (err) {
    console.error('cleanup failed', err)
  }
  return block
}
