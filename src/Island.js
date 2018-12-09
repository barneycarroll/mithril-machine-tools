import {viewOf} from './src/utils.js'

const now  = x => x()
const asap = x => Promise.resolve().then(x) 

export default {
  view: v => (
    (v.dom ? now : asap)(function redraw(){
      m.render(v.dom, viewOf(v)(redraw))
    }),

    m('[style=display:contents]')
  ),
}