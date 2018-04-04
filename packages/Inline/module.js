export default function(v){
  const f = (
      v.children[0] 
    &&
      typeof v.children[0].children === 'function'
    &&
      v.children[0].children
  )

  return (
      f
    ?
      (
          f.prototype && f.prototype.view
        ?
          new f(...arguments)
        :
          f(...arguments)
      )
    :
      {
        view(v){
          return (
              v.attrs.view
            ?
              v.attrs.view(...arguments)
            :
              v.attrs.children
          )
        }
      }
  )
}
