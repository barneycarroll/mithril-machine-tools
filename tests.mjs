import {createRequire} from 'module'
import {readdirSync}   from 'fs'

const require = createRequire(import.meta.url)

const { JSDOM } = require('jsdom')
const o         = require('ospec')

global.o = o

o.beforeEach(() => {
  const dom = new JSDOM('', { pretendToBeVisual: true })

  Object.assign(global, {
    document              : dom.window.document,
    window                : dom.window,
    requestAnimationFrame : dom.window.requestAnimationFrame,
  })

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
