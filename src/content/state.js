const classNames = Object.freeze({
    container: 'KEYJUMP',
    hint: 'KEYJUMP_hint',
    active: 'KEYJUMP_active',
    filtered: 'KEYJUMP_filtered',
    match: 'KEYJUMP_match',
})

const state = {
    rootEl: document.documentElement,
    active: false,
    openInNewTab: null,
    hints: [],
    query: '',
    matchingHint: null,
    renderCache: null,
    os: null,
}