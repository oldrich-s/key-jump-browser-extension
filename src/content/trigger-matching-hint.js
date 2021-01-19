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

function triggerMatchingHint(hint) {
    if (shouldElementBeFocused(hint.targetEl)) {
        hint.targetEl.focus()
    } else {
        const isMac = state.os === 'mac'

        const mouseEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            ctrlKey: state.openInNewTab && !isMac,
            metaKey: state.openInNewTab && isMac,
        })

        hint.targetEl.dispatchEvent(mouseEvent)
    }

    deactivateHintMode()
}