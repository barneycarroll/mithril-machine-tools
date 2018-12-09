import {viewOf} from './src/utils.js'

export default ({attrs}) => {
  const it = window.open(attrs.url, attrs.name, attrs.features)
  
  if(!it && attrs.catch)
    attrs.catch(
      new Error('Window component was unable to create window')
    )
  
  return {
    onremove: () => {
      it.close()
    },
    
    view: v => {
      m.render(it.document.body, viewOf(v)(it))
    },
  }
}