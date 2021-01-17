import Inline from '../src/Inline.js'

o.spec('Inline', () => {
  o.spec('Consumes and processes inline component declarations', () => {
    o('In POJO form', () => {
      m.mount(document.body, {
        view: () =>
          m(Inline, {
            view: () => 'foo',
          }),
      })

      o(document.body.textContent).equals('foo')
    })
    
    o('In closure form', () => {
      m.mount(document.body, {
        view: () =>
          m(Inline, () => ({
            view: () => 'bar',
          })),
      })

      o(document.body.textContent).equals('bar')
    })
  })

  o.spec('Maintains state', () => {
    o('In POJO form', () => new Promise(resolve => {
      m.mount(document.body, {
        view: () =>
          m(Inline, {
            view: v => 
              v.state.count,

            oninit: v => {
              v.state.count = 0
            },

            oncreate: v => {
              o(document.body.textContent).equals('0')

              v.state.count = 1

              m.redraw()
            },

            onupdate: v => {
              o(document.body.textContent).equals('1')

              resolve()
            },
          }),
      })
    }))
      
    o('In closure form', () => new Promise(resolve => {
      m.mount(document.body, {
        view: () =>
          m(Inline, () => {
            let count = 0

            return {
              view: v => 
                count,

              oncreate: v => {
                o(document.body.textContent).equals('0')

                count = 1

                m.redraw()
              },

              onupdate: v => {
                o(document.body.textContent).equals('1')

                resolve()
              },
            }
          }),
      })
    }))
  })

  o.spec('Keys rese', () => {
    o('In POJO form', () => new Promise(resolve => {
      m.mount(document.body, {
        view: () =>
          m(Inline, {
            view: v => 
              v.state.count,

            oninit: v => {
              v.state.count = 0
            },

            oncreate: v => {
              o(document.body.textContent).equals('0')

              v.state.count = 1

              m.redraw()
            },

            onupdate: v => {
              o(document.body.textContent).equals('1')

              resolve()
            },
          }),
      })
    }))
      
    o('In closure form', () => new Promise(resolve => {
      m.mount(document.body, {
        view: () =>
          m(Inline, () => {
            let count = 0

            return {
              view: v => 
                count,

              oncreate: v => {
                o(document.body.textContent).equals('0')

                count = 1

                m.redraw()
              },

              onupdate: v => {
                o(document.body.textContent).equals('1')

                resolve()
              },
            }
          }),
      })
    }))
  })
})