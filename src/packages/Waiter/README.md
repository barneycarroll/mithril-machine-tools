# Waiter

## What?

Waiter allows descendant nodes to have their `onbeforeremove` (OBR) hooks invoked upon and defer the resolution of an ancestor's OBR.

## Why?

OBR is invaluable for triggering outgoing animations on elements before their eventual removal without interrupting the virtual DOM draw cycle. However in some situations the DOM node being removed is not the one that needs to be animated, and linking the removed ancestor's OBR hook to the descendants(s)' DOM reference and animation directives is cumbersome & counter intuitive. Waiter allows you to keep defining OBR hooks intuitively on the elements the animations apply to.

## How?

Waiter depends on 2 or more invocations. The first invocation is the node subject to removal: it consumes a child view which is supplied with a `link` argument; the subsequent Waiter instances should be defined in that view, with `link` supplied as an eponymous attribute and the animating vnodes as immediate children: when the first Waiter instance is about to be removed, all the linked Waiter instances query their immediate children for OBR hooks, trigger them, and wait for their resolution to resolve the higher order Waiters' removal.

## But

Waiter works best when you have 3rd-party or pre-written components with predetermined OBR hooks which wouldn't normally be triggered because due to the structure of your application, the logical condition for their removal is defined at a higher level.

It is perhaps less useful as a tool for writing outgoing animations that involve several elements from scratch. If you're hand-writing a component with its own discrete complex animation requirements, consider CradleToGrave.
