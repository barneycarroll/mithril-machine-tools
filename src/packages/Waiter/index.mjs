export default () => {
  var link = new Map

  return {
    view : v => (
        v.attrs.link
      ? 
        v.children
      :
        v.children[0].children(link) 
    ),

    oncreate: persist,
    onupdate: persist,

    onremove: v => {
      if(v.attrs.link)
        v.attrs.link.delete(v.dom)
    },

    onbeforeremove: () =>
      Promise.all(
        [...link.values()].map(callOBR)
      )
  }
}

const callOBR = async v => {
  debugger
  
  await Promise.all([
       v.attrs
    && v.attrs.onbeforeremove
    && v.attrs.onbeforeremove.call(v.state, v),

       v.state.onbeforeremove
    && v.state.onbeforeremove.call(v.state, v),
  ])
  
  m.redraw()
}

const findOBR = v => {
  while (v.length || !(v.tag.onbeforeremove || v.attrs && v.attrs.onbeforeremove))
    v = v.instance || v.children || v[0]

  return v
}

const persist = v => {
  const target = findOBR(v)

  if(v.attrs.link)
    v.attrs.link.set(target.dom, target)
}
