import Promiser from '../src/Promiser.js'

o.spec('Promiser', () => {
  o.spec('API', () => {
    o('Consumes a `promise` & implements viewOf', () => {
      const promise = Promise.resolve()

      m.render(document.body,
        m(Promiser, { promise }, () => 'foo'),
      )

      o(document.body.textContent).equals('foo')
    })
  })

  o.spec('Exposes an object describing promise state', () => {
    o('Pending', () => {
      let state

      const promise = new Promise(() => {})
  
      m.mount(document.body, {
        view: () =>
          m(Promiser, {promise}, value => {
            state = value
          }),
      })
      
      o(state).deepEquals({
        pending  : true,
        settled  : false,
        error    : undefined,
        value    : undefined,
        rejected : false,
        resolved : false,
      })
    })
    
    o('Resolved', async () => {
      let state
      let resolve

      const promise = new Promise((y, n) => {
        resolve = y
      })
  
      m.mount(document.body, {
        view: () =>
          m(Promiser, {promise}, value => {
            state = value
          }),
      })
      
      o(state.pending ).equals(true)
      
      resolve('foo')

      await Promise.resolve()

      m.redraw.sync()
      
      o(state).deepEquals({
        pending  : false,
        settled  : true,
        error    : undefined,
        value    : 'foo',
        rejected : false,
        resolved : true,
      })
    })
    
    o('Rejected', async () => {
      let state
      let reject

      const promise = new Promise((y, n) => {
        reject = n
      })
  
      m.mount(document.body, {
        view: () =>
          m(Promiser, {promise}, value => {
            state = value
          }),
      })

      o(state.pending ).equals(true)
      
      reject('bar')

      await Promise.resolve()

      m.redraw.sync()
      
      o(state).deepEquals({
        pending  : false,
        settled  : true,
        error    : 'bar',
        value    : undefined,
        rejected : true,
        resolved : false,
      })
    })
  })
})