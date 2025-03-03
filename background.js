// State to track if text is currently hidden
let isTextHidden = true;

// Function to toggle text visibility state
function toggleTextVisibility() {
  isTextHidden = !isTextHidden;
  
  // Store the current state
  chrome.storage.local.set({ "textfree": isTextHidden ? "on" : "off" });
  
  // Update the extension icon based on current state
  chrome.action.setIcon({
    path: isTextHidden ? "text-no.png" : "text-yes.png"
  });
  
  // Send message to all tabs to update text visibility
  chrome.tabs.query({}, function(tabs) {
    for (let tab of tabs) {
      chrome.tabs.sendMessage(tab.id, { method: isTextHidden ? "start" : "stop" });
    }
  });
}

// Listen for clicks on the extension icon
chrome.action.onClicked.addListener(function(tab) {
  toggleTextVisibility();
});

// Initialize extension state when the service worker starts
chrome.runtime.onInstalled.addListener(function() {
  // Check if we have a saved state
  chrome.storage.local.get("textfree", function(result) {
    if (result.textfree === "on") {
      isTextHidden = true;
    } else if (result.textfree === "off") {
      isTextHidden = false;
    }
    
    // Set initial icon
    chrome.action.setIcon({
      path: isTextHidden ? "text-no.png" : "text-yes.png"
    });
  });
});

// Replace chrome.extension.onMessage with chrome.runtime.onMessage
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getStatus") {
      chrome.storage.local.get("textfree", function(result) {
        sendResponse({status: result.textfree});
      });
      return true; // Required for asynchronous sendResponse
    }
});

// Handle tab activation
chrome.tabs.onActivated.addListener(function(info) {
  var tabID = info.tabId;
  chrome.storage.local.get("textfree", function(result) {
    if(result.textfree === "on") {
      chrome.tabs.sendMessage(tabID, {method:"switchstart"});
    } else {
      chrome.tabs.sendMessage(tabID, {method:"switchstop"});
    }
  });
});

// The executeScript method has changed in MV3
// We can't inject scripts into all tabs on startup like this anymore
// Instead, we rely on the content scripts defined in the manifest