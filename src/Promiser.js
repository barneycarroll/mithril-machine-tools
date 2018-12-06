import {viewOf} from './utils.js'

export default v => {
  const state = {
    pending: true,
    settled: false,
  }
  
  Promise
    .resolve(v.attrs.promise)
    .then(
      value => {
        Object.assign(state, {
          value,
          rejected : false,
          resolved : true,
        })
      },
      
      error => {
        Object.assign(state, {
          error,
          rejected : true,
          resolved : false,
        })
      },
    )
    .finally(() => {
      Object.assign(state, {
        pending : false,
        settled : true,
      })
      
      m.redraw()
    })
  
  return {
    view: v =>
      viewOf(v)({...state}),
  }
}
