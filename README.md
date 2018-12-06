# Proponents

Utility components for Mithril.

Work in progress. See the `/tests/` folder for an indication of progress.

## utils

### viewOf(vnode)

```js
import {viewOf} from './proponents/src/utils.js'

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

m(CurrentDate, m('p', '?'))
```

`viewOf` is a utility function to help write components with view attributes - Mithril's equivalent to React render props - which enables various patterns for providing data to the subtree. The invocation can then provide a `view` attribute or pass a function as the only child - in which case that function will be supplied with the input of `viewOf(vnode)(input)`. If neither of these are provided the children are output directly as per standard hyperscript behaviour.

This function is desirable when a component provides or manipulates data that needs to be exposed to the call site, but has no opinions about view structure. It is used by several Proponents.

## Inline

```js
import Inline from './proponents/src/Inline.js'

m(Inline, InlineComponentDefinition)
```

Allows an inline component declaration. This allows defining ad-hoc state within a view hierarchy without the need to define component lifecycle externally. In practice I haven't found `Inline` components to be particularly useful in application design, but they can be very helpful in developing components on the fly for eventual refactoring as separate references.

* Only closure & POJO component definitions are accepted
* Only the first declaration will be used by default - changing component definitions in subsequent loops will not take any effect, unless a new `key` attribute is provided

## Promiser

Consumes a `promise` property and a view function: Redraws when the promise settles; Provides the view with a verbose hash that fully describes the current state of the promise.

...

To be continued