const frame = () =>
  new Promise(requestAnimationFrame)

const Counter = {
  ...Inline(),
  counter: 0,
}

m.mount(document.documentElement, () => {
  let key   = 0
  let draws = 0

  return {
    oncreate: () => {
      window.initial = document.documentElement.vnodes
    },
    view: () => [
      m('head',
        m('style', `
          body {
            font-family :sans-serif
          }
        `)
      ),

      m('body',
        m('h1', 'Island component demo'),

        m('p', 'This is a demonstration of the ', m('code', 'Island'), ' component.'),

        m('p', 'We also use the ', m('code', 'Inline'), ' component for the purpose of holding state in a series of nested, single-use components. Please read the source for more information.'),

        m('p', 'External component (drawn ', ++draws, ' times)'),

        m('button', {
          onclick: e => {
            key++
          },
        }, 'Re-initialise the Island?'),

        m('button', {
          onclick: e => {},
        }, 'No-op redraw'),

        [
          m(Inline, {key}, () => {
            let animation = 0

            return {
              view: () =>
                m(Island, ({redraw, local}) =>
                  m('p', {
                    key,
                    style  : {
                      border    : '1px solid',
                      padding   : '1em',
                      transform : 'scale(' + animation / 200 + ')',
                      opacity   : animation / 200,
                    },
                    oninit : async () => {
                      while(animation < 200){
                        await frame()

                        animation++

                        redraw()
                      }
                    },
                  },
                    'Island draws: ', animation,

                    m('br'),

                    m(Counter, {
                      onbeforeupdate: () =>
                        !local,

                      view: ({state}) => [
                        'Nested component (drawn ',
                        ++state.counter,
                        ' times)',
                      ],
                    }),
                  )
                )
            }
          }),
        ],
      ),
    ]
  }
})
