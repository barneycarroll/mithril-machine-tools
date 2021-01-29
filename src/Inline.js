// A component whose definition is supplied at the call site.
export default v => (
    typeof v.attrs.view === 'function'
  ?
    ({view(){
      return v.attrs.view(...arguments)
    }})
  :
    typeof v.children[0] === 'function'
  ?
    v.children[0](v)
  :
    console.error('Inline component must be provided with a component definition in POJO or clsoure form')
)