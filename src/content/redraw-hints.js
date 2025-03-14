function renderHints() {
    const { renderCache: cache } = state

    const fragment = document.createDocumentFragment()
    const winHeight = document.documentElement.clientHeight

    for (const hint of state.hints) {
        hint.hintEl = cache.hintSourceEl.cloneNode(true)

        const isUpperCase = /^[A-Z]+$/.test(hint.id)
        if (isUpperCase) {
            hint.hintEl.innerHTML = `<b style="color: black;">${hint.id}</b>`            
        } else {
            hint.hintEl.innerHTML = `<b style="color: white;">${hint.id}</b>`
        }
        

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

const selectors = [
    'a[href]',
    'input:not([disabled]):not([type=hidden])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    'button:not([disabled])',
    '[contenteditable]:not([contenteditable=false]):not([disabled])',
    '[ng-click]:not([disabled])',
    '.gwt-Anchor',
    '.mod-selectable',
    '[role=button]'
]

function getElsRec($parent) {
    const $els = []
    for (const $child of $parent.children) {
        if (selectors.some(s => $child.matches(s))) $els.push($child)
        if (!$child.matches('.no-hint-and-hit')) {
            $els.push(...getElsRec($child))
        }
    }
    return $els
}

function findHints() {
    const targetEls = getElsRec(state.rootEl)

    let hintId = 0
    for (const el of targetEls) {
        const id = allowedChars[hintId]
        if (id && isElementVisible(el)) {
            state.hints.push({ id, targetEl: el })
            hintId++
        }
    }
}

function redrawHints() {
    if (!state.active) return

    for (const { hintEl } of state.hints) {
        hintEl.parentNode.removeChild(hintEl)
    }
    state.hints = []

    findHints()

    if (!state.hints.length) return
    if (!state.renderCache) setupRendering()

    renderHints()

    state.renderCache.containerEl.classList.add(classNames.active)
}