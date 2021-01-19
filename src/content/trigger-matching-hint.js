function canElementBeTypedIn(el) {
    // Unknown input types are treated as text inputs so it's easier to test
    // for the types that we know can't be typed in.
    const typesYouCantTypeIn = [
        'button',
        'checkbox',
        'color',
        'file',
        'image',
        'radio',
        'range',
        'reset',
        'submit',
    ]
    const tagName = el.tagName.toLowerCase()
    const type = (el.type || '').toLowerCase()
    const typeCanBeTypedIn = !typesYouCantTypeIn.includes(type)

    return (
        el.isContentEditable ||
        (!el.readOnly &&
            (tagName === 'textarea' || (tagName === 'input' && typeCanBeTypedIn)))
    )
}

function shouldElementBeFocused(el) {
    const tagName = el.tagName.toLowerCase()
    const inputType = (el.type || '').toLowerCase()

    return (
        tagName === 'select' ||
        (tagName === 'input' && inputType === 'range') ||
        canElementBeTypedIn(el)
    )
}

function triggerMatchingHint() {
    const { matchingHint: { targetEl }, openInNewTab } = state

    if (shouldElementBeFocused(targetEl)) {
        targetEl.focus()
    } else {
        const isMac = state.os === 'mac'

        const mouseEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            ctrlKey: openInNewTab && !isMac,
            metaKey: openInNewTab && isMac,
        })

        targetEl.dispatchEvent(mouseEvent)
    }

    deactivateHintMode()
}