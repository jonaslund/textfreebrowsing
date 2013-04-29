var textfree = localStorage.getItem('textfree');

chrome.extension.sendMessage({method: "getStatus"}, function(response) {
  if(response.status === "on") {

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
    document.getElementsByTagName('html')[0].style.visibility = 'visible';

  } else {  
    document.getElementsByTagName('html')[0].style.visibility = 'visible';
  }
  
  //catch annoying weirdo html repaint issues and what not
  setTimeout(function() {
   document.getElementsByTagName('html')[0].style.visibility = 'visible'; 
  }, 1000);

  setTimeout(function() {
   document.getElementsByTagName('html')[0].style.visibility = 'visible'; 
  }, 2000);

  setTimeout(function() {
   document.getElementsByTagName('html')[0].style.visibility = 'visible'; 
  }, 3000);

});


chrome.extension.onMessage.addListener(function(request, sender, sendResponse) { 
  var styles = document.getElementById("textfreestylez"),
      css = '* {color: transparent !important;}',
      head = document.getElementsByTagName('head')[0],
      style = document.createElement('style');  
      style.setAttribute("id","textfreestylez");
      style.type = 'text/css';

      if(style.styleSheet){
        style.styleSheet.cssText = css;
      } else{
        style.appendChild(document.createTextNode(css));
      }

  if (request.method == "start") {
    head.appendChild(style);    
    document.getElementsByTagName('html')[0].style.visibility = 'visible';
  }

  if(request.method == "stop") {    
    if(styles) {      
      styles.parentNode.removeChild(styles);
    }  
    document.getElementsByTagName('html')[0].style.visibility = 'visible';
  }


  if(request.method == "switchstart") {    
    if(!styles) {
      head.appendChild(style);     
    }
    document.getElementsByTagName('html')[0].style.visibility = 'visible';     
  }

  if(request.method == "switchstop") {    
    
    if(styles) {
      styles.parentNode.removeChild(styles);
    }  

  }

});


