export default function findRoot(dom){
  while(!dom.vnodes)
    dom = dom.parentNode

  return dom
}
