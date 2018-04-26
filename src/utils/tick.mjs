export default async (n = 0) => {
  while(n-- > -1)
    await Promise.resolve()
}
