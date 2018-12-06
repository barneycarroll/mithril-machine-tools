export const viewOf = v => (
    v.children[0] && v.children[0].children && typeof v.children[0].children === 'function'
  ?
    v.children[0].children
  :
    typeof v.children[0] === 'function'
  ?
    v.children[0]
  :
    typeof v.attrs.view === 'function'
  ?
    v.attrs.view
  :
    () => v.children
)