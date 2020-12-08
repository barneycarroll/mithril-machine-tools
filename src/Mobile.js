// High-order Mobile component exposes low-order Unit component.
// When a Unit of a given {id} attribute appears at a new location in the subtree,
// a Unit of the same {id} having disappeared from another location will be persisted.
// Units are equivalent to keyed list items, but don't need to be contiguous exclusive children of a single parent node.
import Island from './Island.js'

export function Mobile() {
  const arriving = new Map

  return {
    view: v => 
      viewOf(v)(Unit),
  }

  function Unit({key, children}){
    const island = {}

    return {
      view: () =>
        m(Island, api => Object.assign(island, api)),

      onupdate: () => {
        island.render(children)
      },
      
      oncreate: () => {
        if(!removing.has(key))
          arriving.set(key, {...island, children})
        
        else {
          const previous = removing.get(key)

          island.patch(previous.vnode)
          island.render(children)
        }
      },

      onremove: () => {
        if (!arriving.has(key))
          removing.set(key, island)
        
        else {
          const current = arriving.get(key)

          current.patch(island.vnode)
          current.render(current.children)
        }
      },
    }
  }
}