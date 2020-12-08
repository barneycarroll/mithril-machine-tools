// Provider components attributes are registered as 'context'
// Receiver component views receive a composite of context as defined by the super-tree
// Context composition follows the logic of the CSS cascade
import {viewOf} from './_utils.js'
import Inline   from './Inline.js'

let context = {}

export const Provider = {
  view: v => {
    const oldContext = context
    
    context = {
      ...context,
      ...v.attrs,
    }
    
    return [
      v.children,
      
      m(Inline, {view: () => {
        context = oldContext
      }}),
    ]
  }
}

export const Receiver = {
  view: v => 
    viewOf(v)(context),
}