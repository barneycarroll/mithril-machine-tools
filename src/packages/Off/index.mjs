const persist = v => {
  Object.keys(v.attrs).forEach(type => {
    v.state.events.add(type)

    window.addEventListener(type, v.state, true)
  })
}

const teardown = v => {
  [...v.state.events].forEach(type => {
    window.removeEventListener(type, v.state, true)
  })
}

export default v => ({
  view : () =>
    v.children,

  oninit : () => {
    v.state.events = new Set
  },

  oncreate : persist,
  onupdate : persist,
  onremove : teardown,

  handleEvent: e => {
    if(e.type in v.attrs && !v.dom.contains(e.target))
      v.attrs[e.type](e)
  },

  onbeforeupdate: latest => {
    v = latest
  },
})
