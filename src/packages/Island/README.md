# Island

`Island` creates an isolated redraw context which can be redrawn independently of the supertree. This is useful for components that need to redraw many times in quick succession without wanting to cause the whole application view to recompute (ideal for expressing animations in virtual DOM).

It consumes a child function which defines the subtree. That function receives a hash containing

* a `redraw` function which can be called to redraw that component without redrawing the supertree
* a `local` boolean flag which can be used to determine if the current draw loop was triggered by such a request or not
* a `first` boolean flag which is only true on the initial draw

Here's

```js
const frame = () =>
  new Promise(requestAnimationFrame)

const MyComponent = () => {
  let completion = 0

  return {
    view: () =>
      m(Island, ({redraw, local}) =>
        m('div', {
          style: {
            height : completion + '%',
            opacity: completion / 100,
          },
          async oninit : () => {
            while(completion++ < 100){
              await frame()

              redraw()
            }
          },
        },
          m(SubComponent, {
            onbeforeupdate: () => !local,
          })
        )
      )
  }
}
```
