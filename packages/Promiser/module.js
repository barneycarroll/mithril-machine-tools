export default {
  view: v => 
    v.children[0].children({...v.state}),
  
  async oninit(v){
    this.pending = true
    
    try {
      this.value  = await v.attrs.promise
      this.resolved = true
    }
    catch(e){
      this.error = e
      this.rejected = true
    }
    finally {
      this.pending = false

      m.redraw()
    }
  },
  
  onbeforeupdate(now, then){
    if(now.attrs.promise !== then.attrs.promise){
      for(const key in this)
        delete this[key]
        
      this.oninit.apply(this, arguments)
    }
  },
}
