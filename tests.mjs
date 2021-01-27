import {createRequire} from 'module'
import {readdirSync}   from 'fs'

const require = createRequire(import.meta.url)

const { JSDOM } = require('jsdom')

const dom = new JSDOM('', { pretendToBeVisual: true })

Object.assign(global, {
  document             : dom.window.document,
  window               : dom.window,
  requestAnimationFrame: dom.window.requestAnimationFrame,
})

Object.assign(global, {
  o: require('ospec'),
  m: require('mithril'),
})

o.afterEach(() => {
  document.body.innerHTML = ''
})

Promise.all(
  readdirSync('./tests')
    .filter(file =>
      file.endsWith('.mjs')
    )
    .map(file =>
      import('./tests/' + file) 
    )
)
  .then(() => {
    o.run()
  })
