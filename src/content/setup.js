function stopKeyboardEvent(event) {
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
}

function doesEventMatchShortcut(event, shortcut) {
    return (
        event.key === shortcut.key &&
        event.shiftKey === shortcut.shiftKey &&
        event.ctrlKey === shortcut.ctrlKey &&
        event.altKey === shortcut.altKey &&
        event.metaKey === shortcut.metaKey
    )
}

function eventHasModifierKey(event) {
    return !!(event.shiftKey || event.ctrlKey || event.altKey || event.metaKey)
}

function handleKeydown(event) {
    if (event.repeat) return

    const aShortcut = state.options.activationShortcut
    const isActivationShortcut = doesEventMatchShortcut(event, aShortcut)

    const newTabShortcut = state.options.newTabActivationShortcut
    const isNewTabActivationShortcut = doesEventMatchShortcut(event, newTabShortcut)

    if (isActivationShortcut || isNewTabActivationShortcut) {
        stopKeyboardEvent(event)
        if (state.active) deactivateHintMode()
        else {
            state.openInNewTab = isNewTabActivationShortcut
            state.active = true
            redrawHints()
        }
    } else if (state.active && !eventHasModifierKey(event)) {
        if (event.key === 'Escape') {
            stopKeyboardEvent(event)
            deactivateHintMode()
        } else if (allowedChars.includes(event.key)) {
            stopKeyboardEvent(event)
            const hint = state.hints.find(hint => hint.id === event.key)
            if (hint) triggerMatchingHint(hint)
        }

    }
}