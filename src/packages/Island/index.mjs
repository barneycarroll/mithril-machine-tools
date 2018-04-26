import findRoot       from 'src/utils/findRoot.mjs'
import findWithinRoot from 'src/utils/findWithinRoot.mjs'

export default v => {
  // Internal
  let root   // Nearest ancestral mount-point
  let rootVs // Root vnodes as of last check
  let host   // v's vnode sequence
  let path   // v's position within container

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
    if(rootVs !== root.vnodes){
      rootVs        = root.vnodes;
      ({host, path} = findWithinRoot(v, root))
    }

    const vnodes = Array.isArray(host) ? host : [host]
    const patch  = path.reverse().slice(1).reduce(
      (patch, key, index) => ({
        [key] : O(patch)
      }),
      {
        [path.slice(1)] : m(v.tag, v.attrs, v.children)
      },
    )
    const replacement = O(vnodes, patch)

    // Set a local vnodes modulo to allow Mithril to skip siblings
    // and diff from last global draw
    v.dom.parentNode.vnodes = vnodes

    // Render the patched local container + our new local draw
    m.render(v.dom.parentNode, replacement)

    // Persist the vnode patch to Mithril's global vtree cache
    // (for global draw diffing)
    host[path[0]] = replacement[path[0]]
  }
}
