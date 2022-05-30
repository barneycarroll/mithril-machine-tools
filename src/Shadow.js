import {viewOf} from './_utils.js'

export default function Shadow(){
  let slots
  let contents
  
  return {
    view    : vnode => {
      slots    = []
      contents = viewOf(vnode)(Slot)
      
      const {selector, ...attrs} = vnode.attrs
      
      return m(selector || '[style=display:contents]', attrs)
    },

    onremove: vnode => {
      m.render(vnode.dom.shadowRoot, null)
    },

    oncreate: vnode => {
      vnode.dom.attachShadow({mode: 'open'})
      
      render(vnode)
    },

    onupdate: render,
  }
  
  function render(vnode){
    m.render(
      vnode.dom.shadowRoot, 
      
      m.fragment({
        oncreate(){
          renderSlots()
        },
      }, contents), 
      
      m.redraw,
    )
    
    function renderSlots(){
      m.render(
        vnode.dom,

        slots.map(({attrs: {name, selector, ...attrs}, children}, index) => 
          m(
            selector || '[style=display:contents]', 

            Object.assign(attrs, {
              slot: name || 'slot-' + (index + 1)
            }),

            children,
          ),
        ),

        m.redraw,
      )
    }
  }
  
  function Slot(){
    return {
      view(vnode){
        slots.push(vnode)
        
        return m('slot', {name: vnode.attrs.name || 'slot-' + slots.length})
      }
    }
  }
}