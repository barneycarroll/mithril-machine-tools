export default ({}, previous) => ({
  onbeforeupdate : ({}, {instance}) => {
    previous = instance
  },

  view: v => 
    v.children[0].children(previous)
})
