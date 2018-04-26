export default {
  view: v =>
    v.children[0].children({...v.state}),

  oninit: async v => {
    Object.assign(v.state, {
      value:    void 0,
      error:    void 0,
      resolved: false,
      rejected: false,
      pending:  true,
      settled:  false,
    })

    try {
      v.state.value = await v.attrs.promise
      v.state.resolved = true
    }
    catch(e){
      v.state.error = e
      v.state.rejected = true
    }
    finally {
      v.state.pending = false
      v.state.settled = true

      m.redraw()
    }
  },

  onbeforeupdate: (now, then) => {
    if(now.attrs.promise !== then.attrs.promise)
      now.tag.oninit(now)
  },
}
