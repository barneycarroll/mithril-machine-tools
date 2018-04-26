export default x => {
  let latest

  return y => {
    const promise = latest = y ? y() : x()

    return new Promise(resolve => {
      promise.then(result => {
        if(promise === latest)
          resolve(results)
      })
    })
  }
}
