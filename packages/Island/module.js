export default {
  view: v =>
    // Feed a function to the children:
    v.children[0].children(function handler(x){
      if(x && x.target === this)
        return handler(Function.prototype).apply(this, arguments)
      
      else if(typeof x !== 'function')
        v.state.redraw()
      
      else 
        return function(e){
          const output = x.apply(this, arguments)

          if(e.redraw !== false)
            v.state.redraw()

          e.redraw = false

          return output
        }
    }),
  
  // Noop until we've rendered once, when we can query the DOM
  redraw: () => {},
  
  // Persist the latest vnode to state
  onupdate: v => {
    v.state.v = v
  },
  
  oncreate: v => {
    // Locate the global root (to query the computed tree)
    const root = findRoot(v.dom)
    
    v.state.v = v
    
    // Use this to infer whether supertree has changed
    v.state.vnodes = root.vnodes
    
    v.state.redraw = () => {
      // If a global redraw took place since last local draw,
      // we might need to relocate the island's global position
      if(!v.state.collection || v.state.vnodes[0] !== root.vnodes[0]){
        locate(root, v.state.v)
        
        v.state.vnodes = root.vnodes
      }
      
      // Execute 
      const replacement = m(v.tag, v.state.v.attrs, v.state.v.children)
      
      // Set a local vnodes modulo to allow Mithril to skip siblings
      // and diff from last global draw
      v.dom.parentNode.vnodes = v.state.collection
      
      // Render the patched local context + our new local draw
      m.render(
        v.dom.parentNode, 
        [
          ...v.state.collection.slice(0, v.state.index), 
          replacement, 
          ...v.state.collection.slice(v.state.index + 1)
        ]
      )
      
      // Persist the vnode patch to Mithril's global vtree cache 
      // (for global draw diffing)
      v.state.collection[v.state.index] = replacement
    }
  },
}

const findRoot = dom => {
  while(!dom.vnodes)
    dom = dom.parentNode
  
  return dom
}

const locate = (root, target) => {
  for(const collection of crawl(root.vnodes))
    if(collection === target)
      return Object.assign(target.state, {collection: [collection], index: 0})
      
    else if(Array.isArray(collection)){
      const index = collection.findIndex(subject => subject === target) 
      
      if(index >= 0)
        return Object.assign(target.state, {collection, index})
    }
}

function * crawl(node){
  yield node
  
  for(const subtree of ['instance', 'children'])
    if(node[subtree])
      return yield * crawl(node[subtree])
  
  if(Array.isArray(node))
    for(const child of node)
      yield * crawl(child)
}
