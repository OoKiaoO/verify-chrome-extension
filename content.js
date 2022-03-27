
(() => {
  console.log("CHROME EXT. GO!");

  const activatePopup = () => {
    console.log("content script initiated!");

    const checkForJS_Finish = () =>{
      const [ shipButton ] = document.querySelectorAll("button.btn.add-label");
      const orderStatus = document.getElementById("info_status").firstChild;
      const itemsList = document.querySelectorAll("span.unscanned-quantity");

      if (shipButton && orderStatus) {
        clearInterval(jsInitCheckTimer);
        console.log("WE MADE IT!");

        // highlighting background of unscanned items on In progress orders
        const unscannedItems = document.querySelectorAll("div.bg-warning.barcode-quantity-container");
        console.log("unscannedItems", unscannedItems);
        if (orderStatus.innerHTML === "In progress" || orderStatus.innerHTML === "Opened") {
          unscannedItems.forEach((item) => {
            item.classList.remove("bg-warning");
            item.style.backgroundColor = "yellow";
            item.classList.add("highlited-items");
          })
        }

        // extracting array of order items and calculating sum of unscanned items
        const remainingItemsArray = [...itemsList].map((item) => parseInt(item.innerHTML));
        const remainingItemsCount = remainingItemsArray.reduce((a, b) => a + b);

        // event listener activating popup alerts on ship button click event
        const handleClickAlert = () => {
          if (orderStatus.innerHTML === "In progress" && remainingItemsCount) {
            alert("Some items in this order are not verified!");    
          } else if (orderStatus.innerHTML === "In progress" && !remainingItemsCount) {
            const highlitedItems = document.getElementsByClassName("highlited-items");
            if (highlitedItems.length < 1) {
              return
            } else {
              highlitedItems.forEach((item) => item.style.backgroundColor = "#FFFFFF" );
            }
          } else if(orderStatus.innerHTML === "Opened"
          || orderStatus.innerHTML === "Not Started"
          || orderStatus.innerHTML === "Partially cleared") {
            alert("Some items in this order are not verified!");
            chrome.runtime.sendMessage({popupAlert: "yes"}); // Send message to backround to reactivate page update listener
            // TODO: create loop with message receiving listener to catch lost messages & avoid console errors.
          } else {
            chrome.runtime.sendMessage({popupAlert: "no"});
          }
        }

        shipButton.addEventListener("click", handleClickAlert);
      }
    }
    const jsInitCheckTimer = setInterval(checkForJS_Finish, 1000);
  }

  activatePopup();
}) ();
