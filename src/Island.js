import {domOf, indexOf} from './utils.js'

export default function Island({children: [visitor]}){
  let index
  let vnode

  visitor({ patch, attach, render, get vnode(){
    return vnode
  }})

  return {
    view(){
      vnode = arguments[0]

      return vnode.instance || ''
    },

    oncreate: () => {
      index = indexOf(vnode.dom)
    },
    
    onupdate: () => {
      index = indexOf(vnode.dom)
    },
  }

  function patch(input) {
    Object.assign(vnode, {
      dom: input[0],
      domSize: input.length,
    })

    vnode.dom.parentNode.vnodes = 
      Object.assign(
        Array(index + 1),
        { [index]: m.fragment([input]) },
      )
    
    vnode.dom.replaceWith(
      ...domOf(input)
    )
  }

  function render(input){
    vnode.instance = input

    m.render(
      vnode.dom.parentNode,

      Object.assign(
        Array(index + 1),
        { 
          [index]: m.fragment({
            oncreate : persist,
            onupdate : persist,
          },
            [input],
          ),
        },
      ),
    )
  }

  function persist(){
    Object.assign(vnode, {
      dom      : arguments[0].dom,
      domSize  : arguments[0].domSize,
      instance : arguments[0],
    })
  }
}