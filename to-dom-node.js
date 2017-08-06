export default html => {
  const el = document.createElement('template')
  el.innerHTML = html
  return el.content.cloneNode(true)
}
