# Proponents

Utility components for Mithril.

Work in progress: tests indicate maturity. To run tests (😬), download the package and run `npm i; npm t`; Open your browser at `http://localhost:8080` and open the console.

## utils

### viewOf(vnode)

```js
import {viewOf} from 'proponents'

const CurrentDate = {
  view: v => 
    viewOf(v)(new Date()),
}

// ...

m(CurrentDate, date => 
  m('p', date),
)

m(CurrentDate, { 
  view: date =>
    m('p', date),
})

m(CurrentDate, m('p', '...'))
```

`viewOf` is a utility function to help write components with view attributes - Mithril's equivalent to React render props - a pattern for supplying data to the subtree. The invocation can then pass in a `view` attribute or a function as the only child - in which case that function will be supplied with the input of `viewOf(vnode)(input)`. If neither of these are provided the children are output directly as per standard hyperscript behaviour.

This function is desirable when a component provides or manipulates data that needs to be exposed to the call site, but has no opinions about view structure. It is used by several Proponents: a proponent that makes use of `viewOf` is described as implementing the `viewOf` interface. 

## Inline

```js
import {Inline} from 'proponents'

// ...

m(Inline, InlineComponentDefinition)
```

Allows an inline component declaration. This allows defining ad-hoc state within a view hierarchy without the need to define component lifecycle externally. In practice I haven't found `Inline` components to be particularly useful in application design, but they can be very helpful in developing components on the fly for eventual refactoring as separate references.

* Only closure & POJO component definitions are accepted
* Only the first declaration will be used by default - changing component definitions in subsequent loops will not take any effect, unless a new `key` attribute is provided

## Effect

```js
import {Effect} from 'proponents'

const Alert = {
  ...Effect,
  oncreate: v => {
    alert(v.children)
  },
}

// ...

m(Effect, {
  oncreate: v => {
    document.addEventListener('keypress', keyboardNavigationOverride)
  },

  onremove: v => {
    document.removeEventListener('keypress', keyboardNavigationOverride)
  },
})
```

Effect is simply a minimal component definition consisting exclusively of an empty view property. While this doesn't provide any useful functionality of itself, it's useful as a semantic indicator that the virtual DOM being described does not intend to produce any DOM and exists purely to trigger effects according to its lifecycle - by contrast explicitly declaring an empty view function may look like a mistake or work in progress. 

## Promiser

```js
import {Inline, Promiser} from 'proponents'
import {Content} from './my/components'

// ...

m(Inline, () => {
  const request = m.request('/path/to/data')

  return {
    view: () => 
      m(Promiser, ({pending, resolved, data, error}) =>
        pending  ? m('p', 'Loading...') :
        resolved ? m(Content, {data})   :
                   m('p', 'Error:', m('code', error))  
      ),
  }
})
```

Consumes a `promise` property, implements the `viewOf` interface. Redraws when the promise settles; Provides the view with a verbose hash that fully describes the current state of the promise.

## Memo

```js
import {Memo} from 'proponents'
import {Header, Contents, Footer} from './my/components'

// ...

m(Memo, m(Header)),
m(Content),
m(Memo, m(Footer)),
```

Will only ever compute the contents once. Useful for static parts of the app that do not require any update logic.

Functionally equivalent to:

```js
m.fragment({onbeforeupdate: () => false}, m(Header)),
m(Content),
m.fragment({onbeforeupdate: () => false}, m(Footer)),
```

## Waiter

```js
import {Waiter} from 'proponents'
import {Layout, Animating} from './my/components'

// ...

condition &&
  m(Waiter, Service =>
    m(Layout,
      m(Service,
        m(Animating),
      ), 
    ),
  ),
```

`Waiter` is a composite component that exposes a `Service` component. When the Waiter component would be removed from the virtual DOM tree, any immediate children of `Service` component instances will fire `onbeforeremove`, and wait for all of these to be resolved before `Waiter` is removed. `Service` can be invoked several times.

## Context

```js
import {Context, Receiver} from 'proponents'

const symbol = Symbol()

const MyComponent = {
  view: ({attrs}) =>
    m(Receiver, context =>
      context[symbol],
    ),
}

// ...

m(Context, {[symbol]: 'Hello'}, m(MyComponent)),
```

Implements something akin to React's `context` API, whereby properties can be provided at a high level and received in the subtree without being explicitly passed down, implementing the CSS cascade graph in the virtual DOM layer.

## Window

```js
import {Window} from 'proponents'

// ...

popup &&
  m(Window, {
    name: 'popup',
    features: 'menubar=0;location=0;status=0;',
    catch: () => {
      alert(`Couldn't open a new window. Please enable popups in your browser.`)
    },
  },
    it =>
      m('h1', 'Hello'),
  ),
```

A component for declaring multi-window interfaces in one virtual DOM tree. Opens a new window on initialisation, closes it on removal.

Accepts the optional `url`, `name`, and `features` attributes which are passed as 1st, 2nd and 3rd arguments to the DOM native `window.open` function. The optional `catch` attribute accepts a function which will be called if the `window.open` call fails.

Implements the `viewOf` interface. In the case where a view function is provided, it will be supplied with a reference to the containing window.

## Island

```js
import {Island} from 'proponents'
import {Discrete, Lots, Of, Stuff} from './my/components'

// ...

[
  m(Lots,  'foo bar baz'),

  m(Of,    'blah blah blah'),

  m(Stuff, 'etc etc etc',
    m(Island, redraw =>
      m(Discrete, {
        callback: redraw,
      }),
    ),
  ),
]
```

Defines a section of virtual DOM which can be redrawn independently of the surrounding context. Useful for sections of DOM requiring high frequency redraws based on concerns orthogonal to the rest of the application. Implements the `viewOf` interface: the view is provided with the local redraw function.

Island creates an intervening div element with its display style set to `contents`. For accessiblity and layout purposes, the element will not have any effect - but it could flumox highly specific CSS hierarchy selectors or assumptive manual DOM traversal.
