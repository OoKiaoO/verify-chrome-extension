console.log("Hello from the back!");

const handleUpdate = (tabId, changeInfo, tab) => {
  console.log("Tab updated!");
  const regex = /^(http:\/\/|https:\/\/)app\.skulabs\.com\/order\?store\_id\=5f2bc4861c9d444a93783768&order\_number\=JCS?[0-9]{7,9}$/gm;

  if (tab.url.match(regex) !== null) {
    // url matched; do something here
    chrome.tabs.onUpdated.removeListener(handleUpdate);
    let messageReceived = false;

    // executing content script
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['content.js']
    });
    console.log("script executed, waiting for message");

    // setting up listeners for messages sent from content script after click event
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.popupAlert === "yes") {
        messageReceived = true;
        console.log("message received! Reactivating update listener!");
        chrome.tabs.onUpdated.addListener(handleUpdate);
      } else if (request.popupAlert === "no") {
        messageReceived = true;
        console.log("no popup activated, running script again");
        chrome.tabs.onUpdated.addListener(handleUpdate);
      }
    });

    chrome.webNavigation.onReferenceFragmentUpdated.addListener(() => { 
      console.log("REF FRAGMENT UPDATED - Navigating away from this page!");
      if (!messageReceived) {
        console.log("Reactivating onUpdated event!")
        chrome.tabs.onUpdated.addListener(handleUpdate);
      }
    });

    chrome.webNavigation.onHistoryStateUpdated.addListener(() => { 
      console.log("HISTORY STATE UPDATED - Navigating away from this page!");
      if (!messageReceived) {
        console.log("Reactivating onUpdated event!")
        chrome.tabs.onUpdated.addListener(handleUpdate);
      }
    });
  }
};

chrome.tabs.onUpdated.addListener(handleUpdate);

// const filter = {
//   url: [
//     {
//       urlMatches: 'https://app.skulabs.com/order?store_id=5f2bc4861c9d444a93783768&order_number=JCS*',
//     },
//   ],
// };

// chrome.webNavigation.onCompleted.addListener(() => {
//   console.log("WEB NAV ON COMPLETED EVENT FIRED WITH FILTER!!");
// }, filter);





// chrome.browserAction.onClicked.addListener(checkVerified);

// function checkVerified(tab) {
//   let msg = {
//     txt: "Hello!"
//   };
//   chrome.tabs.sendMessage(tab.id, msg);
//   // console.log("Verified!!");
// }

// const filter = {
//   url: [
//     {
//       urlMatches: 'https://app.skulabs.com/order?store_id=5f2bc4861c9d444a93783768&order_number=JCS*',
//     },
//   ],
// };

// chrome.webNavigation.onCompleted.addListener(() => {
//   console.log("The user has loaded my favorite website!");
// }, filter);

// chrome.scripting.registerContentScript({
//   matches: ['https://app.skulabs.com/order?store_id=5f2bc4861c9d444a93783768&order_number=JCS*'],
//   run_at: 'document_idle',
//   js: ['content.js']
// });
