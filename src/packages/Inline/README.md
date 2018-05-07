# Inline

## What?

The Inline component is one with no predetermined behaviour, where the entire component definition — including the view — is defined inline. It takes 1 argument: the component definition.

## Why?

Inline components are ideal for expressing devolved state without having to define its behaviour as a discrete entity ahead of time. If, for example, you believe that declaring and assigning a reference implies multiple invocations, an Inline component is ideal for a single invocation component that requires no reference; if your component benefits from cross-referencing internal & higher order data, an Inline component saves you the indirection of an extra reference and attribute interface to name and trace by allowing direct scoped access to the calling context.

## How?

Inline's sole input is a component of any format: POJO, function, class. It is pointless to pass in extra attributes since whatever reference will be available in scope at the point of an Inline component's invocation will innevitably be available in its definition. It is also pointless to write an Inline component that doesn't make use of state: in this scenario there is no advantage using an Inline component over a fragment or element vnode.

```js
m(Inline, () => {
  var text
  
  [...'Typewriter effect'].reduce(
    async (previous, next) => {
      text = await previous + next

      await sleep(450 * Math.random())

      m.redraw()

      return text 
    },

    '',
  ).then(() => {
    m.redraw()
  })
  
  return {
    view: () => text
  }
})
```
