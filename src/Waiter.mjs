// High-order component Waiter exposes low-order component Service.
// Waiters onbeforeremove triggers all Services immediate childrens
// onbeforemove and resolves with the last of them.
import {viewOf} from './_utils.mjs'

let count = 0

export default v => {
  const customers = []

  const id = count++
  
  return {
    view: v => 
      viewOf(v)(Service),
      
    onupdate: () => {
      customers.length = 0
    },
    
    onremove: () => {
      console.log(id + ' gone')
    },

    onbeforeremove: () => {
      console.log(id + ' going')

      const services = 
        customers.flatMap(v =>
          [v.state, v.attrs].flatMap(x =>
            x?.onbeforeremove?.call(v.state, v) || []
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
