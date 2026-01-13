const MENU_ID = 'paste-text'

const createContextMenu = () => {
  try {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: 'Supermicro - Paste Text into virtual console',
      contexts: ['all'],
    })
  } catch (error) {
    console.error('Error creating context menu:', error)
  }
}

const removeAllContextMenus = (): Promise<void> =>
  new Promise((resolve) => {
    let resolved = false
    const finish = () => {
      if (!resolved) {
        resolved = true
        resolve()
      }
    }

    try {
      const maybePromise = chrome.contextMenus.removeAll(() => finish())
      if (maybePromise && typeof (maybePromise as Promise<void>).then === 'function') {
        ;(maybePromise as Promise<void>).then(finish).catch(finish)
      }
    } catch (error) {
      console.error('Error clearing context menus:', error)
      finish()
    }
  })

const registerContextMenu = () => {
  removeAllContextMenus().then(createContextMenu).catch(() => createContextMenu())
}

registerContextMenu()

if (chrome.runtime?.onInstalled) {
  chrome.runtime.onInstalled.addListener(() => registerContextMenu())
}

if (chrome.runtime?.onStartup) {
  chrome.runtime.onStartup.addListener(() => registerContextMenu())
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === MENU_ID && tab?.id) {
    try {
      const tabId = tab.id

      const sendPasteMessage = () => {
        setTimeout(() => {
          try {
            const result = chrome.tabs.sendMessage(tabId, { action: 'PASTE_TEXT' }) as unknown
            if (result && typeof (result as Promise<unknown>).catch === 'function') {
              ;(result as Promise<unknown>).catch(() => {})
            }
          } catch (error) {
            // Firefox MV2 uses callbacks; surface runtime errors in console
            const runtimeError = (chrome.runtime && chrome.runtime.lastError) || error
            if (runtimeError) {
              console.error('Error sending message:', runtimeError)
            }
          }
        }, 100)
      }

      if (chrome.scripting && chrome.scripting.executeScript) {
        await chrome.scripting.executeScript({
          target: { tabId },
          files: ['content.js'],
        })
        sendPasteMessage()
        return
      }

      chrome.tabs.executeScript(tabId, { file: 'content.js' }, () => {
        if (chrome.runtime && chrome.runtime.lastError) {
          console.error('Error injecting content script:', chrome.runtime.lastError)
          return
        }
        sendPasteMessage()
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }
})
