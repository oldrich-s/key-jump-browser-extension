function isRectInViewport(rect) {
    if (
        !rect ||
        rect.top >= document.documentElement.clientHeight ||
        rect.left >= document.documentElement.clientWidth ||
        rect.bottom <= 0 ||
        rect.right <= 0
    ) {
        return false
    }

    return true
}

function isRectVisible(rect) {
    // TODO: BUG
    // This will report false even if the element the rect is for has a visible
    // overflow which means that the content is still visible even though the
    // element has 0 width/height.
    return isRectInViewport(rect) && rect.width > 0 && rect.height > 0
}

function isClickable(el, left, top) {
    const clickEl = document.elementFromPoint(left, top)
    if (!clickEl) return false
    return clickEl === el || el.contains(clickEl) || clickEl.contains(el)
}


function isElementVisible(el) {
    let rect = el.getBoundingClientRect()

    if (!isRectInViewport(rect)) return false

    const el1 = isClickable(el, rect.left, rect.top)
    const el2 = isClickable(el, rect.left, rect.bottom)
    const el3 = isClickable(el, rect.right, rect.top)
    const el4 = isClickable(el, rect.right, rect.bottom)
    if (!el1 && !el2 && !el3 && !el4) return false

    // These overflow values will hide the overflowing child elements.
    const hidingOverflows = ['hidden', 'auto', 'scroll']
    const allowedCollapsedTags = ['html', 'body']

    while (el) {
        const styles = window.getComputedStyle(el)

        if (
            // prettier-ignore
            styles.display === 'none' ||
            styles.visibility === 'hidden' ||
            styles.opacity === '0' ||
            (
                (
                    (rect.width <= 0 && hidingOverflows.includes(styles['overflow-x'])) ||
                    (rect.height <= 0 && hidingOverflows.includes(styles['overflow-y']))
                ) &&
                !allowedCollapsedTags.includes(el.tagName.toLowerCase())
            )
        ) {
            return false
        }

        el = el.parentElement

        if (el) {
            rect = el.getBoundingClientRect()
        }
    }

    return true
}



