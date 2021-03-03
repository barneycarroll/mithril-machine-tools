import createContext from '../src/createContext.js'

o.spec('Context', () => {
  o.spec('API', () => {
    o('Exports a factory returning Provider and Receiver components', () => {
      const {Provider, Consumer} = createContext()

      m.render(document.body, [
        m(Provider),
        m(Consumer),
      ])
    })

    o('Provider component passes through children', () => {
      const {Provider} = createContext()

      m.render(document.body,
        m(Provider, 'foo'),
      )

      o(document.body.textContent).equals('foo')
    })

    o('Receiver component implements viewOf', () => {
      const {Consumer} = createContext()

      m.render(document.body,
        m(Consumer, () => 'bar'),
      )

      o(document.body.textContent).equals('bar')
    })
  })

  o('Attributes supplied to Provider are exposed to descendant Receiver', () => {
    const {Provider, Consumer} = createContext()

    const contextIn = {foo: 'bar'}

    m.render(document.body,
      m(Provider, {value: contextIn},
        m(Consumer, contextOut => {
          o(contextOut).equals(contextIn)
        }),
      ),
    )
  })

  o('Lower order attributes override higher order', () => {
    const {Provider, Consumer} = createContext()

    m.render(document.body,
      m(Provider, {value: 'foo'},
        m(Provider, {value: 'bar'},
          m(Consumer, context => {
            o(context).equals('bar')
          }),
        ),
      ),
    )
  })

  o('Factory can provide a default value', () => {
    const {Provider, Consumer} = createContext('foo')
    
    m.render(document.body, [
      m(Consumer, context => {
        o(context).equals('foo')
      }),

      m(Provider, {value: 'bar'},
        m(Consumer, context => {
          o(context).equals('bar')
        }),
      ),
    ])
  })

  o('Different contexts co-exist', () => {
    const Context1 = createContext()
    const Context2 = createContext()
    
    m.render(document.body,
      m(Context1.Provider, {value: 'foo'},
        m(Context2.Provider, {value: 'bar'},
          m(Context1.Consumer, context => {
            o(context).equals('foo')
          }),

          m(Context2.Consumer, context => {
            o(context).equals('bar')
          }),
        ),
      ),
    )
  })
})