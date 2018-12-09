import Waiter from '../src/Waiter.js'

o.spec('Waiter', () => {
  o.beforeEach(() => {
    m.render(document.body, null)
  })
  
  o('Implements the `viewOf` interface, which receives a `Service` component', async () => {
    m.mount(document.body, {
      view: () => 
        m(Waiter, Service =>
          m(Service),
        ),
    })

    await Promise.resolve(requestAnimationFrame)

    o(typeof document.body.vnodes[0].instance.instance).equals('object')
  })
  
  o('Implements the `viewOf` interface, which receives a `Service` component', async () => {
    m.mount(document.body, {
      view: () => 
        m(Waiter, Service =>
          m(Service),
        ),
    })

    await Promise.resolve(requestAnimationFrame)

    o(typeof document.body.vnodes[0].instance.instance).equals('object')
  })
  
  o('`Service` component outputs its children directly', async () => {
    m.mount(document.body, {
      view: () => 
        m(Waiter, Service =>
          m(Service, 'foo'),
        ),
    })

    await Promise.resolve(requestAnimationFrame)

    o(document.body.vnodes[0].instance.instance.children[0]).equals('foo')
  })
  
  o.spec('When removed', () => {
    o('`Service` childrens `onbeforeremove` hook returns delay DOM removal', async () => {
      const delay = ms => new Promise(done => setTimeout(done, ms))
      let show = true
      let dom

      const Delay = {
        view: () => '',
        onbeforeremove: v => 
          delay(v.attrs.delay),
      }

      m.mount(document.body, {
        view: () => [
          'foo',

          show && 
            m(Waiter, {
              oncreate: v => {
                dom = v.dom
              },
            },
              Service => [
                m(Service, 
                  m(Delay, {delay: 10}) 
                ),
              ]
            ),
        ],
      })

      await Promise.resolve(requestAnimationFrame)

      o(document.body.vnodes[0].instance.instance.children[0]).equals('foo')
    })
  })
})