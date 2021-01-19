function deactivateHintMode() {
    state.renderCache.containerEl.classList.remove(classNames.filtered)
    state.renderCache.containerEl.classList.remove(classNames.active)

    state.active = false
    state.openInNewTab = null
}