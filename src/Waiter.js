// High-order component Waiter exposes low-order component Service.
// Waiters onbeforeremove triggers all Services immediate childrens
// onbeforemove and resolves with the last of them.
export default v => {
  let customers = []
  
  const Service = {
    view: v => 
      v.children,
      
    oncreate: greet,
    onupdate: greet,
  }
  
  return {
    view: v => 
      viewOf(v)(Service),
      
    onupdate: () => {
      customers = []
    },
    
    onbeforeremove: 
      serve,
  }

  function greet(v){
    customers.push(...v.children)
  }

  function serve(){
    return Promise.all(
      customers.map(v =>
        Promise.all(
          [v.tag, v.attrs].map(x =>
            x.onbeforeremove && x.onbeforeremove.call(v.state, v)
          )
        )
      )
    )
  }
}
