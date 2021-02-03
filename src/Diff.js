import { viewOf } from "./_utils.js";

export default function Diff(now){
  let then

  return {
    view: () =>
      call(viewOf(now)),

    oninit: () => {
      if(now.attrs.init)
        call(now.attrs.before)
    },

    oncreate: () => {
      if(now.attrs.init)
        call(now.attrs.after)

      then = now
    },

    onbeforeupdate: v => {
      now = v

      if(diff())
        call(now.attrs.before)
    },

    onupdate: () => {
      if(diff())
        call(now.attrs.after)
      
      then = now
    },
  }

  function call(fn){
    if(fn)
      return fn.call(now.state, [now, then], [now.attrs.value, then && then.attrs.value])
  }

  function diff(){
    return now.attrs.value !== then.attrs.value
  }
}