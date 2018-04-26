export default element => {
  while(!element.vnodes)
    element = element.parentNode

  return element
}
