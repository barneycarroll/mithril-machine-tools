export default function * crawl({key, node, container}){
  yield {key, node, container}

  if(Array.isArray(node))
    for(var key = 0; key < node.length; key++)
      yield * recurse()

  else
    for(var key of ['instance', 'children'])
      if(node[key])
        return yield * recurse()

  function recurse(){
    return crawl({
      key,
      node: node[key],
      container: node,
    })
  }
}
