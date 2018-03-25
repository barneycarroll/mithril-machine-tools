var Promiser = {
  view: function(){
    return v.children[0].children(Object.assign({}, this))
  },
  
  oninit: function(v){
    this.pending = true
    
    v.attrs.promise.then(
      function(value){
        this.value = value
        this.resolved = true
        this.pending = false

        m.redraw()
      },


      function(error){
        this.error = error
        this.rejected = true
        this.pending = false

        m.redraw()
      }
  },
  
  onbeforeupdate: function(now, then){
    if(now.attrs.promise !== then.attrs.promise){
      for(const key in this)
        delete this[key]
        
      Promiser.oninit.apply(this, now)
    }
  },
}

try {
  module.exports = Promiser
}
catch(e){}
