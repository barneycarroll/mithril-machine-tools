import Mobile from '../src/Mobile.mjs'

o.spec('Mobile', () => {
  o.spec('API', () => {
    o('Implements viewOf', () => {
      m.render(document.body,
        m(Mobile, () => 0)
      )

      o(document.body.textContent).equals('0')
    })

    o('Exposes Unit component, which passes through children', () => {
      m.render(document.body,
        m(Mobile, Unit =>
          m(Unit, 1)
        )
      )

      o(document.body.textContent).equals('1')
    })
  })

  o('Keyed Units contents retain DOM & vnode identity when moving outside of immediate parents', () => {
    const draw0 = []
    const draw1 = []

    m.render(document.body,
      m(Mobile, Unit => [
        m('div', 
          m(Unit, {key: 'foo'}, m('div', {
            oncreate: v => draw0.push(v),
          })),
        ),

        m('div',
          m(Unit, {key: 'bar'}, m('div', {
            oncreate: v => draw0.push(v),
          })),
        ),
      ]),
    )

    m.render(document.body,
      m(Mobile, Unit => [
        m('div',
          m(Unit, {key: 'bar'}, m('div', {
            onupdate: v => draw1.push(v),
          })),
        ),

        m('div',
          m(Unit, {key: 'foo'}, m('div', {
            onupdate: v => draw1.push(v),
          })),
        ),
      ]),
    )

    o(draw0[0].dom  ).equals(draw1[1].dom  )
    o(draw0[0].state).equals(draw1[1].state)
    o(draw0[1].dom  ).equals(draw1[0].dom  )
    o(draw0[1].state).equals(draw1[0].state)
  })
})