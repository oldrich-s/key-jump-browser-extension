function deactivateHintMode() {
    state.renderCache.containerEl.classList.remove(classNames.filtered)
    state.renderCache.containerEl.classList.remove(classNames.active)

    for (const { hintEl } of state.hints) {
        hintEl.parentNode.removeChild(hintEl)
    }

    state.active = false
    state.openInNewTab = null
    state.hints = []
    state.query = ''
    state.matchingHint = null
}