// Guard to prevent multiple listener registrations
if (!(window as any).__supermicroBMCPasteLoaded) {
  (window as any).__supermicroBMCPasteLoaded = true

  // Mapping of special characters to their keyCode and shift requirement
  const charMap: Record<string, { code: number; shift: boolean }> = {
    // Lowercase letters - no shift
    'a': { code: 65, shift: false },
    'b': { code: 66, shift: false },
    'c': { code: 67, shift: false },
    'd': { code: 68, shift: false },
    'e': { code: 69, shift: false },
    'f': { code: 70, shift: false },
    'g': { code: 71, shift: false },
    'h': { code: 72, shift: false },
    'i': { code: 73, shift: false },
    'j': { code: 74, shift: false },
    'k': { code: 75, shift: false },
    'l': { code: 76, shift: false },
    'm': { code: 77, shift: false },
    'n': { code: 78, shift: false },
    'o': { code: 79, shift: false },
    'p': { code: 80, shift: false },
    'q': { code: 81, shift: false },
    'r': { code: 82, shift: false },
    's': { code: 83, shift: false },
    't': { code: 84, shift: false },
    'u': { code: 85, shift: false },
    'v': { code: 86, shift: false },
    'w': { code: 87, shift: false },
    'x': { code: 88, shift: false },
    'y': { code: 89, shift: false },
    'z': { code: 90, shift: false },
    // Uppercase letters - need shift
    'A': { code: 65, shift: true },
    'B': { code: 66, shift: true },
    'C': { code: 67, shift: true },
    'D': { code: 68, shift: true },
    'E': { code: 69, shift: true },
    'F': { code: 70, shift: true },
    'G': { code: 71, shift: true },
    'H': { code: 72, shift: true },
    'I': { code: 73, shift: true },
    'J': { code: 74, shift: true },
    'K': { code: 75, shift: true },
    'L': { code: 76, shift: true },
    'M': { code: 77, shift: true },
    'N': { code: 78, shift: true },
    'O': { code: 79, shift: true },
    'P': { code: 80, shift: true },
    'Q': { code: 81, shift: true },
    'R': { code: 82, shift: true },
    'S': { code: 83, shift: true },
    'T': { code: 84, shift: true },
    'U': { code: 85, shift: true },
    'V': { code: 86, shift: true },
    'W': { code: 87, shift: true },
    'X': { code: 88, shift: true },
    'Y': { code: 89, shift: true },
    'Z': { code: 90, shift: true },
    // Numbers - no shift
    '0': { code: 48, shift: false },
    '1': { code: 49, shift: false },
    '2': { code: 50, shift: false },
    '3': { code: 51, shift: false },
    '4': { code: 52, shift: false },
    '5': { code: 53, shift: false },
    '6': { code: 54, shift: false },
    '7': { code: 55, shift: false },
    '8': { code: 56, shift: false },
    '9': { code: 57, shift: false },
    // Special characters
    '@': { code: 50, shift: true },   // Shift+2
    '#': { code: 51, shift: true },   // Shift+3
    '$': { code: 52, shift: true },   // Shift+4
    '%': { code: 53, shift: true },   // Shift+5
    '^': { code: 54, shift: true },   // Shift+6
    '&': { code: 55, shift: true },   // Shift+7
    '*': { code: 56, shift: true },   // Shift+8
    '(': { code: 57, shift: true },   // Shift+9
    ')': { code: 48, shift: true },   // Shift+0
    '!': { code: 49, shift: true },   // Shift+1
    '~': { code: 192, shift: true },  // Shift+`
    '`': { code: 192, shift: false }, // `
    '-': { code: 189, shift: false }, // -
    '_': { code: 189, shift: true },  // Shift+-
    '=': { code: 187, shift: false }, // =
    '+': { code: 187, shift: true },  // Shift+=
    '[': { code: 219, shift: false }, // [
    '{': { code: 219, shift: true },  // Shift+[
    ']': { code: 221, shift: false }, // ]
    '}': { code: 221, shift: true },  // Shift+]
    ';': { code: 186, shift: false }, // ;
    ':': { code: 186, shift: true },  // Shift+;
    "'": { code: 222, shift: false }, // '
    '"': { code: 222, shift: true },  // Shift+'
    ',': { code: 188, shift: false }, // ,
    '<': { code: 188, shift: true },  // Shift+,
    '.': { code: 190, shift: false }, // .
    '>': { code: 190, shift: true },  // Shift+.
    '/': { code: 191, shift: false }, // /
    '?': { code: 191, shift: true },  // Shift+/
    '\\': { code: 220, shift: false }, // \
    '|': { code: 220, shift: true },  // Shift+\
    ' ': { code: 32, shift: false },  // space
    '\n': { code: 13, shift: false }, // Enter/Newline
  }

  function showPasswordDialog(): Promise<{ text: string; enterAfter: boolean } | null> {
    return new Promise((resolve) => {
      // Create modal overlay
      const overlay = document.createElement('div')
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999999;
      `

      // Create modal dialog
      const dialog = document.createElement('div')
      dialog.style.cssText = `
        background: white;
        border-radius: 8px;
        padding: 10px;
        width: 90%;
        max-width: 800px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000000;
      `

      dialog.innerHTML = `
        <h2 style="margin: 0 0 15px 0; font-size: 16px; color: #333;">Enter Text</h2>
        <textarea id="passwordInput" style="
          width: 100%;
          height: 150px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: monospace;
          font-size: 13px;
          resize: vertical;
          box-sizing: border-box;
        " placeholder="Enter text here (Ctrl+Enter to submit)"></textarea>
        <div style="margin-top: 15px; display: flex; align-items: center; gap: 8px; margin-bottom: 15px;">
          <input type="checkbox" id="enterCheckbox" checked style="cursor: pointer; width: 16px; height: 16px;" />
          <label for="enterCheckbox" style="cursor: pointer; font-size: 13px; color: #333;">Press Enter after typing</label>
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button id="cancelBtn" style="
            padding: 8px 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #f5f5f5;
            cursor: pointer;
            font-size: 13px;
          ">Cancel</button>
          <button id="submitBtn" style="
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            background: #667eea;
            color: white;
            cursor: pointer;
            font-size: 13px;
          ">Submit</button>
        </div>
      `

      overlay.appendChild(dialog)
      document.body.appendChild(overlay)

      const input = document.getElementById('passwordInput') as HTMLTextAreaElement
      const enterCheckbox = document.getElementById('enterCheckbox') as HTMLInputElement
      const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement
      const cancelBtn = document.getElementById('cancelBtn') as HTMLButtonElement

      const cleanup = () => {
        document.body.removeChild(overlay)
        // Remove the global key capture
        document.removeEventListener('keydown', blockKeyHandler, true)
        document.removeEventListener('keyup', blockKeyHandler, true)
        document.removeEventListener('keypress', blockKeyHandler, true)
      }

      // Block keyboard events from reaching the canvas, but allow textarea to work
      const blockKeyHandler = (e: Event) => {
        const target = e.target as HTMLElement
        // Only block if the target is NOT the textarea or checkbox
        if (!input.contains(target) && target !== input && target !== enterCheckbox) {
          e.preventDefault()
          e.stopPropagation()
          e.stopImmediatePropagation()
        }
      }

      // Add event listeners in capture phase to intercept keyboard events before canvas
      document.addEventListener('keydown', blockKeyHandler, true)
      document.addEventListener('keyup', blockKeyHandler, true)
      document.addEventListener('keypress', blockKeyHandler, true)

      // Focus the input after a tiny delay
      setTimeout(() => {
        input.focus()
      }, 10)

      submitBtn.addEventListener('click', () => {
        const value = input.value
        const shouldEnter = enterCheckbox.checked
        cleanup()
        resolve(value.length > 0 ? { text: value, enterAfter: shouldEnter } : null)
      })

      cancelBtn.addEventListener('click', () => {
        cleanup()
        resolve(null)
      })

      // Allow textarea to still receive keyboard events
      input.addEventListener('keydown', (e) => {
        e.stopPropagation()
        if (e.key === 'Enter' && e.ctrlKey) {
          e.preventDefault()
          const value = input.value
          const shouldEnter = enterCheckbox.checked
          cleanup()
          resolve(value.length > 0 ? { text: value, enterAfter: shouldEnter } : null)
        }
      })

      input.addEventListener('keyup', (e) => {
        e.stopPropagation()
      })

      input.addEventListener('keypress', (e) => {
        e.stopPropagation()
      })
    })
  }

  function typeIntoCanvas(text: string, delayMs: number = 200, enterAfter: boolean = true) {
    const canvas = document.getElementById('noVNC_canvas') as HTMLCanvasElement | null

    if (!canvas) {
      console.error('Canvas not found')
      alert('Error: Could not find VNC canvas')
      return
    }

    canvas.focus()

    let totalDelay = 0
    let shiftIsDown = false

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const delay = i * delayMs
      totalDelay = delay

      setTimeout(() => {
        const mapping = charMap[char]
        const charCode = mapping?.code || char.charCodeAt(0)
        const needsShift = mapping?.shift || false

        // Handle newline specially
        if (char === '\n') {
          // Release shift if needed
          if (shiftIsDown) {
            const shiftUp = new KeyboardEvent('keyup', {
              key: 'Shift',
              keyCode: 16,
              which: 16,
              shiftKey: false,
              bubbles: true,
              cancelable: true,
            })
            canvas.dispatchEvent(shiftUp)
            shiftIsDown = false
          }

          // Send Enter keydown
          setTimeout(() => {
            const enterDown = new KeyboardEvent('keydown', {
              key: 'Enter',
              code: 'Enter',
              keyCode: 13,
              which: 13,
              bubbles: true,
              cancelable: true,
            })
            canvas.dispatchEvent(enterDown)

            setTimeout(() => {
              const enterPress = new KeyboardEvent('keypress', {
                key: 'Enter',
                code: 'Enter',
                charCode: 13,
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true,
              })
              canvas.dispatchEvent(enterPress)
            }, 15)

            setTimeout(() => {
              const enterUp = new KeyboardEvent('keyup', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true,
              })
              canvas.dispatchEvent(enterUp)
            }, 30)
          }, 10)
          return
        }

        // Release shift if it's currently down but this char doesn't need it
        if (shiftIsDown && !needsShift) {
          const shiftUp = new KeyboardEvent('keyup', {
            key: 'Shift',
            keyCode: 16,
            which: 16,
            shiftKey: false,
            bubbles: true,
            cancelable: true,
          })
          canvas.dispatchEvent(shiftUp)
          shiftIsDown = false
          console.log('↑ Released Shift')
        }

        // Press shift if needed and not already down
        if (needsShift && !shiftIsDown) {
          const shiftDown = new KeyboardEvent('keydown', {
            key: 'Shift',
            keyCode: 16,
            which: 16,
            shiftKey: true,
            bubbles: true,
            cancelable: true,
          })
          canvas.dispatchEvent(shiftDown)
          shiftIsDown = true
        }

        // Wait for shift to settle
        setTimeout(() => {
          const keydownEvent = new KeyboardEvent('keydown', {
            key: char,
            keyCode: charCode,
            which: charCode,
            shiftKey: needsShift,
            bubbles: true,
            cancelable: true,
          })
          canvas.dispatchEvent(keydownEvent)

          setTimeout(() => {
            const keypressEvent = new KeyboardEvent('keypress', {
              key: char,
              charCode: char.charCodeAt(0),
              keyCode: charCode,
              which: charCode,
              shiftKey: needsShift,
              bubbles: true,
              cancelable: true,
            })
            canvas.dispatchEvent(keypressEvent)
          }, 15)

          setTimeout(() => {
            const keyupEvent = new KeyboardEvent('keyup', {
              key: char,
              keyCode: charCode,
              which: charCode,
              shiftKey: needsShift,
              bubbles: true,
              cancelable: true,
            })
            canvas.dispatchEvent(keyupEvent)
          }, 30)
        }, needsShift ? 30 : 10)
      }, delay)
    }

    // Make sure shift is released at the end
    setTimeout(() => {
      if (shiftIsDown) {
        const shiftUp = new KeyboardEvent('keyup', {
          key: 'Shift',
          keyCode: 16,
          which: 16,
          shiftKey: false,
          bubbles: true,
          cancelable: true,
        })
        canvas.dispatchEvent(shiftUp)
        shiftIsDown = false
      }

      // Send Enter key if requested
      if (enterAfter) {
        setTimeout(() => {
          const enterDown = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
          })
          canvas.dispatchEvent(enterDown)

          setTimeout(() => {
            const enterPress = new KeyboardEvent('keypress', {
              key: 'Enter',
              code: 'Enter',
              charCode: 13,
              keyCode: 13,
              which: 13,
              bubbles: true,
              cancelable: true,
            })
            canvas.dispatchEvent(enterPress)
          }, 10)

          setTimeout(() => {
            const enterUp = new KeyboardEvent('keyup', {
              key: 'Enter',
              code: 'Enter',
              keyCode: 13,
              which: 13,
              bubbles: true,
              cancelable: true,
            })
            canvas.dispatchEvent(enterUp)
          }, 20)
        }, 50)
      }
    }, totalDelay + delayMs + 50)

  }

  chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: any) => {
    if (request.action === 'PASTE_TEXT') {
      showPasswordDialog().then((result) => {
        if (result !== null && result.text.length > 0) {
          typeIntoCanvas(result.text, 200, result.enterAfter) // 200ms delay per character
        }
      })
    }

    sendResponse({ success: true })
  })
}
