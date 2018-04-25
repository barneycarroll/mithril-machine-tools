# Island

`Island` creates an isolated redraw context which can be redrawn independently of the supertree. This is useful for components that need to redraw many times in quick succession without wanting to cause the whole application view to recompute (ideal for expressing animations in virtual DOM).

It consumes a child function which defines the subtree. That function receives a hash containing a `redraw` function which can be called to redraw that component without redrawing the supertree, and a `local` boolean flag which can be used to determine if the current draw loop was triggered by such a request or not (if `false`, it indicates the current draw loop is a global one). This can be useful in determining whether nested trees need to redraw or not.

Strawman:

```js
const MyComponent = () => {
  var completion = 0

  return {
    view: () =>
      m(Island, ({redraw, local}) =>
        m('div', {
          oninit(){
            requestAnimationFrame(() => {
              completion++

              if(completion < 100)
                this.tick()
            })
          },
          style: {
            height : completion + '%',
            opacity: completion / 100,
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
