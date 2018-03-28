var View = {
  view(v){
    return v.attrs.view.call(this, v) 
  }
}

try {
  module.exports = View
}
catch(e){}
