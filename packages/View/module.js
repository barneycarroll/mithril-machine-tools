export default {
  view: v =>
    v.attrs.view.call(v.state, v)
}
