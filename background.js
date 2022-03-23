console.log("Hello from the back!");

const handlePageUpdate = (tabId, changeInfo, tab) => {
  console.log("Tab updated!");
  const orderPage = /^(http:\/\/|https:\/\/)app\.skulabs\.com\/order\?store\_id\=5f2bc4861c9d444a93783768&order\_number\=JCS?[0-9]{7,9}$/gm;

  if (tab.url.match(orderPage) !== null) {
    // url matched; do something here
    chrome.tabs.onUpdated.removeListener(handlePageUpdate);
    let messageReceived = false;

    // executing content script
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['content.js']
    });
    console.log("script executed, waiting for message");

    const sendUpdate = () => {
      if (!messageReceived) {
        console.log("Reactivating onUpdated event!")
        chrome.tabs.onUpdated.addListener(handlePageUpdate);
      }
    }

    chrome.webNavigation.onReferenceFragmentUpdated.addListener(sendUpdate);
    chrome.webNavigation.onHistoryStateUpdated.addListener(sendUpdate);

    // setting up listeners for messages sent from content script after click event
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.popupAlert === "yes") {
        messageReceived = true;
        chrome.webNavigation.onHistoryStateUpdated.removeListener(sendUpdate);
        chrome.webNavigation.onReferenceFragmentUpdated.removeListener(sendUpdate);  
        console.log("message received! Reactivating update listener!");
        chrome.tabs.onUpdated.addListener(handlePageUpdate);
      } else if (request.popupAlert === "no") {
        messageReceived = true;
        chrome.webNavigation.onHistoryStateUpdated.removeListener(sendUpdate);
        chrome.webNavigation.onReferenceFragmentUpdated.removeListener(sendUpdate);
        console.log("no popup activated, running script again");
        chrome.tabs.onUpdated.addListener(handlePageUpdate);
      }
    });
  }
};

// const sendUpdate = (message) => {
//   if (!message) {
//     console.log("Reactivating onUpdated event!")
//     chrome.tabs.onUpdated.addListener(handlePageUpdate);
//   }
// }

chrome.tabs.onUpdated.addListener(handlePageUpdate);

// chrome.webNavigation.onBeforeNavigate.addListener(() => { 
//   console.log("ON BEFORE NAVIGATE - Navigating away from this page!");
// });
// chrome.webNavigation.onCommitted.addListener(() => { 
//   console.log("ON COMMITED - Navigating away from this page!");
// });
// chrome.webNavigation.onCreatedNavigationTarget.addListener(() => { 
//   console.log("CREATED NAV. TARGET - Navigating away from this page!");
// });
// chrome.webNavigation.onDOMContentLoaded.addListener(() => { 
//   console.log("DOM CONTENT LOADED - Navigating away from this page!");
// });
// chrome.webNavigation.onTabReplaced.addListener(() => { 
//   console.log("ON TAB REPLACED - Navigating away from this page!");
// });
