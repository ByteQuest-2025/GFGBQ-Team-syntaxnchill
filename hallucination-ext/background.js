// background.js - Background script for Firefox extension

// Listen for installation
browser.runtime.onInstalled.addListener((details) => {
  console.log('AI Hallucination Detector installed:', details.reason);
});

// Listen for messages from popup (for future features)
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  
  // Handle different message types
  if (request.type === 'GET_SELECTED_TEXT') {
    // This could be extended to get text from content script
    sendResponse({ success: true });
  }
  
  return true; // Keep the message channel open for async response
});

// Optional: Context menu integration (right-click to verify)
browser.contextMenus?.create({
  id: 'verify-selection',
  title: 'Verify with Hallucination Detector',
  contexts: ['selection']
});

browser.contextMenus?.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'verify-selection' && info.selectionText) {
    // Store selected text for popup to use
    browser.storage.local.set({ 
      pendingText: info.selectionText,
      timestamp: Date.now()
    });
    
    // Open the popup (Firefox doesn't allow programmatic popup opening,
    // so we notify user or open in new tab)
    console.log('Text selected for verification:', info.selectionText.substring(0, 50) + '...');
  }
});
