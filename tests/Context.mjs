import {Provider, Receiver} from '../src/Context.mjs'

o.spec('Context', () => {
  o.spec('API', () => {
    o('Provider component passes through children', () => {
      m.render(document.body,
        m(Provider, 'foo'),
      )

      o(document.body.textContent).equals('foo')
    })

    o('Receiver component implements viewOf', () => {
      m.render(document.body,
        m(Receiver, () => 'bar'),
      )

      o(document.body.textContent).equals('bar')
    })
  })

  o('Attributes supplied to Provider are exposed to descendant Receiver', () => {
    const contextIn = { foo: 'bar' }

    m.render(document.body,
      m(Provider, contextIn,
        m(Receiver, contextOut => {
          o(contextOut).deepEquals(contextIn)
          o(contextOut).notEquals( contextIn)
        }),
      ),
    )

  })

  o('Lower order attributes override higher order', () => {
    m.render(document.body,
      m(Provider, { 
        foo  : 'bar',
        fizz : 'buzz' 
      },
        m(Provider, {
          foo : 'baz',
        },
          m(Receiver, contextOut => {
            o(contextOut).deepEquals({
              foo  : 'baz',
              fizz : 'buzz',
            })
          }),
        ),
      ),
    )
  })
})