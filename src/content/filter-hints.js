function filterHints() {
    state.renderCache.containerEl.classList.add(classNames.filtered)

    for (const hint of state.hints) {
        const method = hint.id.startsWith(state.query) ? 'add' : 'remove'
        hint.hintEl.classList[method](classNames.match)
    }
}