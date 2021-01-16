import Inline from '../src/Inline.mjs'

o.spec('Inline', () => {
  o.spec('Consumes and processes inline component declarations', () => {
    o('In POJO form', async () => {
      m.render(document.body, 
        m(Inline, {
          view: () => 'foo',
        }),
      )
      
      o(document.body.textContent).equals('foo')
    })
    
    o('In closure form', () => {
      m.render(document.body, 
        m(Inline, () => ({
          view: () => 'bar',
        })),
      )
      
      o(document.body.textContent).equals('bar')
    })
  })
  
  o.spec('Maintains state', () => {
    o('In POJO form', async () => {
      m.mount(document.body, {
        view: () =>
          m(Inline, {
            view: v =>
              v.state.count,
            
            oninit: v => {
              v.state.count = 0
            },
            
            oncreate: v => {
              v.state.count = 1
            },
          }),
      })

      o(document.body.textContent).equals('0')
      
      m.redraw()
      
      await new Promise(requestAnimationFrame)

      o(document.body.textContent).equals('1')
    })
    
    o('In closure form', async () => {
      m.mount(document.body, {
        view: () =>
          m(Inline, () => {
            let count = 0
            
            return {
              view: () =>
                count,

              oncreate: () => {
                count = 1
              },
            }
          }),
      })

      o(document.body.textContent).equals('0')

      m.redraw()

      await new Promise(requestAnimationFrame)

      o(document.body.textContent).equals('1')
    })
  })
  
  o.spec('Keys reset', async () => {
    o('In POJO form', async () => {
      const Component = {
        view: () => '',

        oninit: o.spy(),

        onupdate: o.spy(),
      }

      let key = 0

      m.mount(document.body, {
        view: () => [
          m(Inline, {key, ...Component}),
        ],
      })

      key++

      m.redraw()

      await new Promise(requestAnimationFrame)

      o(Component.oninit.callCount)
        .equals(2)

      o(Component.onupdate.callCount)
        .equals(0)
    })
    
    o('In closure form', async () => {
      const oninit   = o.spy()
      const onupdate = o.spy()

      const Component = () => {
        return {
          view: () => '',

          oninit,

          onupdate,
        }
      }

      let key = 0

      m.mount(document.body, {
        view: () => [
          m(Inline, {key}, Component),
        ],
      })

      key++

      m.redraw()

      await new Promise(requestAnimationFrame)

      o(oninit.callCount)
        .equals(2)

      o(onupdate.callCount)
        .equals(0)
    })
  })
})