import /* m from */ 'mithril'

import {Inlet, Outlet} from 'src/packages/Portal/index.mjs'

m.mount(document.body, {
  view: () =>
    m('div', {style: `
      font-family : sans-serif;
      padding     : 1em;
    `},

    m(Outlet, {key: 'banner'}, content =>
      m('div', {style: `
        padding : 1em;
        border  : 1px solid;
      `},
        content
      )
    ),

    m(Inlet, {key: 'modal'}, m('p', 'Hello!')),

    m('h1', 'Hi!'),

    m('p', 'Generic page content'),

    m(Inlet, {key: 'banner'},
      m('p', m('b', 'Warning!')),
    ),

    m(Outlet, {key: 'modal'}, content =>
      m('div', {style: `
        position  : fixed;
        top       : 50vh;
        left      : 50vw;
        transform : translate(-50%, -50%);
        border    : 1px solid;
        padding   : 1em;
      `},
        content
      ),
    ),
  ),
})
