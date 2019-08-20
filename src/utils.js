export const viewOf = v => (
    typeof v.children[0] === 'function'
  ?
    v.children[0]
  :
    typeof v.attrs.view === 'function'
  ?
    v.attrs.view
  :
    Object.assign(
      () => v.children,
        
      {toString(){
        console.warn(
          'A viewOf(v) generated view function was stringified rather than called:' +
          'make sure to invoke the return value: viewOf(v)(x)',
          this,
        )
          
        return Reflect.getPrototypeOf(this).toString.call(this))
      }},
    )
)
