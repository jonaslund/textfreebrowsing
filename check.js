// Initialize visibility based on stored state
chrome.runtime.sendMessage({method: "getStatus"}, function(response) {
  if(response && response.status === "on") {
    applyTextHiding();
  } else {
    removeTextHiding();
  }
  
  // Make page visible after checking status
  document.getElementsByTagName('html')[0].style.visibility = 'visible';
  
  // Ensure visibility in case of any issues
  setTimeout(function() {
    document.getElementsByTagName('html')[0].style.visibility = 'visible'; 
  }, 1000);
});

// Function to apply text hiding
function applyTextHiding() {
  var styles = document.getElementById("textfreestylez");
  if (!styles) {
    var css = '* {color: transparent !important;}',
    head = document.getElementsByTagName('head')[0],
    style = document.createElement('style');
    style.setAttribute("id","textfreestylez");

    style.type = 'text/css';
    if(style.styleSheet){
      style.styleSheet.cssText = css;
    } else{
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }
  document.body.classList.add('text-free-browsing-active');
}

// Function to remove text hiding
function removeTextHiding() {
  var styles = document.getElementById("textfreestylez");
  if(styles) {
    styles.parentNode.removeChild(styles);
  }
  document.body.classList.remove('text-free-browsing-active');
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { 
  if (request.method == "start" || request.method == "switchstart") {
    applyTextHiding();
    document.getElementsByTagName('html')[0].style.visibility = 'visible';
  }

  if(request.method == "stop" || request.method == "switchstop") {
    removeTextHiding();
    document.getElementsByTagName('html')[0].style.visibility = 'visible';
  }

  // Also handle the new message format
  if (request.hasOwnProperty('textHidden')) {
    if (request.textHidden) {
      applyTextHiding();
    } else {
      removeTextHiding();
    }
  }
});


