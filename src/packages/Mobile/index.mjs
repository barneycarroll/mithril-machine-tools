import Island from 'src/packages/Island/index.mjs'
import latest from 'src/utils/latest.mjs'
import tick from 'src/utils/tick.mjs'

let registered = {}
let present    = {}

const patchPhase   = latest(() => tick(1))
const cleanupPhase = latest(() => tick(2))

const queuePatch   = async () => {
  await patchPhase()

  // Magic!
}

const queueCleanup = async () => {
  await cleanupPhase()

  registered = present
  present    = {}
}

export default {
  view: v => (
    queuePatch(),
    queueCleanup(),

    present[v.key] = v,

    m(Island, island => (
      v.state.island = island,

      m.fragment({
        onbeforeupdate: () => local,
      },
          local
        ?
          children
        :
          m('script[placeholder]', {
            oncreate: ({dom}) => {
              v.state.placeholder = dom.cloneNode()
            }
          })
      )
    ))
  ),

  onbeforeremove: v => {
    v.dom.replaceWith(v.state.placeholder)
  },
}
