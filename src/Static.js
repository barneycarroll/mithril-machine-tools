import {viewOf} from './utils.js'

export default function Static(){
  const ranges = new Map
  
  return {
    view: v =>
      viewOf(v)(Live),
      
    onbeforeupdate: () => {
      for(const [root, vnodes] of ranges)
        m.render(root, vnodes.map(copy))
      
      return false
    }
  }
  
  function Live(){
    return {
      view: v =>
        viewOf(v)(() => {
          m.render(parent, zone.map(copy))
        }),
      
      oncreate: v => {
        const parent = v.dom.parentNode
        const index  = indexOf(v.dom)
        const range  = getSet(ranges, parent, () => 
          Array(index + 1),
        )

        range[index] = v

        parent.vnodes = range
      },
    }
  }
}

function copy(x){
  return typeof x == 'object' ? Object.assign(new x.constructor, x) : x
}

function indexOf(dom, index = 0){
  while(dom = dom.previousSibling)
    index++
  
  return index
}

function getSet(map, key, factory){
  if(map.has(key))
    return map.get(key)
  
  const value = factory()
  
  map.set(key, value)
  
  return value
}
