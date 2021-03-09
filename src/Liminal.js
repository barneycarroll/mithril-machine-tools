import {Table, reflow} from './_utils.js'

const frame = () => new Promise(requestAnimationFrame)

const start   = ['animationstart',  'transitionrun'   ]
const reject  = ['animationcancel', 'transitioncancel']
const resolve = ['animationend',    'transitionend'   ]
const settled = [...reject, ...resolve]
const events  = [...start,  ...settled]

const fxStack = () => new Table(['target', 'propertyName', 'animationName'])

export default function Liminal(v){
  const {blocking, absent, present, entry, exit} = v.attrs || v
  
  const stages = [
    [absent, entry], 
    [present],       
    [absent, exit],  
  ].map(x => x.filter(Boolean))

  if(v.attrs)
    return Liminal()
  
  else
    return Liminal
  
  function Liminal(){
    const registry = new Set

    let entryFx
    let exitFx

    return {
      view: v =>
        v.children,

      oncreate,
      onbeforeremove,
    }

    async function oncreate({ dom }){
      entryFx = fxBatch()

      dom.classList.add(...stages[0])

      await reflow()

      dom.classList.remove(...stages[0])
      dom.classList.add(...stages[1])
    }

    async function onbeforeremove({ dom }) {
      if (blocking)
        await entryFx

      await frame()

      exitFx = fxBatch()

      dom.classList.remove(...stages[1])
      dom.classList.add(...stages[2])

      await Promise.all([entryFx, exitFx])
    }

    function fxBatch() {
      const stack = fxStack()

      return new Promise(resolve => {
        events.forEach(type => {
          v.dom.addEventListener(type, handler)
        })

        frame().then(frame).then(tally)

        function handler(event) {
          if (registry.has(event))
            return

          else
            registry.add(event)

          if (start.includes(event.type))
            stack.add(event)

          else {
            stack.delete(event)

            tally()
          }
        }

        function tally() {
          if (stack.size > 0)
            return

          events.forEach(type => {
            v.dom.removeEventListener(type, handler)
          })

          resolve()
        }
      })
    }
  }
}