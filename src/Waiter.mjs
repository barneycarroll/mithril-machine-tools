// High-order component Waiter exposes low-order component Service.
// Waiters onbeforeremove triggers all Services immediate childrens
// onbeforemove and resolves with the last of them.
import {viewOf} from './_utils.mjs'

export default v => {
  let customers = []
  
  return {
    view: v => 
      viewOf(v)(Service),
      
    onupdate: () => {
      customers = []
    },
    
    onbeforeremove: () =>
      Promise.all(customers.map(v =>
        Promise.all(
          [v.tag, v.attrs].map(x =>
            x && x.onbeforeremove && x.onbeforeremove.call(v.state, v)
          )
        )
      )),
  }

  function Service(){
    return {
      view: v =>
        v.children,

      oncreate: greet,
      onupdate: greet,
    }
  }

  function greet(v){
    customers.push(...v.children)
  }
}
