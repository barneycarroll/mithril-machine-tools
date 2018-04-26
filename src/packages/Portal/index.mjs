import /* m from */ 'mithril'
import Island from 'src/packages/Island/index.mjs'
import tick from 'src/utils/tick.mjs'

let contents = {}

export const Inlet = {
  view: ({key, children}) => {
    contents[key] = children
  }
}

export const Outlet = {
  view: ({key, children: [{children: view} = {}]}) => (
    tick(2).then(() => {
      contents = {}
    }),

    m(Island, ({local, redraw}) => (
        contents[key]
      &&
        (
            view
          ?
            view(contents[key])
          :
            contents[key]
        )
      ||
        !local
      &&
        tick(1).then(() => {
          if(contents[key])
            redraw()
        })
      &&
        m('script[type=placeholder]')
    ))
  )
}
