export default {
  view : v =>
    v.children,

  oncreate : v => {
    addEventListener('click', v.state.handler = function(e){
      if(!v.dom.contains(e.target))
        return v.attrs.callback(e)
    }, true)
  },

  onremove : v => {
    removeEventListener('click', v.state.handler, true)
  }
}
