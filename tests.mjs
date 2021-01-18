import {createRequire} from 'module'
import {readdirSync}   from 'fs'

const require = createRequire(import.meta.url)

global.o = require('ospec')

o.beforeEach(() => {
  const dom = new JSDOM('', { pretendToBeVisual: true })

  global.window                = require('mithril/test-utils/domMock.js')(),
  global.document              = window.document
  global.requestAnimationFrame = callback =>
    global.setTimeout(callback, 1000 / 60)

  global.m = require('mithril')
})

o.afterEach(() => {
  delete global.document
  delete global.window
  delete global.requestAnimationFrame
  delete global.m
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
