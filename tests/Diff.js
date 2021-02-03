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

              const [
                [currentVnode, previousVnode], 
                [currentValue, previousValue]
              ] = signature

              o('1st argument is 2 vnodes', () => {
                [currentVnode, previousVnode].forEach(x => {
                  o(Object.keys(x)).deepEquals(Object.keys(m(Diff)))
                })

                let { tag, value } = currentVnode

                o({ tag, value }).deepEquals({
                  tag: Diff,
                  value: 'value2',
                })
                  `The present vnode`

                ({ tag, value }) = previousVnode

                o({ tag, value }).deepEquals({
                  tag: Diff,
                  value: 'value1',
                })
                  `And the previous`
              })
            })
          })
        })
      })
    })
  })
})