console.log('This is the background page.')
console.log('Put the background scripts here.')

// Promisify all chrome services
const bluebird = require('bluebird')
global.Promise = bluebird

function promisifier(method) {
  // return a function
  return function promisified(...args) {
    // which returns a promise
    return new Promise((resolve) => {
      args.push(resolve)
      method.apply(this, args)
    })
  }
}

function promisifyAll(obj, list) {
  list.forEach((api) => bluebird.promisifyAll(obj[api], { promisifier }))
}

// let chrome extension api support Promise
promisifyAll(chrome, ['tabs', 'windows', 'browserAction', 'contextMenus'])
promisifyAll(chrome.storage, ['local'])
// END: Promisify all chrome services

// On Tab update, inject content scripts again
function isInjected(tabId) {
  return chrome.tabs.executeScriptAsync(tabId, {
    code: `var injected = window.reactExampleInjected;
                  window.reactExampleInjected = true;
                  injected;`,
    runAt: 'document_start'
  })
}

function loadScript(name, tabId, cb) {
  if (process.env.NODE_ENV !== 'development') {
    chrome.tabs.executeScript(tabId, { file: `/${name}.js`, runAt: 'document_end' }, cb)
  } else {
    // dev: async fetch bundle
    fetch(`http://localhost:3001/${name}.js`)
      .then((res) => res.text())
      .then((fetchRes) => {
        chrome.tabs.executeScript(tabId, { code: fetchRes, runAt: 'document_end' }, cb)
      })
  }
}

chrome.tabs.onUpdated.addListener(async (tabId) => {
  const result = await isInjected(tabId)
  if (chrome.runtime.lastError || result[0]) return
  loadScript('contentScript', tabId, () => console.log('load inject bundle success!'))
})
// End: on Tab update, inject content scripts again
