export default v => {
  let customers = []
  
  const greet = v => {
    customers.push(...v.children)
  }
  
  const serve = () => 
    Promise.all(
      customers.map(v =>
        Promise.all(
          [v.tag, v.attrs].map(x =>
            x.onbeforeremove && x.onbeforeremove.call(v.state, v)
          )
        )
      )
    )
  
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
}
