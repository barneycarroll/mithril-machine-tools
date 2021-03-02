import {viewOf, Redraw} from './_utils.js'

export default function Promiser(){
  const state = {
    error    : undefined,
    value    : undefined,
    rejected : false,
    resolved : false,
  }

  let drawing
  let redraw

  return {
    view: v => {
      drawing = true

      Promise.resolve().then(() => {
        drawing = false
      })

      return [
        viewOf(v)({...state}),

        m(Redraw, x => {redraw = x}),
      ]
    },

    onbeforeupdate: (now, then) => {
      if(now.attrs.promise !== then.attrs.promise)
        now.tag.oninit(now)
    },

    oninit: async v => {
      state.pending = true
      state.settled = false

      try {
        state.value    = await v.attrs.promise
        state.rejected = false
        state.resolved = true
      }
      catch (error) {
        state.error    = error
        state.rejected = true
        state.resolved = false
      }
      finally {
        state.pending  = false
        state.settled  = true

        if(drawing) 
          await Promise.resolve()

        void (redraw || Function.prototype)()
      }
    },
  }
}
