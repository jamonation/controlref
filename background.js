"use strict";

// Rewrite the Referer header to ""
// Future releases will allow custom headers
function rewriteReferer(e) {
    var controlRef = browser.storage.sync.get('controlRef');
    return controlRef.then((res) => {
        if (res.controlRef === undefined || res.controlRef.enabled === true) {
            for (var header of e.requestHeaders) {
                if (header.name.toLowerCase() === "referer") {
                    header.value = "";
                }
            }
        }
        return {requestHeaders: e.requestHeaders};                
    });
}


// Add rewriteReferer as a listener to onBeforeSendHeaders
// Make it "blocking" so we can modify the headers.
browser.webRequest.onBeforeSendHeaders.addListener(
    rewriteReferer,
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]
);



// turn sending referer header on or off
function toggleControlRef() {
    var controlRef = browser.storage.sync.get('controlRef');
    controlRef.then((res) => {
        // if icon hasn't been clicked (e.g. new install) or extension is enabled
        // toggle and disable it (results in sending a referer)
        if (res.controlRef === undefined || res.controlRef.enabled === true) {
            browser.browserAction.setIcon({path: "icons/controlref-disabled.svg"});
            browser.storage.sync.set({"controlRef":{"enabled":false}});
            browser.browserAction.setTitle({title: "controlref disabled (sending referer)"});
        } else if (res.controlRef.enabled === false) {
            browser.browserAction.setIcon({path: "icons/controlref.svg"});
            browser.storage.sync.set({"controlRef":{"enabled":true}});
            browser.browserAction.setTitle({title: "controlref enabled (deleting referer)"});
        }
    });
}

browser.browserAction.onClicked.addListener(toggleControlRef);
