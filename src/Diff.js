import { viewOf } from "./_utils.js";

export default function Diff(now){
  let then

  return {
    view: () =>
      call(viewOf(now)),

    oninit: () => {
      if(now.attrs.initial || !('value' in now.attrs))
        call(now.attrs.before)
    },

    oncreate: () => {
      if(now.attrs.initial || !('value' in now.attrs))
        call(now.attrs.after)

      then = now
    },

    onbeforeupdate: v => {
      now = v

      if(!('value' in now.attrs) || diff())
        call(now.attrs.before)
    },

    onupdate: () => {
      if(!('value' in now.attrs) || diff())
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