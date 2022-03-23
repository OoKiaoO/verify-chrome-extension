
(() => {
  console.log("CHROME EXT. GO!");

  const activatePopup = (e) => {
    console.log("content script initiated!");

    const checkForJS_Finish = () =>{
      const [ shipButton ] = document.querySelectorAll("button.btn.add-label");
      const orderStatus = document.getElementById('info_status').firstChild;

      if (shipButton && orderStatus) {
        clearInterval(jsInitCheckTimer);
        console.log("WE MADE IT!");
      
        const handleClickAlert = () => {
          if (orderStatus.innerHTML === "Opened"
            || orderStatus.innerHTML === "Not Started"
            || orderStatus.innerHTML === "Partially cleared")
            {
              alert("Some items in this order are not verified!"); // Send POPUP alert on screen
              chrome.runtime.sendMessage({popupAlert: "yes"}); // Send message to backround to reactivate page update listener
              // shipButton.addEventListener("click", handleClickAlert); // keep listening for click events on Ship button

              // ** Uncaught Error in promise: once click event has fired once, if page is not updated and it will fire again, 
              // background is not waiting for a new message but a new message is sent from content script on new click ev.
              // TODO: create general loop with message receiving listener to catch lost messages & avoid errors.
          } else {
            chrome.runtime.sendMessage({popupAlert: "no"});
          }
        }
        shipButton.addEventListener("click", handleClickAlert);
      }
    }
    const jsInitCheckTimer = setInterval(checkForJS_Finish, 1000);
  }

  activatePopup();;
}) ();
