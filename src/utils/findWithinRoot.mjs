import crawl from 'src/utils/vtreeIterator.mjs'

export default  (target, root) => {
  const path = []
  let host

  for(const {node, key, container} of crawl({node: root.vnodes})){
    if(node.dom === target.dom){
      path.push(key)

      if(!host)
        host = container
    }

    if(node === target)
      return {path, host}
  }
}
