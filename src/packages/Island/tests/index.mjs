if(!window){
  global.window   = require('mithril/test-utils/browserMock.js')()
  global.document = window.document;

  var m = window.require('mithril')
  var o = window.require('mithril/ospec')
}
else {
  var {m, o} = window
}

const render = x => {
  m.render(document.body, x)
}
const mount  = x => {
  m.mount(document.body, x)
}
const frames = (n = 1) =>
  n && new Promise(window.requestAnimationFrame).then(() => frames(n - 1))

import('../index.mjs').then(({default: Island}) => {
  o.spec('Island', () => {
    o.beforeEach(() => {
      document.body.replaceWith(document.createElement('body'))
    })

    o.spec('consumes a function child', () => {
      o('which is invoked, & whose contents are immediately yielded', () => {
        render(
          m(Island, () => 'Hi')
        )

        o(document.body.firstChild.nodeValue).equals('Hi')
      })

      o('which receives an API of structure {first: Boolean, local: Boolean, redraw: Function}', () => {
        render(
          m(Island, API => {
            o(typeof API.first).equals('boolean')
            o(typeof API.local).equals('boolean')
            o(typeof API.redraw).equals('function')
          })
        )
      })
    })

    o.spec('`redraw`', () => {
      o('can be called to trigger isolated redraws', async (done, timeout) => {
        timeout(40)

        let global
        let local

        {
          const Global = {
            oninit: v => {
              global = v.state
              v.state.draws = 0
            },
            view: v =>
              ++v.state.draws,
          }
          const Local = {
            oninit: v => {
              local = v.state
              v.state.draws = 0
            },
            view: v =>
              ++v.state.draws,
          }

          mount({
            view: () => [
              m(Global),

              m(Island, ({ redraw }) =>
                m(Local, {
                  oncreate: () => {
                    frames(1).then(() => {
                      redraw()
                    })
                  },
                })
              )
            ]
          })
        }

        o(global.draws).equals(1)
        o(local.draws).equals(1)

        await frames(1)

        o(global.draws).equals(1)
        o(local.draws).equals(2)

        done()
      })

      o('can wrap event handlers to auto-trigger isolated redraws', async (done, timeout) => {
        timeout(40)

        let global
        let local
        let clicked

        {
          const Global = {
            oninit: v => {
              global = v.state
              v.state.draws = 0
            },
            view: v =>
              ++v.state.draws,
          }
          const Local = {
            oninit: v => {
              local = v.state
              v.state.draws = 0
            },
            view: v =>
              ++v.state.draws,
          }

          mount({
            view: () => [
              m(Global),

              m(Island, ({ redraw }) => [
                m(Local),

                m('button', {
                  onclick: redraw(e => {
                    clicked = true
                  })
                })
              ])
            ]
          })
        }

        o(global.draws).equals(1)
        o(local.draws).equals(1)

        {
          const click = document.createEvent('MouseEvent')

          click.initEvent('click')

          document.body.lastChild.dispatchEvent(click)
        }

        o(clicked).equals(true)

        await frames(1)

        o(global.draws).equals(1)
        o(local.draws).equals(2)

        done()
      })
    })

    o('`local` flag', async (done, timeout) => {
      timeout(40)

      mount({
        view: () =>
          m(Island, ({ local, redraw }) =>
            m('div', {
              oncreate: () => {
                o(local).equals(false)
                  ('is `false` during higher order draws')

                frames(1).then(redraw)
              },

              onupdate: () => {
                o(local).equals(true)
                  ('is `true` during local order draws')

                done()
              },
            })
          )
      })
    })

    o('`first` flag', (done, timeout) => {
      timeout(80)

      const tests = [
        ({first, redraw}) => {
          o(first).equals(true)
            ('is `true` on first draw')

          frames(1).then(redraw)
        },

        ({first}) => {
          o(first).equals(false)
            ('is `false` on local redraw')

          frames(1).then(m.redraw)
        },

        ({first}) => {
          o(first).equals(false)
            ('is `false` on global redraws')

          done()
        },
      ]

      mount({
        view: () =>
          m(Island, API =>
            tests.shift(API)
          )
      })
    })
  })

  o.run()
})
