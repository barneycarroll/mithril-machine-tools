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
const frame = (n = 1) =>
  n && new Promise(window.requestAnimationFrame).then(() => frame(n - 1))

import('../src/index.mjs').then(({default: Island}) => {
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
      let higher
      let lower

      let Higher
      let Lower

      o.beforeEach(() => {
        higher = undefined
        lower  = undefined

        Higher = {
          oninit: v => {
            higher = v.state
            v.state.draws = 0
          },
          view: v =>
            ++v.state.draws,
        }
        Lower = {
          oninit: v => {
            lower = v.state
            v.state.draws = 0
          },
          view: v =>
            ++v.state.draws,
        }
      })

      o('can be called to trigger isolated redraws', async () => {
        mount({
          view: () => [
            m(Higher),

            m(Island, ({ redraw }) =>
              m(Lower, {
                oncreate: async () => {
                  await frame()

                  redraw()
                },
              })
            )
          ]
        })

        o(higher.draws).equals(1)
        o(lower.draws).equals(1)

        await frame()

        o(higher.draws).equals(1)
        o(lower.draws).equals(2)
      })

      o('can wrap event handlers to auto-trigger isolated redraws', async () => {
        let clicked

        mount({
          view: () => [
            m(Higher),

            m(Island, ({ redraw }) => [
              m(Lower),

              m('button', {
                onclick: redraw(e => {
                  clicked = true
                })
              })
            ])
          ]
        })

        o(higher.draws).equals(1)
        o(lower.draws).equals(1)

        {
          const click = document.createEvent('MouseEvent')

          click.initEvent('click')

          document.body.lastChild.dispatchEvent(click)
        }

        o(clicked).equals(true)

        await frame()

        o(higher.draws).equals(1)
        o(lower.draws).equals(2)
      })
    })

    o('`local` flag', done => {
      mount({
        view: () =>
          m(Island, ({ local, redraw }) =>
            m('div', {
              oncreate: () => {
                o(local).equals(false)
                  ('is `false` during higher order draws')

                frame().then(redraw)
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

    o('`first` flag', done => {
      const tests = [
        ({first, redraw}) => {
          o(first).equals(true)
            ('is `true` on first draw')

          frame().then(redraw)
        },

        ({first}) => {
          o(first).equals(false)
            ('is `false` on local redraw')

          frame().then(m.redraw)
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
