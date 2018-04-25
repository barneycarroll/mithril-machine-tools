var Promiser = {
  view: function(v){
    return v.children[0].children(Object.assign({}, this))
  },
  
  oninit: function(v){
    Object.assign(v.state, {
      value:    void 0,
      error:    void 0,
      resolved: void 0,
      rejected: void 0,
      pending:  true,
      settled:  false,
      
    })
    
    v.attrs.promise.then(
      function(value){
        v.state.value    = value
        v.state.resolved = true
        v.state.rejected = false
        v.state.pending  = false
        v.state.settled  = true

        m.redraw()
      },


      function(error){
        v.state.error    = error
        v.state.resolved = false
        v.state.rejected = true
        v.state.pending  = false
        v.state.settled  = true

        m.redraw()
      }
    )
  },
  
  onbeforeupdate: function(now, then){
    if(now.attrs.promise !== then.attrs.promise){
      for(const key in this)
        delete this[key]
        
      this.oninit(now)
    }
  },
}

try {
  module.exports = Promiser
}
catch(e){}
