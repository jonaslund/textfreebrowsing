var on = 0;
chrome.browserAction.onClicked.addListener(function(tab) {  
  if(on === 0) {

    chrome.browserAction.setIcon({path: 'text-no.png'});
    chrome.browserAction.setTitle({title: "Stop Text Free Browsing"});  
    on = 1;  
    localStorage.setItem("textfree", "on");

    chrome.tabs.getSelected(null,function(tab) {
      chrome.tabs.sendMessage(tab.id,{method:"start"}, function(response){
      });
    }); 

  } else {
    
    on = 0;
    localStorage.setItem("textfree", "off");
    chrome.browserAction.setIcon({path: 'text-yes.png'});
    chrome.browserAction.setTitle({title: "Start Text Free Browsing"});      


    chrome.tabs.getSelected(null,function(tab) {
      chrome.tabs.sendMessage(tab.id,{method:"stop"}, function(response){        
      });
    }); 

  
  }
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getStatus")
      sendResponse({status: localStorage['textfree']});
    else
      sendResponse({}); // snub them.
});


chrome.tabs.onActivated.addListener(function(info) {
  var tabID = info.tabId;
  if(localStorage.getItem("textfree") === "on") {
    chrome.tabs.sendMessage(tabID, {method:"switchstart"}, function(response){
    });

  } else {
    chrome.tabs.sendMessage(tabID, {method:"switchstop"}, function(response){
    });    
  
  }
});

//get all tabs and insert check.js
chrome.tabs.query({}, function(tabs) { 
  for (var i = 0; i < tabs.length; i++) {
    var tabid = tabs[i].id;
    chrome.tabs.executeScript(tabid, {
        file: "check.js"
    });    
  }
});