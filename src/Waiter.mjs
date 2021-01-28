// High-order component Waiter exposes low-order component Service.
// Waiters onbeforeremove triggers all Services immediate childrens
// onbeforemove and resolves with the last of them.
import {viewOf} from './_utils.mjs'

export default v => {
  const customers = []
  
  return {
    view: v => 
      viewOf(v)(Service),
      
    onupdate: () => {
      customers.length = 0
    },

    onbeforeremove: () => {
      const services = 
        customers.flatMap(v =>
          [v.state, v.attrs].flatMap(x =>
            x && x.onbeforeremove ? x.onbeforeremove.call(v.state, v) : []
          )
        )
      
      if(services.length)
        return Promise.all(services)
    },
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
