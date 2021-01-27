import Waiter from '../src/Waiter.mjs'

o.spec('Waiter', () => {
  o.spec('API', () => {
    o('Implements viewOf', () => {
      m.render(document.body,
        m(Waiter, () => 0)
      )

      o(document.body.textContent).equals('0')
    })

    o('Exposes Service component, which passes through children', () => {
      m.render(document.body,
        m(Waiter, Service =>
          m(Service, 1)
        )
      )

      o(document.body.textContent).equals('1')
    })
  })

  o('On removal trigger, Services immediate children with onbeforeremove', async () => {
    let present = true

    const resolutions = []

    const onremove       = o.spy()
    const onbeforeremove = o.spy(() =>
      new Promise(y => {
        resolutions.push(y)
      })
    )

    m.mount(document.body, {
      view: () =>
        present &&
          m(Waiter, {onremove}, Service => [
            m(Service, m('div', {onbeforeremove})),

            m(Service, m('div', {onbeforeremove})),
          ]),
    })

    present = false

    m.redraw.sync()

    o(onremove.callCount).equals(0)
      `Delay Waiters removal`

    o(onbeforeremove.callCount).equals(2)
      `Trigger Serviced onbeforeremoves`

    resolutions[0]()

    await Promise.resolve()

    m.redraw.sync()

    o(onremove.callCount).equals(0)
      `Delay Waiters removal`

    resolutions[1]()

    await Promise.resolve()
    
    m.redraw.sync()

    o(onremove.callCount).equals(1)
      `Wait for Serviced onbeforeremoves resolve`
  })

  o('On removal trigger, nearby onbeforeremoves', () => {
    let present = true

    const onremove       = o.spy()
    const onbeforeremove = o.spy()

    m.mount(document.body, {
      view: () =>
        present &&
          m(Waiter, {onremove}, Service => [
            m('div', {onbeforeremove}),

            m(Service, {onbeforeremove}),

            m(Service, 
              m('div',
                m('div', {onbeforeremove}),
              ),
            ),
          ]),
    })

    present = false

    m.redraw.sync()

    o(onremove.callCount).equals(1)
      `Do not delay Waiters removal`

    o(onbeforeremove.callCount).equals(0)
      `Do not get triggered`
  })
})