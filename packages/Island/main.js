function Island(v){
  // Internal
  var root   // Nearest ancestral mount-point
  var vnodes // Root vnodes as of last check, used to determine whether
  var place  // v's vnode sequence & position within context

  // Flag passed to view to indicate current draw loop is local
  var local = false

  return {
    view: function(){
      return v.children[0].children({
        local  : local,
        redraw : redraw
      })
    },

    oncreate: tick,
    onupdate: tick
  }

  // Update internal reference, clear local flag
  function tick(x){
    v = x

    Promise.resolve().then(function(){
      local = false
    })
  }

  // Overload redraw function
  function redraw(handler){
    // Manual, explicit redraw
    if(typeof x !== 'function')
      render()

    // Event handler wrapper: inverts Mithril auto-redraw directives:
    else
      return function(e){
        const output = handler.apply(this, arguments)

        // Unless e.redraw was set to false, redraw
        if(e.redraw !== false)
          render()

        // Prevent global redraw
        e.redraw = false

        return output
      }
  }

  function render(){
    if(!v.dom)
      return

    if(!root)
      root = findRoot(v.dom)

    local = true

    // If a global redraw took place since last local draw,
    // we might need to relocate the island's global position
    if(vnodes !== root.vnodes){
      vnodes = root.vnodes
      place  = locate(root)
    }

    var replacement = m(v.tag, v.attrs, v.children)

    // Set a local vnodes modulo to allow Mithril to skip siblings
    // and diff from last global draw
    v.dom.parentNode.vnodes = place.context

    // Render the patched local context + our new local draw
    m.render(
      v.dom.parentNode,
      []
        .concat(place.context.slice(0, place.position))
        .concat(replacement)
        .concat(place.context.slice(place.position + 1))
    )

    // Persist the vnode patch to Mithril's global vtree cache
    // (for global draw diffing)
    place.context[place.position] = replacement
  }

  function locate(root){
    var crawl = crawler(root.vnodes)
    var node

    while(node = crawl()){
      if(node === v)
        node = [node]

      if(node.length)
        for(var i = 0; i < node.length; i++)
          if(node[i] === v)
            return {
              context  : node,
              position : i
            }
          }
    }
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

    else if(node.length && typeof node === 'object')
      backlog.push.apply(backlog, node)

    return node
  }
}

try {
  module.exports = Island
}
catch(e){}
