import {viewOf} from './src/utils.js'
import Inline   from './src/Inline.js'

let context = {}

export const Provider = {
  view: v => {
    const previous = context
    
    context = {
      ...context,
      ...v.attrs,
    }
    
    return [
      v.children,
      
      m(Inline, {view: () => {
        context = previous
      }}),
    ]
  }
}

export const Receiver = {
  view: v => 
    viewOf(v)(context),
}