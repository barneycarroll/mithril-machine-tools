export default function * crawl(node){
  yield node

  for(const subtree of ['instance', 'children'])
    if(node[subtree])
      return yield * crawl(node[subtree])

  if(Array.isArray(node))
    for(const child of node)
      yield * crawl(child)
}
