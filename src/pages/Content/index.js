const insertGmailToolbar = () => {
  require('./gmailButtonScript/index')
}

chrome.runtime.onMessage.addListener((request) => {
  // from: ContextMenuHandler - ADD RESPONSE TO INPUT ELEMENT
  if (request.type === 'client-message-updateSettings') {
    insertGmailToolbar()
  }
})

insertGmailToolbar()
