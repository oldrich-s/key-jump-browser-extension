// Workaround until dynamic imports are supported in browser extensions in all
// browsers.
const KJ = (window.__KEYJUMP__ = window.__KEYJUMP__ || {})
KJ.bootstrapState = function bootstrapState(state = {}, callback) {
  let gotInfo = false
  let gotOptions = false

  // Not available in content script.
  if (chrome.runtime.getPlatformInfo) {
    chrome.runtime.getPlatformInfo(getInfoCallback)
  } else {
    getInfoCallback({
      // Only need to know if Mac in the content script.
      os: navigator.platform.toLowerCase().includes('mac') ? 'mac' : 'unknown',
    })
  }

  function getInfoCallback(info) {
    state.os = info.os
    gotInfo = true
    runCallbackIfDone()
  }

  chrome.storage.sync.get(null, (options) => {
    state.options = processOptions(options)
    gotOptions = true
    runCallbackIfDone()
  })

  function runCallbackIfDone() {
    if (gotInfo && gotOptions) {
      callback(state)
    }
  }
}

function processOptions(options) {
  const defaultOptions = {
    optionsVersion: 1,
    activationShortcut: {
      key: 'F4',
      shiftKey: false,
      ctrlKey: false,
      altKey: false,
      metaKey: false,
    },
    newTabActivationShortcut: {
      key: 'F4',
      shiftKey: false,
      ctrlKey: true,
      altKey: false,
      metaKey: false,
    },
    autoTrigger: true,
  }

  if (!options || options.optionsVersion !== defaultOptions.optionsVersion) {
    options = defaultOptions

    chrome.storage.sync.set(options)
  }

  return options
}
