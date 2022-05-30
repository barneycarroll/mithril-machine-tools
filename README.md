# Mithril Machine Tools

Putting the hype back in hyperscript, the OM back in virtual DOM; A bag of tricks for [Mithril](https://mithril.js.org).

Components are a popular mainstream abstraction, but the true power of component composition is largely unexplored. Mithril Machine Tools is a pragmatic demonstration of what is possible with components that seek to expose — rather than enclose — the power of Mithrils hyperscript & virtual DOM interfaces. Use these tools as aids in application design, or as conceptual aids in building your own abstractions!

```js
import {
  // 👇 Components
  createContext, Inline, Liminal, Mobile, Promiser, Shadow, Static,

  viewOf, indexOf, domOf, getSet,
  // 👆 Utilities
} 
  from 'mithril-machine-tools'
```

## Components

### createContext

`createContext` emulates [Reacts context API](https://reactjs.org/docs/context.html), using the virtual DOM hierarchy as a data transport mechanism in a manner similar to CSS properties vis-à-vis the DOM. Values set by a `Provider` component can be retrieved by a corresponding `Receiver` component anywhere in its subtree.

```js
import {createContext} from 'mithril-machine-tools'

const {Provider, Consumer} = createContext()

m.mount(document.body, {
  view : () =>
    m(Provider, {value: state}, 
      m(Layout), // Nothing is passed in to Layout
    ),
})

// In fact, layout doesn't know anything about context
function Layout(){
  return {
    view : () => [
      m(Header),
      m(Reader),
      m(Footer),
    ],
  }
}

function Reader(){
  return {
    view : () =>
      // Consumer retrieves the value set by its virtual DOM ancestry
      m(Consumer, value =>
        m('code', 'value === state :', value === state), 
      ),
  }
}
```

### Inline

The `Inline` component takes a component expression as its input: This allows you to describe stateful behaviour inline in the virtual DOM tree itself, affording all the benefits of localised isolation without the restrictive indirection.

```js
import {Inline} from 'mithril-machine-tools'

m.mount(document.body, function A(){
  let a = 0
  
  return {
    view: () => [
      m('p', {
        onclick: () => { a++ },
      }, 'a is ', a),

      m(Inline, function B(){
        let b = 0

        return {
          view: () => [
            m('p', {
              onclick: () => { b++ },
            }, 'b is ', b),

            m('p', 'a * b  is ', a * b),
          ],
        }
      })
    ],
  }
})
```

### Mobile

In Mithril, ["Keys are a mechanism that allows re-ordering DOM elements *within a NodeList*"](https://mithril.js.org/keys.html). `Mobile` exposes a `Unit` component which provided with a persistent `key` can move anywhere within the `Mobile` view.

```js
import {Mobile} from 'mithril-machine-tools'

m.mount(document.body, {
  view: () =>
    m(Mobile, Unit => 
      ['To do', 'Doing', 'Done'].map(status => 
        m('.Status',
          m('h2', status),

          issues
            .filter(issue => issue.status === status)
            .map(issue =>
              m(Unit, {key: issue.id},
                m(Issue, {issue}),
              ),
            ),
        ),
      ),
    ),
})
```

### Promiser

`Promiser` consumes a promise and exposes a comprehensive state object for that promise, redrawing when it settles. This allows convenient pending, error & success condition feedback for any asynchronous operation without bloating your application model.

```js
import {Promiser} from 'mithril-machine-tools'

m.mount(document.body, function Search(){
  let request

  return {
    view: () => [
      m('input[type=search]', {oninput: e => {
        request = m.request('/search?query=' + e.target.value)
      }}),

        !request 
      ? 
        m('p', '👆 Use the field above to search!')
      :
        m(Promiser, {promise: request},
          ({value, pending, resolved}) => [
            pending && m(LoadingIndicator),

            resolved && mI(Results, {value}),
          ],
        ),
    ],
  }
})
```

### Shadow

`Shadow` creates a DOM node in the current tree (by default, a `div` with a style of `display: contents`), attaches an open shadow root to it, and renders any supplied children to its [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) tree. Significantly, this enables style encapsulation at will.

An optional `selector` attribute allows you to provide a string to define the host element; any other supplied attributes are passed on to this element.

If a [view function](#viewOf) is supplied to a `Shadow` component, it will in turn be supplied with a `Slot` component: this can be used as an escape hatch from the shadow DOM — content injected into slots will assume the styles of the higher order context and ignore those defined in the shadow DOM; by default, `Slot`s are given `{name}` attributes automatically, but these can be specified if preferred; like the `Shadow` host element, `Slot`s will by default render into a `div` with a style of `display: contents` — you can override this behaviour with the `selector` attribute.

```js
import {Shadow} from'mithril-machine-tools'

m.mount(document.body, {
  view: () => [
    m('style', `
      .red {
        color: red
      }
    `),

    m('p.red#red1', 'Red?'),

    m(Shadow, Slot => [
      m('style', `
        p {
          color: green;
        }
      `),
      
      m('p.red#red2', 'Red?!'),

      m(Slot,
        m('p.red#red3', 'Red :)')
      ),
    ]),
  ],
})
```

### Static

`Static` allows you to mark a section of view that has no dynamic requirement, & consequently never needs to recompute; it exposes a `Live` component which is used to opt back in to computation lower down the tree. This can be useful to distinguish between voluminous UI whose purpose is purely structural & cosmetic, & stateful, dynamic UI within it.

```js
import {Static} from 'mithril-machine-tools'

m.mount(document.body, {
  view: () =>
    m(Static, Live => [
      m(Nav),

      m(Header,
        m(Live, m('h1', title)),
      ),

      m(PageLayout,
        m(Live, m(Form)),
      ),
    ],
})
```

### Liminal

`Liminal` is an effects component which applies CSS classes to the underlying DOM to reflect lifecycle, listens for any CSS transitions or animations triggered by the application of these classes, and defers removal until these effects have resolved. The component accepts any of the attributes `{base, entry, exit, absent, present}` to determine what classes to apply, and an optional `blocking` attribute which if true, ensures that entry effects complete before exit effects are triggered; the class properties can be space-separated strings containing multiple classes. `Liminal` must have a singular element child.

```js
import {Liminal} from 'mithril-machine-tools'

m.route(document.body, '/page/1', {
  '/page/:index': {
    render: ({attrs: {index}}) =>
      m(Liminal, {
        key: index,
        base   : 'base',
        entry  : 'entry',
        exit   : 'exit',
        absent : 'absent',
        present: 'present',
      },
        m('.Page', 
          m('.Menu'),
        ),
      ),
  },
})
```

```css
.Page.base {
  transition: opacity 400ms ease-in-out;
}

.Page.absent {
  opacity: 0;
}

.Page.present {
  opacity: 1;
}

/* CSS selectors can qualify effects based on ancestry */
.Page.present .Menu {
  animation: slideIn 600ms ease-in-out;
}

.Page.exit    .Menu {
  animation: slideIn 600ms ease-in-out reverse;
  /*                 👆😲
   * There is no à priori requirement to synchronise effects:
   * Liminal detects all effects triggered by class application
   * and ensures they have all resolved before proceeding.
   */
}

@keyframes slideIn {
  from {transform: translateX(-100%)}
  to   {transform: translateX(   0%)}
}
```

If you wish to establish an app-wide convention of `Liminal` configuration, the component can be partially applied by invoking it as function with configuration input:

```js
import {Liminal} from 'mithril-machine-tools'

const Animated = Liminal({
  base     : 'base',
  entry    : 'entry',
  exit     : 'exit',
  absent   : 'absent',
  present  : 'present',
  blocking : true,
})

m(Animated, m('.element'))
```

## Utilities

### viewOf

`viewOf` is used by nearly all of the MMT components. It enables a component interface that accepts a view function as input, instead of pre-compiled virtual DOM nodes. This allows you to write components which seek to expose special values to the view at call site, or control its execution context.

```js
import {viewOf} from 'mithril-machine-tools'

function Timestamp(){
  const timestamp = new Date()
  
  return {
    view: v =>
      viewOf(v)(timestamp)
  }
}

m.mount(document.body, {
  view: () =>
    m(Timestamp, time =>
      m('p', time.toLocaleTimeString()),
    ),
}
```

### reflow

Used when a script requires all pending DOM mutations to persist and have their effects persist to screen before proceeding, `reflow` returns a promise that internally queries document body dimensions to trigger reflow. Multiple `reflow` calls in the same tick will return the same promise, allowing queries to be batched for a minimum of DOM-thrashing. `reflow` is particularly useful in `oncreate` hooks to ensure transitions caused by temporary CSS application are not optimised away by DOM mutation batching.

```js
import {reflow} from 'mithril-machine-tools'

m('div', {
  async oncreate({dom}){
    dom.classList.add('initial-state')
    
    await reflow() // 👈 without reflow, `initial-state` risks never being applied

    dom.classList.remove('initial-state')
  }
})
```

### indexOf

Retrieves the index of the supplied nodes position within its parent nodes list of immediate child nodes.

```js
import {indexOf} from 'mithril-machine-tools'

m.mount(document.body, {
  view: () => 
    m('.Page',
      m('h1', 'Hello'),
      
      m('p', {
        oncreate : v => {
          v.dom.textContent =
            `I'm child number ${ indexOf(v.dom) }!`
        },
      }),
    ),
}
```

### domOf

Retrieves an array of DOM nodes contained by a virtual node.

```js
import {domOf} from 'mithril-machine-tools'

m.mount(document.body, {
  view: () =>
    m('h1', {
      oncreate: v => {
        console.assert(
          domOf(v).length === 3
          &&
          domOf(v)[0].nodeValue === 'Hello'
        )
      },
    }, 
      'Hello', ' ', 'you',
    ),
})
```

### getSet

`getSet` follow the [uniform access principle](http://lhorie.github.io/mithril-blog/the-uniform-access-principle.html) of virtual DOM & applies it to [Maps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map). This enables the use of maps as a data structure which can be queried such that access code does not need to conditionally fork for whether a value associated with any given key needs to be created, or merely retrieved — which can be extremely useful in writing expressive queries that work with the grain of Mithril applications. This is used in the `Static` module [to determine the rendering context of `Live` components](https://github.com/barneycarroll/mithril-machine-tools/blob/base/src/Static.js#L35).

```js
import {getSet, Promiser} from 'mithril-machine-tools'

const requests = new Map

m.route(document.body, '/user/barney', {
  '/user/:userId': {
    render: ({attrs: {userId}}) =>
      m(Promiser, {
        promise: getSet(requests, '/data/user/' + userId, url => 
          m.request(url)
        ),
      }, ({pending, resolved, value : user}) =>
        m('.Profile', {
          style: {
            transition: 'opacity 1s ease-in-out',
            opacity   : pending ? 0.75 : 1,
          },
        },
          resolved && [
            m('h1', user.name),
          
            m('p', user.handle),
          ],
        ),
      ),
  },
})
```

### Table

`Table` behaves like a set whose contents are identified not by equality but by comparing a set of properties, which must be supplied to the table at initialisation.

```js
import Table from 'mithril-machine-tools'

const users = new Table(['username', 'email'])

table.add({
  username: 'Barney', 
  email: 'barney.carroll@gmail.com',
  age: 35,
})

table.add({
  username: 'Barney',
  email: 'barney.carroll@gmail.com',
  age: 42,
})

console.assert(table.size === 1)

console.assert(
  table.get({
    username: 'Barney',
    email: 'barney.carroll@gmail.com',
  })
    .age === 35
)
```
