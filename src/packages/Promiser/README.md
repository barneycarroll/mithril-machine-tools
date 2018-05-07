# Promiser

## What?

Consumes a promise, exposes the exploded state of that promise, ie `{pending, resolved, rejected, value, error}`. The first 3 are generic booleans, the latter 2 are discrete to the promise.

## Why?

Whether your application uses a centralised model with unidirectional data flow or a devolved model with components are responsible for managing the data they display, web apps inevitably deal with asynchronous transactions, and while it's often desirable to reflect the interstitial state of those transactions in the UI, abstracting and storing that state in your essential model certainly isn't. Promiser provides a generic abstraction for promise states without polluting your models.

## How?

```js
const Component = () => {
  let promise
  
  return {
    view: ({state, attrs: {model, update}}) => [
      model.items.map(item =>
        m('button', {
          onclick: e => {
            promise = m.request(item.uri).then(update)
          },
        },
          item.title
        )
      ),

      state.promise &&
        m(Promiser, {promise},
          ({pending, rejected, value}) =>
              pending
            ?
              m('p', 'Loading...')
            :
              rejected
            ?
              m('p[style=color:red]', 'Something went wrong :(')
            :
              [
                m('h2', item.title),

                m('p', item.description),
              ]
        )
    ]
  }
}
```
