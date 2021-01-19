window.__KEYJUMP__.bootstrapState(state, () => {
  window.addEventListener('keydown', handleKeydown, true)
  document.addEventListener('scroll', redrawHints)
  window.addEventListener('resize', redrawHints)
  window.addEventListener('popstate', redrawHints)
})