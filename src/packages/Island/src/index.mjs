export default v => {
  // Internal
  let root   // Nearest ancestral mount-point
  let path   // v's position within container
  let vnodes // Root vnodes as of last check
  let temp   // Variation of vnodes with components from root to target removed


  // Flags to qualify nature of current draw loop
  let first = true
  let local = false

  return {
    onupdate: fresh => {
      v = fresh
    },

    view,
  }

  function view() {
    return v.children[0].children({ first, local, redraw })
  }

  // Overload redraw function
  function redraw(handler) {
    // Manual, explicit redraw
    if (typeof handler !== 'function')
      render()

    // Event handler wrapper: inverts Mithril auto-redraw directives:
    else
      return function (e) {
        const output = handler(...arguments)

        // Unless e.redraw was set to false, redraw
        if (e.redraw !== false)
          render()

        // Prevent global redraw
        e.redraw = false

        return output
      }
  }

  function render(){
    if(!v.dom || !v.dom.parentNode)
      root = [...document.all].find(node => node.vnodes)

    else if (!root)
      root = findRoot(v.dom)

    local = true

    // Determine whether a global redraw took place after last local draw
    if (vnodes !== root.vnodes) {
      // Refresh all dependent references
      vnodes = root.vnodes
      path   = findWithinRoot(v, root).reverse()
      temp   = O(
        vnodes,
        path.reduce(
          decompose,
          v.instance,
        ),
      )
    }

    // Get our new component instance
    const instance = view()

    // Clear state flags
    first = false
    local = false

    // Temporarily swap vnodes for a variation without components
    // to avoid view re-executions
    root.vnodes = temp

    temp  = O(
      vnodes,
      path.reduce(
        decompose,
        instance,
      ),
    )

    // Trace the path from our (new) local instance up to the root
    // and clone each node in the path for a replacement tree.
    // This ensures a 'hot path', ensuring uncloned siblings aren't redrawn.
    // Render the patched local container + our new local draw
    m.render(root, temp)

    // Recompose the tree to match higher order draw expectations
    vnodes = root.vnodes = O(
      vnodes,
      path.reduce(
        (patch, key) => ({
          [key]: O(patch)
        }),

        O(v, {
          instance: [...path].reverse().reduce(
            recompose,
            temp,
          ),
        }),
      ),
    )
  }
}

const findRoot = element => {
  while (!element.vnodes)
    element = element.parentNode

  return element
}

const findWithinRoot = (target, root) => {
  for (const { node, path } of crawl({ node: root.vnodes }))
    if (node === target)
      return path
}

function* crawl({ node, stack = [], path = [] }) {
  yield { node, path }

  if (Array.isArray(node)) {
    let index = node.length

    while (index--)
      stack.push({
        path: [...path, index],
        node: node[index],
      })
  }

  else if (node.instance)
    stack.push({
      path: [...path, 'instance'],
      node: node.instance,
    })

  else if (node.children)
    stack.push({
      path: [...path, 'children'],
      node: node.children,
    })

  while (stack.length)
    yield* crawl(stack.pop())
}

const decompose = (patch, key) => (
    key === 'instance'
  ?
    ({instance}) => O(
      m.fragment({}, []),

      {children: [O(instance, patch)]},
    )
  :
    {[key]: O(patch)}
)

const recompose = (node, key) => (
    key == 'instance'
  ?
    node.children[0]
  :
    node[key]
)
