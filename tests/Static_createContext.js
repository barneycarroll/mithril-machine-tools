import createContext from '../src/createContext.js'
import Static        from '../src/Static.js'

o('Static + createContext', () => {
  const {Provider, Consumer} = createContext('foo')

  const branch = o.spy()
  const leaf   = o.spy()

  m.render(document.body,
    m(Provider, {value: 'bar'},
      m(Static, Live =>
        m(Branch, {Live}),
      ),
    ),
  )

  o(branch.calls.slice(-1).pop().args[0]).equals('bar')
  o(leaf  .calls.slice(-1).pop().args[0]).equals('bar')

  m.render(document.body,
    m(Provider, {value: 'baz'},
      m(Static, Live =>
        m(Branch, {Live}),
      ),
    ),
  )

  o(branch.calls.slice(-1).pop().args[0]).equals('bar')
  o(leaf  .calls.slice(-1).pop().args[0]).equals('baz')

  function Branch(){
    return {
      view: ({attrs: {Live}}) => [
        m(Consumer, branch),
        m(Live,     () => m(Leaf)),
      ],
    }
  }

  function Leaf(){
    return {
      view: () =>
        m(Consumer, leaf),
    }
  }
})