import Promiser from '../src/Promiser.js'

o.spec('Promiser', () => {
  o.beforeEach(() => {
    m.render(document.body, null)
  })

  o('Consumes a `promise` and implements the `viewOf` interface', async () => {
    const promise = Promise.resolve()

    m.mount(document.body, {
      view: () =>
        m(Promiser, {promise}, () => 
          'foo',
        ),
    })

    await new Promise(requestAnimationFrame)
    
    o(document.body.textContent).equals('foo')
  })

  o.spec('Exposes a object describing project state', () => {
    o('Pending', async () => {
      let state
      const promise = new Promise(() => {})
  
      m.mount(document.body, {
        view: () =>
          m(Promiser, {promise}, value => {
            state = value
          }),
      })
  
      await new Promise(requestAnimationFrame)
      
      o(state.pending ).equals(true)
      o(state.settled ).equals(false)
      o(state.error   ).equals(undefined)
      o(state.value   ).equals(undefined)
      o(state.rejected).equals(undefined)
      o(state.resolved).equals(undefined)
    })
    
    o('Resolved', async () => {
      let state
      let resolve
      const promise = new Promise((value, {}) => {
        resolve = value
      })
  
      m.mount(document.body, {
        view: () =>
          m(Promiser, {promise}, value => {
            state = value
          }),
      })
      
      await new Promise(requestAnimationFrame)
      
      o(state.pending ).equals(true)
      
      resolve('foo')

      await new Promise(requestAnimationFrame)
      await new Promise(requestAnimationFrame)
      
      o(state.pending ).equals(false)
      o(state.settled ).equals(true)
      o(state.error   ).equals(undefined)
      o(state.value   ).equals('foo')
      o(state.rejected).equals(false)
      o(state.resolved).equals(true)
    })
    
    o('Rejected', async () => {
      let state
      let reject
      const promise = new Promise(({}, value) => {
        reject = value
      })
  
      m.mount(document.body, {
        view: () =>
          m(Promiser, {promise}, value => {
            state = value
          }),
      })

      o(state.pending ).equals(true)
      
      reject('bar')

      await new Promise(requestAnimationFrame)
      await new Promise(requestAnimationFrame)
      
      o(state.pending ).equals(false)
      o(state.settled ).equals(true)
      o(state.error   ).equals('bar')
      o(state.value   ).equals(undefined)
      o(state.rejected).equals(true)
      o(state.resolved).equals(false)
    })
  })
})