// Initialize context menu items when extension is installed
chrome.runtime.onInstalled.addListener(() => {
    // Create parent menu item
    chrome.contextMenus.create({
      id: 'textcraft-parent',
      title: 'TextCraft AI',
      contexts: ['selection']
    });
    
    // Create transformation submenu items
    const transformations = [
      { id: 'formal', title: 'Make Formal' },
      { id: 'casual', title: 'Make Casual' },
      { id: 'joke', title: 'Add Humor' },
      { id: 'shakespearean', title: 'Shakespearean' },
      { id: 'emoji', title: 'Add Emojis' },
      { id: 'grammar', title: 'Fix Grammar' },
      { id: 'concise', title: 'Make Concise' }
    ];
    
    transformations.forEach(transform => {
      chrome.contextMenus.create({
        id: `textcraft-${transform.id}`,
        parentId: 'textcraft-parent',
        title: transform.title,
        contexts: ['selection']
      });
    });
  });
  
  // Handle context menu clicks
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId.startsWith('textcraft-') && info.menuItemId !== 'textcraft-parent') {
      const transformationType = info.menuItemId.replace('textcraft-', '');
      const selectedText = info.selectionText;
      
      // Send the selected text to the content script for transformation
      chrome.tabs.sendMessage(tab.id, {
        action: 'transformText',
        transformationType,
        text: selectedText
      });
    }
  });
  
  // Listen for messages from popup or content script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getToken') {
      // Get the authentication token from storage
      chrome.storage.local.get(['token'], (result) => {
        sendResponse({ token: result.token || null });
      });
      return true; // Required for async response
    }
    
    if (request.action === 'setToken') {
      // Save the authentication token
      chrome.storage.local.set({ token: request.token }, () => {
        sendResponse({ success: true });
      });
      return true; // Required for async response
    }
    
    if (request.action === 'clearToken') {
      // Clear the authentication token
      chrome.storage.local.remove(['token', 'user'], () => {
        sendResponse({ success: true });
      });
      return true; // Required for async response
    }
  });