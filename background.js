// background.js

let initialInterval = 30 * 1000; // Initial interval (30 seconds)

function fetchCookieAndElementData() {
    const extensionStatus = localStorage.getItem('start');

    if (extensionStatus === 'on') {
        // Fetch cookie and element data when the extension is turned on
        chrome.cookies.getAll({ url: "https://zefoy.com" }, function (cookie) {
            if (cookie) {
                const cookieValue = cookie.value;
                console.log("Cookie value:", cookieValue);

                // Fetch name of input element
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    const activeTab = tabs[0];
                    chrome.tabs.sendMessage(activeTab.id, { action: "getInputElementName" }, function (response) {
                        if (response && response.elementName) {
                            const elementName = response.elementName;
                            console.log("Input element name:", elementName);

                            // Example: Send API request
                            sendApiRequest(cookieValue, elementName);
                        } else {
                            console.error("Failed to get input element name");
                        }
                    });
                });
            } else {
                console.error("Cookie not found");
            }
        });
    } else {
        console.log("Extension is turned off. Skipping fetch.");
    }
}

function sendApiRequest(cookieValue, elementName) {
    // Replace with your actual API endpoint and payload
    const apiUrl = "https://api.example.com/endpoint";
    const apiRequestHeaders = {
        "Authorization": "Bearer " + cookieValue,
        "Content-Type": "application/json"
    };

    const apiPayload = {
        cookie: cookieValue,
        elementName: elementName
        // Add any additional data to be sent in the API request payload
    };

    fetch(apiUrl, {
        method: "POST",
        headers: apiRequestHeaders,
        body: JSON.stringify(apiPayload)
    })
        .then(response => response.json())
        .then(data => {
            console.log("API response:", data);

            // Transform API response
            const transformedData = transformApiResponse(data);
            console.log("Transformed API response:", transformedData);

            // Adjust the interval based on the response
            const newInterval = transformedData && transformedData.interval ? transformedData.interval : initialInterval;

            // Set up the next periodic task with the adjusted interval
            setTimeout(fetchCookieAndElementData, newInterval);
        })
        .catch(error => {
            console.error("API request failed:", error);

            // If there's an error, set up the next periodic task with the initial interval
            setTimeout(fetchCookieAndElementData, initialInterval);
        });
}

function transformApiResponse(apiResponse) {
    // Replace this with your actual transformation logic
    // Example: Extract a specific value from the response
    const transformedValue = apiResponse.result && apiResponse.result.value;
    return transformedValue;
}

function readResponse(response) {
    var decodedResponse = decodeURIComponent(revStr(response));
    var decodedResponseBase64 = atob(decodedResponse);
    console.log(decodedResponseBase64)
    return decodedResponseBase64
}

function revStr(str) {
    return str.split('').reverse().join('');
}
// Run the function initially
fetchCookieAndElementData();
