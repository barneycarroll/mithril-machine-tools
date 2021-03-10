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

  const value = factory(key, map)

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

// Extract the view redraw callback - if bound - from the tree context
export const Redraw = {
  view: () => 
    m('noop', {
      on:{},
  
      oncreate: v => {
        void (v.children[0] || Function.prototype)(v.events._)
      },
    }),
}

let promise = false

// Forcibly persist DOM mutations and repaint in the next tick
export const reflow = () =>
  promise || (promise = new Promise(done => {
    requestAnimationFrame(() => {
      void document.body.clientHeight

      promise = false

      done()
    })
  }))

// A set-like data structure which identifies objects by matching a set of fields  
export class Table {
  constructor(fields) {
    this._is = a => b =>
      fields.every(field => a[field] === b[field])
  }

  _entries = []

  get size() {
    return this._entries.length
  }

  has = query =>
    this._entries.some(this._is(query))

  get = query =>
    this._entries.find(this._is(query))

  add = entry => {
    if (this.has(entry))
      return false

    this._entries.push(entry)

    return true
  }

  delete = query => {
    const index = this._entries.findIndex(this._is(query))

    if (index === -1)
      return false

    this._entries.splice(index, 1)

    return true
  }
}