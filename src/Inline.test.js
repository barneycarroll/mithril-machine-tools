import t from '../harness.js'

import Inline from '../src/Inline.js'

t.test('Inline', t => {
  t.test('Consumes and processes inline component declarations', t => {
    t.test('In POJO form', t => {
      m.mount(document.body, {
        view: () =>
          m(Inline, {
            view: () => 'foo',
          }),
      })

      t.equal(document.body.textContent, 'foo')
    })

    t.test('In closure form', t => {
      m.mount(document.body, {
        view: () =>
          m(Inline, () => ({
            view: () => 'bar',
          })),
      })

      t.equal(document.body.textContent, 'bar')
    })
  })

  t.test('Maintains state', t => {
    t.test('In POJO form', t => {
      m.mount(document.body, {
        view: () =>
          m(Inline, {
            view: v =>
              v.state.count,

            oninit: v => {
              v.state.count = 0
            },

            oncreate: v => {
              t.equal(document.body.textContent, '0')

              v.state.count = 1

              m.redraw()
            },

            onupdate: v => {
              t.equal(document.body.textContent, '1')

              t.end()
            },
          }),
      })
    })

    t.test('In closure form', t => {
      m.mount(document.body, {
        view: () =>
          m(Inline, () => {
            let count = 0

            return {
              view: v =>
                count,

              oncreate: v => {
                t.equal(document.body.textContent, '0')

                count = 1

                m.redraw()
              },

              onupdate: v => {
                t.equal(document.body.textContent, '1')

                t.end()
              },
            }
          }),
      })
    })
  })

  t.test('Keys rese', t => {
    t.test('In POJO form', t => {
      m.mount(document.body, {
        view: () =>
          m(Inline, {
            view: v =>
              v.state.count,

            oninit: v => {
              v.state.count = 0
            },

            oncreate: v => {
              t.equal(document.body.textContent, '0')

              v.state.count = 1

              m.redraw()
            },

            onupdate: v => {
              t.equal(document.body.textContent, '1')

              t.end()
            },
          }),
      })
    })

    t.test('In closure form', t => {
      m.mount(document.body, {
        view: () =>
          m(Inline, () => {
            let count = 0

            return {
              view: v =>
                count,

              oncreate: v => {
                t.equal(document.body.textContent, '0')

                count = 1

                m.redraw()
              },

              onupdate: v => {
                t.equal(document.body.textContent, '1')

                t.end()
              },
            }
          }),
      })
    })
  })
})