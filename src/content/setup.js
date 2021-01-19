function stopKeyboardEvent(event) {
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
}

function shouldMatchingHintBeTriggered(event) {
    return !!(event.key === 'Enter' && state.matchingHint)
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

function handleQueryKey(event) {
    if (state.query === '' && event.key === '0') return

    stopKeyboardEvent(event)

    const newQuery = state.query + event.key
    const newQueryAsInt = parseInt(newQuery)
    const newMatch = state.hints[newQueryAsInt - 1]

    if (!newMatch) return

    state.query = newQuery
    state.matchingHint = newMatch

    filterHints()

    if (state.options.autoTrigger && state.hints.length < newQueryAsInt * 10) {
        triggerMatchingHint()
    }
}

function clearFilterFromHints() {
    state.renderCache.containerEl.classList.remove(classNames.filtered)

    for (const { hintEl } of state.hints) {
        hintEl.classList.remove(classNames.match)
    }
}

function handleEscapeKey(event) {
    stopKeyboardEvent(event)

    if (state.query) {
        state.query = ''
        state.matchingHint = null
        clearFilterFromHints()
    } else {
        deactivateHintMode()
    }
}

function handleActivationKey(event, isNewTabActivationShortcut) {
    stopKeyboardEvent(event)

    if (state.active) {
        if (state.openInNewTab !== isNewTabActivationShortcut) {
            state.openInNewTab = isNewTabActivationShortcut
        } else {
            deactivateHintMode()
        }
    } else {
        state.openInNewTab = isNewTabActivationShortcut
        activateHintMode()
    }
}

function handleKeydown(event) {
    if (event.repeat) return

    const aShortcut = state.options.activationShortcut
    const isActivationShortcut = doesEventMatchShortcut(event, aShortcut)

    const newTabShortcut = state.options.newTabActivationShortcut
    const isNewTabActivationShortcut = doesEventMatchShortcut(event, newTabShortcut)

    if (shouldMatchingHintBeTriggered(event)) {
        stopKeyboardEvent(event)
        setTimeout(triggerMatchingHint)
    } else if (isActivationShortcut || isNewTabActivationShortcut) {
        handleActivationKey(event, isNewTabActivationShortcut)
    } else if (state.active && !eventHasModifierKey(event)) {
        if (event.key === 'Escape') {
            handleEscapeKey(event)
        } else {
            const allowedQueryCharacters = '1234567890'

            if (allowedQueryCharacters.includes(event.key)) {
                handleQueryKey(event)
            }
        }
    }
}