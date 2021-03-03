import {viewOf} from './_utils.js'
import Inline   from './Inline.js'

export default function createContext(context){
  return {
    Consumer,
    Provider,
  }

  function Consumer() {
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