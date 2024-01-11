// content.js

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "getInputElementName") {
        // Find the input element by class name and send its value to the background script
        const inputElement = document.getElementsByClassName('.');
        const elementName = inputElement ? inputElement.name : null;
        sendResponse({ elementName });
    }
});
