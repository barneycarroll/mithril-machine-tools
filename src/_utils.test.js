import t from '../harness.js'

import { viewOf } from '../src/_utils.js'

t.test('viewOf', t => {
  t.test('Infers a supplied view function from a given node and exposes its return value', t => {
    const Component = {
      view: v => viewOf(v)('foo'),
    }

    t.test('with view functions supplied as named arguments', t => {
      m.mount(document.body, {
        view: () =>
          m(Component, {
            view: x => x + 1,
          }),
      })

      t.equal(document.body.textContent, 'foo1')
    })

    t.test('with view functions supplied as the first child', t => {
      m.mount(document.body, {
        view: () =>
          m(Component,
            x => x + 2,
          ),
      })

      t.equal(document.body.textContent, 'foo2')
    })

    t.test('returning children directly', t => {
      m.mount(document.body, {
        view: () =>
          m(Component, 3),
      })

      t.equal(document.body.textContent, '3')
    })
  })
})