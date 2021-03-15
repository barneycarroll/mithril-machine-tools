import {Table, reflow} from './_utils.js'

const frame = () => new Promise(requestAnimationFrame)

const start   = ['animationstart',  'transitionrun'   ]
const reject  = ['animationcancel', 'transitioncancel']
const resolve = ['animationend',    'transitionend'   ]
const settled = [...reject, ...resolve]
const events  = [...start,  ...settled]

const fxStack = () => new Table(['target', 'propertyName', 'animationName'])

export default function Liminal(v){
  const {blocking, base, absent, present, entry, exit} = v.attrs || v
  
  // Input class lists
  const stages = [
    [base],          // Persistent throughout lifecycle
    [absent, entry], // Applied for the initial frame
    [present],       // after initial frame, until teardown
    [absent, exit],  // at teardown
  ]
    .map(x => 
      x
        .filter(Boolean)
        // Allow classes to be supplied as arrays or space-separated strings
        .flatMap(x => Array.isArray(x) ? x : x.split(' '))
    )
  
  // Allow partially applied component definition
  return (
    v.attrs
      ? Liminal(v)
      : Liminal
  )
  
  function Liminal(v){
    let entryFx // Promise tallying initial 
    let exitFx  // and terminal start / end events

    // Events registered by one tally should be discarded by the other 
    const registry = new Set

    return {
      view: v =>
        v.children,

      oncreate,
      onbeforeremove,
    }

    async function oncreate({dom}){
      // Prevent element from transitioning as result of 
      // higher order reflows during first frame application
      const {transition} = dom.style
      dom.style.transition = 'none'

      entryFx = fxBatch(dom)

      dom.classList.add(   ...stages[0])
      dom.classList.add(   ...stages[1])

      // Force initial state rendering
      await reflow()

      // Reinstate any locally applied transition
      dom.style.transition = transition

      dom.classList.remove(...stages[1])
      dom.classList.add(   ...stages[2])
    }

    async function onbeforeremove({dom}){
      if(blocking)
        await entryFx

      await frame()

      exitFx = fxBatch(dom)

      dom.classList.remove(...stages[2])
      dom.classList.add(   ...stages[3])

      await Promise.all([entryFx, exitFx])
    }

    function fxBatch(dom){
      const stack = fxStack()

      return new Promise(resolve => {
        events.forEach(type => {
          dom.addEventListener(type, handler)
        })

        // One frame to cater for reflow,
        // another to allow for DOM event queue
        frame().then(frame).then(tally)

        function handler(event){
          // Prevent entry events from tallying as part of exit 
          if(registry.has(event))
            return

          else
            registry.add(event)
          
          // Discard infinite animations
          if('infinite' == getComputedStyle(event.target, event.pseudoElement).animationIterationCount)
            return

          // Stack start events 
          if(start.includes(event.type))
            stack.add(event)

          // Unstack end events
          else {
            stack.delete(event)

            tally()
          }
        }

        function tally(){
          if(stack.size > 0)
            return

          events.forEach(type => {
            dom.removeEventListener(type, handler)
          })

          resolve()
        }
      })
    }
  }
}