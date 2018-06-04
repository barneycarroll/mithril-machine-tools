export default function(v){
  const f = (
      v && v.children && v.children[0]
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
          new f(v)
        :
          f(v)
      )
    :
      {
        view(v){
          return (
              v.attrs.view
            ?
              v.attrs.view(v)
            :
              v.attrs.children
          )
        }
      }
  )
}
