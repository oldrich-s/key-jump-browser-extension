function deactivateHintMode() {
    for (const { hintEl } of state.hints) {
        hintEl.parentNode.removeChild(hintEl)
    }
    state.hints = []

    state.renderCache.containerEl.classList.remove(classNames.filtered)
    state.renderCache.containerEl.classList.remove(classNames.active)

    state.active = false
    state.openInNewTab = null
}