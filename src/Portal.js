// 
import {getSet, indexOf, viewOf} from './_utils.js'

const travelers = new Map
const portals   = new Map

const ranges = new Map

m.mount(document.createDocumentFragment())

export default function Portal(){
  return {
    view: v => {
      portals.set(id, v)

      return viewOf(v)(Traveler)
    },

    oncreate: v => {
      parent = v.dom.parentNode

      const index = indexOf(v.dom)
      const range = getSet(ranges, parent, () => 
        Array(index + 1)
      )

      parent.vnodes = range
    },
    
    onremove: () => {
      portals.delete(id)
    },
  }
}

function Traveler(){
  const id = Symbol()

  return {
    view: v => {
      portals.set(id, v)

      return viewOf(v)()
    },
    
    onremove: () => {
      travelers.delete(id)
    },
  }
}

function Shuttle(){
  const processed = new Map

  return {
    view: () => (
      contents,

      void (
        processed.delete(true),

        Promise.resolve().then(() => {
          getSet(processed, true, () => {

          })
        })
      )
    ),
  }
}