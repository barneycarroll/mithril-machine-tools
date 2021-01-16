import { domOf, viewOf } from './_utils.mjs'

export default function Mobile() {
  const creating = new Map
  const removing = new Map

  return {
    view: v =>
      viewOf(v)(Unit),

    oncreate: reconcile,
    onupdate: reconcile,
  }

  function Unit(vnode) {
    creating.set(vnode.key, { vnode })

    return {
      view: ({ children }) => [
        m.fragment(vnode.domSize ? children : undefined),
        '',
      ],

      onbeforeremove: vnode => new Promise(resolve => {
        vnode.removing = true

        removing.set(vnode.key, { vnode, resolve })
      }),

      onremove: vnode => {
        if (!vnode.removing)
          removing.set(vnode.key, { vnode, resolve() { } })
      },
    }
  }

  function reconcile() {
    creating.forEach(({ vnode: now }, key) => {
      const parent = now.dom.parentNode
      const modulo = now.dom.parentNode.vnodes

      if (!removing.has(key)) {
        parent.vnodes = now.instance.children

        m.render(parent, [m.fragment(now.children), ''], m.redraw)

        now.instance.children[0] = parent.vnodes[0]

        parent.vnodes = modulo
      }
      else {
        const { vnode: then, resolve } = removing.get(key)

        removing.delete(key)

        if (then.instance.children[0].dom) {
          const frag = document.createDocumentFragment()

          frag.append(...domOf(then.instance.children[0]))

          parent.insertBefore(frag, now.dom.nextSibling)
        }

        parent.vnodes = [
          then.instance.children[0],
          now.instance.children[1],
        ]

        m.render(parent, [m.fragment(now.children), ''], m.redraw)

        then.instance.children[0] = now.instance.children[0]

        now.instance.children[0] = parent.vnodes[0]

        parent.vnodes = modulo

        resolve()
      }
    })

    removing.forEach(({ resolve }) => {
      resolve()
    })

    creating.clear()
    removing.clear()
  }
}