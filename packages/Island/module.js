export default v => {
  // Internal
  let root     // Nearest ancestral mount-point
  let vnodes   // Root vnodes as of last check, used to determine whether
  let context  // v's vnode sequence
  let position // v's position within context

  // Flag passed to view to indicate current draw loop is local
  let local = false

  return {
    view: () =>
      v.children[0].children({local, redraw}),

    oncreate: tick,
    onupdate: tick,
  }

  // Update internal reference, clear local flag
  function tick(x){
    v = x

    Promise.resolve().then(() => {
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
        const output = handler(...arguments)

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
      vnodes               = root.vnodes;
      ({context, position} = locate(root))
    }

    const replacement = m(v.tag, v.attrs, v.children)

    // Set a local vnodes modulo to allow Mithril to skip siblings
    // and diff from last global draw
    v.dom.parentNode.vnodes = context

    // Render the patched local context + our new local draw
    m.render(v.dom.parentNode, [
      ...context.slice(0, position),
      replacement,
      ...context.slice(position + 1)
    ])

    // Persist the vnode patch to Mithril's global vtree cache
    // (for global draw diffing)
    context[position] = replacement
  }
}
