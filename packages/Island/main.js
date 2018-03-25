var Island = {
  view: function(v){
    // Feed a function to the children:
    return v.children[0].children(function handler(x){
      if(x.target === this)
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
    })
  },
  
  // Noop until we've rendered once, when we can query the DOM
  redraw: function(){},
  
  // Persist the latest vnode to state
  onupdate: function(v){
    v.state.v = v
  },
  
  oncreate: function(v){
    // Locate the global root (to query the computed tree)
    var root = findRoot(v.dom)
    
    v.state.v = v
    
    // Use this to infer whether supertree has changed
    v.state.vnodes = root.vnodes
    
    v.state.redraw = function(){
      // If a global redraw took place since last local draw,
      // we might need to relocate the island's global position
      if(!v.state.collection || v.state.vnodes[0] !== root.vnodes[0]){
        locate(root, v.state.v)
        
        v.state.vnodes = root.vnodes
      }
      
      // Execute 
      var replacement = m(v.tag, v.state.v.attrs, v.state.v.children)
      
      // Set a local vnodes modulo to allow Mithril to skip siblings
      // and diff from last global draw
      v.dom.parentNode.vnodes = v.state.collection
      
      // Render the patched local context + our new local draw
      m.render(
        v.dom.parentNode, 
        v.state.collection.slice(0, v.state.index)
          .concat(replacement)
          .concat(v.state.collection.slice(v.state.index + 1))
      )
      
      // Persist the vnode patch to Mithril's global vtree cache 
      // (for global draw diffing)
      v.state.collection[v.state.index] = replacement
    }
  },
}

function findRoot(dom){
  while(!dom.vnodes)
    dom = dom.parentNode
  
  return dom
}

function locate(root, target){
  var crawl = crawler(root.vnodes)
  var collection
  
  while(collection = crawl())
    if(collection.length)
      for(var i = 0; i < collection.length; i++)
        if(collection[i] === target){
          target.state.collection = collection
          target.state.index      = i

          return
        }
}

function crawler(root){
  var backlog = [root]
  
  return function(){
    var node = backlog.pop()
    
    if(node.instance)
      backlog.push(node.instance)
    
    else if(node.children)
      backlog.push(node.children)
    
    else if(node.length)
      backlog.push.apply(backlog, node)
   
    return node
  }
}

try {
  module.exports = Island
}
catch(e){}
