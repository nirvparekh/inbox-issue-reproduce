import React from 'react'
import ReactDOM from 'react-dom'
import GmailToolbarButton from './GmailToolbarButton'
import * as InboxSDK from '@inboxsdk/core'

InboxSDK.load(2, 'sdk_Klutch_5a9c6f8ba7', { appName: 'appName' }).then(function (sdk) {
  sdk.Compose.registerComposeViewHandler(function (composeView) {
    composeView.addButton({
      title: 'Klutch Extension',
      iconUrl: window.chrome.extension.getURL('img/logos/48.png'),
      hasDropdown: true,
      noOverflow: true,
      onClick: async (event) => {
        const el = event.dropdown.el
        el.style.width = '330px'
        el.style.height = '470px'
        el.style.overflow = 'hidden'
        el.style.backgroundColor = '#fff'
        el.style.borderColor = 'none'
        el.innerHTML = '<div id="klutch-gmail-root"></div>'
        ReactDOM.render(<GmailToolbarButton composeView={composeView} sdk={sdk} />, document.querySelector('#klutch-gmail-root'))
        composeView.on('minimized', () => {
          event.dropdown.close()
        })
      }
    })
    setTimeout(() => {
      const icon = document.querySelector('.inboxsdk__composeButton[data-group-order-hint="sdk_Klutch_5a9c6f8ba7"]')
      icon.querySelector('.inboxsdk__button_icon').style.opacity = 1
    }, 1000)
  })
})
