// background.js

let initialInterval = 5 * 1000; // Initial interval (30 seconds)

async function fetchCookieAndElementData() {
    const { start } = await chrome.storage.local.get(['start']);
    console.log({ start })
    if (start === 'on') {
        // Fetch cookie and element data when the extension is turned on
        chrome.cookies.getAll({ url: "https://zefoy.com" }, function (cookie) {
            if (cookie) {
                const cookieValue = cookie.map(c => `${c.name}=${c.value}`).join('; ');
                console.log("Cookie value:", cookieValue);
                chrome.storage.local.set({
                    'cookieValue': cookieValue
                })

                chrome.tabs.query({ active: true, url: '*://zefoy.com/*' }, function (tabs) {
                    console.log({ tabs })
                    if (!tabs.length)
                        chrome.storage.local.set({ 'issue': "No tab found" })
                    else {
                        sendMessageFn(tabs[0])
                    }
                });

            } else {
                console.error("Cookie not found");
            }
        });
    } else {
        console.log("Extension is turned off. Skipping fetch.");
        setTimeout(fetchCookieAndElementData, initialInterval);
    }
}

function sendMessageFn(tab) {
    console.log("Sending message ")
    chrome.tabs.sendMessage(tab.id, { action: "getInputElementName" }, function (response) {

        console.log("Get input name res:", response)
        if (chrome.runtime.lastError || !response) {
            setTimeout(() => sendMessageFn(tab), 2000);
        } else {
            const elementName = response.elementName;
            console.log("Input element name:", elementName);

            // Example: Send API request
            sendApiRequest(elementName);
        }
    })
}

function sendApiRequest(elementName) {
    const { cookieValue } = chrome.storage.local.get(['cookieValue']);
    const { videoUrl } = chrome.storage.local.get(['videoUrl']);
    // Replace with your actual API endpoint and payload
    const apiUrl = "https://zefoy.com/c2VuZC9mb2xeb3dlcnNfdGlrdG9V";
    const apiRequestHeaders = {
        "Cookie": cookieValue,
        "Content-Type": "application/json"
    };
    const formDataSearch = new FormData()
    formDataSearch.append(elementName, videoUrl)

    fetch(apiUrl, {
        method: "POST",
        headers: apiRequestHeaders,
        data: formDataSearch
    })
        .then(res => {
            console.log("res", res.toString());
            return res
        })
        .then(data => {
            console.log("API response:", data);
            if (!data) {
                //Recall everything
                // chrome.storage.local.set({
                //     'cookieValue': cookieValue
                // })
            }
            fetch("https://zefoy.com/c2VuZC9mb2xeb3dlcnNfdGlrdG9V", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryXiZFeen7XxLAIQrP",
                    "sec-ch-ua": "\"Microsoft Edge\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest",
                    "cookie": "user_agent=Mozilla%2F5.0%20(Macintosh%3B%20Intel%20Mac%20OS%20X%2010_15_7)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F119.0.0.0%20Safari%2F537.36%20Edg%2F119.0.0.0; _ga=GA1.1.1486732881.1703949452; PHPSESSID=cev58q9vm9njii33ff2sud6l54; cf_clearance=ymMZExWxmpaGBkU4ehQ5tiyaD9YzFGVkg38GW3hXb40-1705079154-0-2-3c516901.6c35aef4.4d02a7fe-160.0.0; __gads=ID=b6000f230ca97592:T=1704625329:RT=1705134707:S=ALNI_MbybQcSJQfe7bKVB6LT2N0Ipb-Pqg; __gpi=UID=00000cd31f023b50:T=1704625329:RT=1705134707:S=ALNI_MYg826ZCCQhsBu5lUR22Rkv4hjXLQ; window_size=897x713; _ga_1WEXNS5FFP=GS1.1.1705173168.24.1.1705174906.0.0.0"
                },
                "referrerPolicy": "no-referrer",
                "body": "------WebKitFormBoundaryXiZFeen7XxLAIQrP\r\nContent-Disposition: form-data; name=\"6b6de6ebaa887\"\r\n\r\nhttps://www.tiktok.com/@dodonghoaianhcaocap/video/7322322377805663496?is_from_webapp=1&sender_device=pc&web_id=7323485327867184641\r\n------WebKitFormBoundaryXiZFeen7XxLAIQrP--\r\n",
                "method": "POST"
            });
            // Transform API response
            // const transformedData = transformApiResponse(data);
            // console.log({ transformedData })
            // console.log("Transformed API response:", transformedData);
            // if (transformedData.includes('ltm')) {
            //     const timeLeft = /(?<=ltm:)[^\;]*/.exec(transformedData)
            //     //Recursion call with time left

            //     // Set up the next periodic task with the adjusted interval
            //     setTimeout(fetchCookieAndElementData, timeLeft * 1000);
            // }
            // else {
            //     const name = getFieldPattern('name').exec(transformedData)
            //     const value = getFieldPattern('value').exec(transformedData)
            //     const formBuffData = new FormData().append(name, value)

            //     fetch(apiUrl, {
            //         method: "POST",
            //         headers: apiRequestHeaders,
            //         data: formBuffData
            //     }).then(() => {

            //         setTimeout(sendApiRequest, 150 * 1000);
            //     })
            // }
        })
        .catch(error => {
            console.error("API request failed:", error);

            // If there's an error, set up the next periodic task with the initial interval
            setTimeout(fetchCookieAndElementData, initialInterval);
        });
}

function transformApiResponse(apiResponse) {
    var decodedResponse = decodeURIComponent(revStr(response));
    var decodedResponseBase64 = atob(decodedResponse);
    console.log(decodedResponseBase64)
    return decodedResponseBase64
}

function getFieldPattern(field) {
    return new RegExp(`(?<=${field}=\")[^\"]*`);
}

function revStr(str) {
    return str.split('').reverse().join('');
}
// Run the function initially
fetchCookieAndElementData();
