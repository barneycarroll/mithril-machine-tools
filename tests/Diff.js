import Diff from '../src/Diff.js'

o.spec('Diff', () => {
  o.spec('API', () => {
    o('Implements viewOf', () => {
      m.render(document.body,
        m(Diff, () => 0)
      )

      o(document.body.textContent).equals('0')
    })

    o.spec('Consumes an arbitrary `value` attribute, and optional `before` & `after` attribute methods', () => {
      m.render(document.body,
        m(Diff, {value: 'value1'})
      )

      const sequence = []

      m.render(document.body,
        m(Diff, {
          value: 'value2',
          before(...signature){
            sequence.push({method: 'before', signature})
          },
          after(...signature){
            sequence.push({method: 'after', signature})
          },
          view(...signature){
            sequence.push({method: 'view', signature})
          },
        })
      )

      o.spec('When `value` changes', () => {
        o('The supplied methods execute in order', () => {
          o(sequence.map(x => x.method)).deepEquals(['before', 'view', 'after'])
        })
        
        o.spec('Each method is called with the same signature', () => {
          sequence.forEach(({method, signature}) => {
            o.spec(method, () => {
              o('2 arguments, both arrays of 2 items', () => {
                o(signature.length).equals(2)
                o(signature[0].length).equals(2)
                o(signature[1].length).equals(2)
              })

              o('1st argument is 2 vnodes', () => {
                const [vnodes] = signature

                vnodes.forEach(x => {
                  o(Object.keys(x)).deepEquals(Object.keys(m(Diff)))
                })

                let {tag, attrs: {value}} = vnodes[0]

                o({tag, value}).deepEquals({
                  tag   : Diff,
                  value : 'value2',
                })
                  `The present vnode`

                void ({tag, attrs:{value}} = vnodes[1])

                o({tag, value}).deepEquals({
                  tag   : Diff,
                  value : 'value1',
                })
                  `And the previous`
              })

              o('2nd argument is current & previous `value` attributes', () => {
                const values = signature[1]
                
                o(values).deepEquals([
                  'value2',
                  'value1',
                ])
              })
            })
          })
        })
      })

      o.spec('When `value` does not change', () => {
        const [before, view, after] = [o.spy(), o.spy(), o.spy()]

        m.render(document.body, 
          m(Diff, {
            value: 'value2',
            before,
            view,
            after,
          })
        )

        o('`before` is not called', () => {
          o(before.callCount).equals(0)
        })

        o('`after` is not called', () => {
          o(after.callCount).equals(0)
        })

        o('`view` is called & retains signature', () => {
          o(view.callCount).equals(1)

          const [vnodes, values] = view.calls[0].args

          vnodes.forEach(vnode => {
            const {tag, attrs: {value}} = vnode

            o({tag, value}).deepEquals({
              tag   : Diff,
              value : 'value2',
            })
          })

          o(values).deepEquals(['value2', 'value2'])
        })
      })
    })

    o('Optional `initial` property, if true, counts initial draw as representing a diff', () => {
      const [before, after] = [o.spy(), o.spy()]

      m.render(document.body,
        m(Diff, {
          initial: true,
          value: 'value',
          before,
          after,
        })
      )

      void [before, after].forEach(spy => {
        o(spy.callCount).equals(1)

        const [vnodes, values] = spy.calls[0].args

        o(vnodes[1]).equals(undefined)
        o(values[1]).equals(undefined)
      })
    })

    o('If no `value` is provided, each method runs on every draw', () => {
      const [before, view, after] = [o.spy(), o.spy(), o.spy()]

      m.render(document.body, 
        m(Diff, {before, view, after})
      )

      m.render(document.body, 
        m(Diff, {before, view, after})
      )

      void [before, view, after].forEach(method => {
        o(method.callCount).equals(2)
      })
    })
  })
})