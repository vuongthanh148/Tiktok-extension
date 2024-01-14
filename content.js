// content.js

// Listen for messages from the background script
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     console.log({ request })
//     if (request.action === "getInputElementName") {
//         console.log("DCMM")
//         // Find the input element by class name and send its value to the background script
//         const inputElement = document.getElementsByClassName('form-control text-center font-weight-bold rounded-0 remove-spaces');
//         console.log({ inputElement })
//         const elementName = inputElement ? inputElement.name : null;
//         sendResponse({ elementName });
//     }
// });

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("DCMM")
    if (message.action === "getInputElementName") {
        // Find the input element by class name and send its value to the background script
        const inputElement = document.querySelector(".t-views-menu .form-control");
        console.log({ inputElement })
        const elementName = inputElement ? inputElement.name : null;
        sendResponse({ elementName });
    }
});