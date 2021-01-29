import {createRequire} from 'module'
import {readdirSync}   from 'fs'

const require = createRequire(import.meta.url)

const { JSDOM } = require('jsdom')

const dom = new JSDOM('', { pretendToBeVisual: true })

Object.assign(global, {
  window               : dom.window,
  document             : dom.window.document,
  requestAnimationFrame: dom.window.requestAnimationFrame,
})

Object.assign(global, {
  o: require('ospec'),
  m: require('mithril'),
})

o.afterEach(() => {
  document.body.innerHTML = ''

  delete document.body.vnodes
})

Promise.all(
  readdirSync('./tests')
    .filter(file =>
      file.endsWith('.js')
    )
    .map(file =>
      import('./tests/' + file) 
    )
)
  .then(() => {
    o.run()
  })
