// High-order Static component exposes low-order Live component.
// Static is never recomputed, except for Live subtrees. 
import {getSet, indexOf, viewOf} from './_utils.js'

export default function Static(){
  const ranges = new Map
  
  return {
    view: v =>
      viewOf(v)(Live),
      
    onbeforeupdate: () => {
      for(const [root, range] of ranges){
        const {vnodes} = root

        root.vnodes = range

        m.render(root, range.map(copy))

        root.vnodes = vnodes
      }
      
      return false
    }
  }
  
  function Live(){
    return {
      view: v =>
        [viewOf(v)(), ''],
      
      oncreate: v => {
        const parent = v.dom.parentNode
        const index  = indexOf(v.dom)
        const range  = getSet(ranges, parent, () => 
          Array(index + 1),
        )

        range[index] = v
      },
    }
  }
}

function copy(x){
  return typeof x == 'object' ? Object.assign(new x.constructor, x) : x
}