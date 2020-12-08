const { JSDOM } = require('jsdom')
const tap       = require('tap')

export default tap

tap.beforeEach(() => {
  const dom = new JSDOM(``, { pretendToBeVisual: true })

  Object.assign(global, {
    document: dom.window.document,
    window: dom.window,
    requestAnimationFrame: dom.window.requestAnimationFrame,
  })

  global.m = require('mithril')  
})

tap.afterEach(() => {
  delete global.document
  delete global.window
  delete global.requestAnimationFrame
  delete global.m
})