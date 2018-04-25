export default  (vnode, root) => {
  for(const node of crawl(root.vnodes))
    if(node === v)
      return {
        context  : node,
        position : 0,
      }

    else if(Array.isArray(node)){
      const index = node.findIndex(subject => subject === v)

      if(index >= 0)
        return {
          context  : context,
          position : index,
        }
    }
}
