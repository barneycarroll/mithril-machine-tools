import Static from '../src/Static.mjs'

o.spec('Static', () => {
  o.spec('API', () => {
    o('Implements viewOf', () => {
      m.render(document.body,
        m(Static, () => 0)
      )

      o(document.body.textContent).equals('0')
    })

    o('Exposes Live component, which implements viewOf', () => {
      m.render(document.body,
        m(Static, Live =>
          m(Live, () => 1) 
        )
      )

      o(document.body.textContent).equals('1')
    })
  })

  o('Contents do not update', () => {
    let count = 0

    m.mount(document.body, {
      view: () => [
        count,

        m(Static, () => count),
      ]
    })

    count++

    m.redraw.sync()

    o(document.body.textContent).equals('10')
  })


  o('Live contents do update', () => {
    let count = 0

    m.mount(document.body, {
      view: () => [
        count,

        m(Static, Live => [
          count,

          m(Live, () => count),
        ]),
      ]
    })

    o(document.body.textContent).equals('000')

    count++

    m.redraw.sync()

    o(document.body.textContent).equals('101')
  })
})