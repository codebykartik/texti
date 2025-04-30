// Create and insert the transformation overlay
function createOverlay(originalText, transformedText) {
    // Remove any existing overlays
    removeOverlay();
    
    // Create overlay container
    const overlay = document.createElement('div');
    overlay.id = 'textcraft-overlay';
    overlay.className = 'textcraft-overlay';
    
    // Create overlay content
    overlay.innerHTML = `
      <div class="textcraft-overlay-header">
        <div class="textcraft-logo">
          <span class="textcraft-icon">✨</span>
          <span class="textcraft-title">TextCraft AI</span>
        </div>
        <button class="textcraft-close-btn">×</button>
      </div>
      <div class="textcraft-overlay-content">
        <div class="textcraft-text-container">
          <div class="textcraft-text-label">Original Text:</div>
          <div class="textcraft-text textcraft-original">${escapeHtml(originalText)}</div>
        </div>
        <div class="textcraft-text-container">
          <div class="textcraft-text-label">Transformed Text:</div>
          <div class="textcraft-text textcraft-transformed">${escapeHtml(transformedText)}</div>
        </div>
        <div class="textcraft-actions">
          <button class="textcraft-btn textcraft-copy-btn">Copy to Clipboard</button>
          <button class="textcraft-btn textcraft-replace-btn">Replace Original</button>
        </div>
      </div>
    `;
    
    // Add overlay to the page
    document.body.appendChild(overlay);
    
    // Add event listeners
    overlay.querySelector('.textcraft-close-btn').addEventListener('click', removeOverlay);
    overlay.querySelector('.textcraft-copy-btn').addEventListener('click', () => {
      navigator.clipboard.writeText(transformedText).then(() => {
        alert('Copied to clipboard!');
      });
    });
    
    overlay.querySelector('.textcraft-replace-btn').addEventListener('click', () => {
      replaceSelectedText(transformedText);
      removeOverlay();
    });
    
    // Prevent clicks inside the overlay from closing it
    overlay.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    
    // Click outside to close
    document.addEventListener('click', handleOutsideClick);
  }
  
  // Handle click outside overlay
  function handleOutsideClick(e) {
    const overlay = document.getElementById('textcraft-overlay');
    if (overlay && !overlay.contains(e.target)) {
      removeOverlay();
    }
  }
  
  // Remove the overlay
  function removeOverlay() {
    const overlay = document.getElementById('textcraft-overlay');
    if (overlay) {
      overlay.remove();
      document.removeEventListener('click', handleOutsideClick);
    }
  }
  
  // Replace the selected text with transformed text
  function replaceSelectedText(newText) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(newText));
    }
  }
  
  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // Transform text using the API
  async function transformText(text, type) {
    try {
      // Get token from storage
      const tokenResponse = await chrome.runtime.sendMessage({ action: 'getToken' });
      const token = tokenResponse.token;
      
      if (!token) {
        alert('Please log in to TextCraft AI in the extension popup');
        return;
      }
      
      // Show loading overlay
      createOverlay(text, 'Transforming text...');
      
      // API endpoint (could be fetched from storage or hardcoded)
      const apiUrl = 'http://localhost:5000/api/transform/text';
      
      // Send transformation request
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: text,
          type: type,
          audience: 'general'
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Show result in overlay
      createOverlay(text, data.data.transformedText);
    } catch (error) {
      console.error('TextCraft AI transformation error:', error);
      
      // For demo purposes, generate a mock transformation
      let transformedText = '';
      
      switch (type) {
        case 'formal':
          transformedText = text
            .replace(/can't/gi, 'cannot')
            .replace(/won't/gi, 'will not')
            .replace(/hey/gi, 'Hello')
            .replace(/boss/gi, 'Sir/Madam')
            .replace(/lol/gi, '')
            .replace(/hi/gi, 'Hello');
          break;
        case 'casual':
          transformedText = text
            .replace(/Hello/gi, 'Hey')
            .replace(/Good morning/gi, 'Morning')
            .replace(/I regret to inform you/gi, "Just letting you know");
          break;
        case 'joke':
          transformedText = text + " 😂 (Imagine a funny version here)";
          break;
        case 'shakespearean':
          transformedText = "Hark! " + text + " (but in a more Shakespeare-y way, forsooth!)";
          break;
        case 'emoji':
          transformedText = text + " 👍 ✨ 🙌";
          break;
        case 'grammar':
          transformedText = text
            .replace(/cant/g, "can't")
            .replace(/wont/g, "won't")
            .replace(/im/g, "I'm");
          break;
        case 'concise':
          transformedText = text
            .replace(/due to the fact that/gi, "because")
            .replace(/in order to/gi, "to");
          break;
        default:
          transformedText = text;
      }
      
      createOverlay(text, transformedText);
    }
  }
  
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'transformText') {
      transformText(request.text, request.transformationType);
      sendResponse({ success: true });
    }
  });