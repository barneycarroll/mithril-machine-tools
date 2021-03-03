import {viewOf} from './_utils.js'

export default v => {
  let previous
  let current
  let frozen

  return {view, onbeforeremove}

  function view(){
    v = arguments[0]

    if(frozen)
      return v.instance

    previous = new Map(current)
    current  = new Map

    const output = viewOf(v)(function service({key}, ...children){
      current.set(key, children)
    })

    const missing = Array.from(previous).flatMap(([key, children]) => current.has(key) ? [] : children)

    if(!missing.length)
      return output

    frozen = true

    const departures = missing.flatMap(removals)

    void async function(){
      const snapshot = v

      await Promise.all(departures)

      const {parentNode} = v.dom
      const {vnodes} = parentNode

      parentNode.vnodes = [snapshot]

      m.render(parentNode, [{...v}])

      frozen = false
    }()

    return v.instance
  }

  function onbeforeremove(){
    return Promise.all(
      Array.from(current.values()).flat().flatMap(removals)
    )
  }
}

function removals(v){
  return [v.state, v.attrs].flatMap(x =>
    x && x.onbeforeremove ? x.onbeforeremove.call(v.state, v) : []
  )
}
