// Consumes a vnode, returns its DOM output
export function domOf({ dom, domSize }) {
  const nodes = dom ? [dom] : []

  while (--domSize)
    nodes.push(dom = dom.nextSibling)

  return nodes
}

// Consumes a map, key & factory
// If key is not present in map, execute factory and assign its output to key in map
// Return value for key in map
export function getSet(map, key, factory) {
  if (map.has(key))
    return map.get(key)

  const value = factory()

  map.set(key, value)

  return value
}

// Consumes a DOM element, returns its index within its parents childNodes
export function indexOf(dom) {
  let index = 0

  while (dom = dom.previousSibling)
    index++

  return index
}

// Utility for components whose view is defined at call site. 
// Allows the following patterns:
// m(X, viewFunction) / m(X, {view: viewFunction}) / m(X, children)
export function viewOf(v) {
  const view = (
    typeof v.children[0] === 'function'
  ?
    v.children[0]
  :
    typeof v.attrs.view === 'function'
  ?
    v.attrs.view
  :
    () => v.children
  )

  return Object.assign(
    view,

    {tag: {view}},
  )
}

// Extract the redraw event from the tree context
export const Redraw = {
  view: () => 
    m('noop', {
      on:{},
  
      oncreate: v => {
        void (v.children[0] || Function.prototype)(v.events._)
      },
    }),
}