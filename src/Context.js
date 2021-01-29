// Provider components attributes are registered as 'context'
// Receiver component views receive a composite of context as defined by the super-tree
// Context composition follows the logic of the CSS cascade
import {viewOf} from './_utils.js'
import Inline   from './Inline.js'

export default function createContext(context){
  return {
    Receiver,
    Provider,
  }

  function Receiver() {
    return {
      view: v =>
        viewOf(v)(context),
    }
  }

  function Provider(){
    return {
      view: v => {
        const previous = context

        context = v.attrs.value

        return [
          v.children,

          m(Inline, {
            view: () => {
              context = previous
            },
          }),
        ]
      },
    }
  }
}