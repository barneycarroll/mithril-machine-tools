import {viewOf} from '../src/_utils.js'

o.spec('viewOf', () => {
  o.spec('Infers a supplied view function from a given node and exposes its return value', () => {
    const Component = {
      view: v => viewOf(v)('foo'),
    }

    o('with view functions supplied as named arguments', () => {
      m.mount(document.body, {
        view: () => 
          m(Component, {
            view: x => x + 1,
          }),
      })

      o(document.body.textContent).equals('foo1')
    })

    o('with view functions supplied as the first child', () => {
      m.mount(document.body, {
        view: () => 
          m(Component,
            x => x + 2,
          ),
      })

      o(document.body.textContent).equals('foo2')
    })

    o('returning children directly', () => {
      m.mount(document.body, {
        view: () => 
          m(Component, 3),
      })

      o(document.body.textContent).equals('3')
    })
  })
})