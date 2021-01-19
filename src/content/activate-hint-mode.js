function renderHints() {
    const { renderCache: cache } = state

    const fragment = document.createDocumentFragment()
    const winHeight = document.documentElement.clientHeight

    for (const hint of state.hints) {
        hint.hintEl = cache.hintSourceEl.cloneNode(true)
        hint.hintEl.textContent = hint.id

        fragment.appendChild(hint.hintEl)

        // TODO: Refactor to find the first visible child element instead of rect.
        // We must check both the element rect and styles to see if it is visible.
        const rects = hint.targetEl.getClientRects()
        // If none of the rects are visible use the first rect as a workaround...
        const targetPos = Array.from(rects).find(isRectVisible) || rects[0]
        const hintCharWidth = cache.hintCharWidth * hint.id.length

        const top = Math.max(
            0,
            Math.min(Math.round(targetPos.top), winHeight - cache.hintHeight),
        )
        const left = Math.max(
            0,
            Math.round(targetPos.left - cache.hintWidth - hintCharWidth - 2),
        )

        hint.hintEl.style.top = top + 'px'
        hint.hintEl.style.left = left + 'px'
    }

    cache.containerEl.appendChild(fragment)
}

function setupRendering() {
    const cache = (state.renderCache = {})

    cache.containerEl = document.createElement('div')
    cache.containerEl.classList.add(classNames.container)
    state.rootEl.appendChild(cache.containerEl)

    cache.hintSourceEl = document.createElement('div')
    cache.hintSourceEl.classList.add(classNames.hint)

    const hintDimensionsEl = cache.hintSourceEl.cloneNode(true)
    cache.containerEl.appendChild(hintDimensionsEl)

    cache.hintWidth = hintDimensionsEl.offsetWidth
    hintDimensionsEl.innerHTML = '0'
    cache.hintHeight = hintDimensionsEl.offsetHeight
    cache.hintCharWidth = hintDimensionsEl.offsetWidth - cache.hintWidth

    cache.containerEl.removeChild(hintDimensionsEl)
}

function findHints() {
    const targetEls = state.rootEl.querySelectorAll(
        [
            // Don't search for 'a' to avoid finding elements used only for fragment
            // links (jump to a point in a page) which sometimes mess up the hint
            // numbering or it looks like they can be clicked when they can't.
            'a[href]',
            'input:not([disabled]):not([type=hidden])',
            'textarea:not([disabled])',
            'select:not([disabled])',
            'button:not([disabled])',
            '[contenteditable]:not([contenteditable=false]):not([disabled])',
            '[ng-click]:not([disabled])',
            // GWT Anchor widget class
            // http://www.gwtproject.org/javadoc/latest/com/google/gwt/user/client/ui/Anchor.html
            '.gwt-Anchor',
        ].join(','),
    )

    let hintId = 1

    state.hints = []

    for (const el of targetEls) {
        if (!isElementVisible(el)) continue

        state.hints.push({ id: String(hintId), targetEl: el })
        hintId++
    }
}

function activateHintMode() {
    findHints()

    if (!state.hints.length) return

    if (!state.renderCache) setupRendering()

    renderHints()

    if (state.query) filterHints()

    state.active = true
    state.renderCache.containerEl.classList.add(classNames.active)
}