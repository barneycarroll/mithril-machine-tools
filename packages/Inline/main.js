function Inline(v){
  return (
      v.children[0] && typeof v.children[0].children === 'function'
    ?
      v.children[0].children.apply(this, arguments)
    :
      {
        view: function(v){
          return (
              v.attrs.view
            ?
              v.attrs.view.apply(this, arguments)
            :
              v.attrs.children
          )
        }
      }
  )
}

try {
  module.exports = Inline
}
catch(e){}
