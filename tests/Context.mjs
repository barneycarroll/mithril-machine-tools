import createContext from '../src/Context.mjs'

o.spec('Context', () => {
  o.spec('API', () => {
    var Context

    o('Exports a factory returning Provider and Receiver components', () => {
      Context = createContext()

      m.render(document.body, [
        m(Context.Provider),
        m(Context.Receiver),
      ])
    })

    o('Provider component passes through children', () => {
      m.render(document.body,
        m(Context.Provider, 'foo'),
      )

      o(document.body.textContent).equals('foo')
    })

    o('Receiver component implements viewOf', () => {
      m.render(document.body,
        m(Context.Receiver, () => 'bar'),
      )

      o(document.body.textContent).equals('bar')
    })
  })

  o('Attributes supplied to Provider are exposed to descendant Receiver', () => {
    const contextIn = { foo: 'bar' }

    m.render(document.body,
      m(Context.Provider, contextIn,
        m(Context.Receiver, contextOut => {
          o(contextOut).deepEquals(contextIn)
          o(contextOut).notEquals( contextIn)
        }),
      ),
    )

  })

  o('Lower order attributes override higher order', () => {
    m.render(document.body,
      m(Context.Provider, {
        foo: 'bar',
        fizz: 'buzz'
      },
        m(Context.Provider, {
          foo: 'baz',
        },
          m(Context.Receiver, contextOut => {
            o(contextOut).deepEquals({
              foo: 'baz',
              fizz: 'buzz',
            })
          }),
        ),
      ),
    )
  })
})