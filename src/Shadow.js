import { viewOf } from './_utils.js'

let count = 0

export default function Shadow(vnode) {
  let shadow = ++count
  let slots
  let contents

  return {
    view: _ => (
      vnode = _,
      slots = [],
      contents = viewOf(vnode)(Slot),

      m('[style=display:contents]', vnode.attrs)
    ),

    oncreate() {
      vnode.dom.attachShadow({ mode: 'open' })

      render()
    },

    onupdate() {
      render()
    },

    onremove() {
      m.render(vnode.dom.shadowRoot, null)
    },
  }

  function Slot() {
    return {
      view: vnode => (
        slots.push(vnode),

        m('slot', { name: `shadow-${shadow}-slot-${slots.length}` })
      ),
    }
  }

  function render() {
    m.render(
      vnode.dom.shadowRoot,

      contents,

      m.redraw,
    )

    m.render(
      vnode.dom,

      slots.map(({ attrs, children }, index) =>
        m(
          'section[style=display:contents]',

          {
            ...attrs,
            slot: `shadow-${shadow}-slot-${index + 1}`
          },

          children,
        ),
      ),

      m.redraw,
    )
  }
}