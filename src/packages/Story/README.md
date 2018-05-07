# Story

## What?

`Story` provides a convenient interface for writing animated components in 'plain' virtual DOM without relying on lifecycle hooks.

## Why?

The canonical approach to animating vnodes is to use oncreate and `onbeforeremove` (OBR) lifecycle methods to break out of virtual DOM and manipulate the DOM directly. This gets verbose & repetitious fast, especially if multiple elements need animation. It's possible to define directives for reusable animation components but these either lack flexibility or suffer from configuration APIs which quickly become as cumbersome as un-abstracted direct DOM manipulation.

`Story` provides you with state flags representing the lifecycle to interpolate in the vdom itself allowing for richly expressive animations with a minimum of configuration.

## How?

`Story`'s minimal interface consumes a child view which it provides with `({beginning, middle, end})`, one of which is true at any given time. On first draw `beginning` is `true`; immediately after first paint it redraws with `middle` as `true`; OBR causes a redraw with `end` as `true`. 

The minimal interface assumes an application initialised with `m.mount` or `m.route`, and the `transitionend` event as the trigger to resolve OBR. It can consume an additional callback hook to trigger redraw in explicit draw environments. Providing an OBR hook overrides the `transitionend` trigger for removal and allows you to provide your own.
