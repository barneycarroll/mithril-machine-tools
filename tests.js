import {createRequire} from 'module'
import {readdirSync}   from 'fs'

import {parseHTML} from 'linkedom'

const require = createRequire(import.meta.url)

const dom = parseHTML(`
<!doctype html>
<html lang="en">
  <head>
    <title>Mithril Machine Tools</title>
  </head>
  <body>
  </body>
</html>
`)

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
