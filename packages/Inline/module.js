export default function(v){
  return (
      v.children[0] && typeof v.children[0].children === 'function'
    ?
      v.children[0].children(...arguments)
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
