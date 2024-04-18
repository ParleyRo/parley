const publicVapidKey = 'BBgcwAZurSm_Gusak9ENTRW1iGvFqYj8eq5XNPDJkoWJ7GccgPNm76BuDDFgaVzUKKzl6Hqs6YixodQD-WitjSk';

// Check for service worker
if ("serviceWorker" in navigator) {
    send().catch(err => console.error(err));
}

async function send() {
    
    // Register Service Worker
    console.log("Registering service worker...");
    const register = await navigator.serviceWorker.register("/assets/default/js/serviceWorkerNotification.js", {
        scope: "/assets/default/js/"
    });
    console.log("Service Worker Registered...");

    // Register Push
    console.log("Registering Push...");
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    console.log("Push Registered...");

    const browser = getBrowserInfo();
    const os = getOsInfo();
    // Send Push Notification
    console.log("Sending Push...");
    await fetch("/subscribeNotification", {
        method: "POST",
        body: JSON.stringify({
            subscription: subscription,
            details: {
                browser: browser,
                os: os
            },
            navigator: JSON.stringify({
                userAgent: navigator.userAgent,
                platform: (navigator.userAgentData?.platform ?? navigator.platform)
            })
        }),
        headers: {
        "content-type": "application/json"
        }
    });
    console.log("Push Sent...");
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

function getBrowserInfo() {

    const userAgent = navigator.userAgent;

    if (userAgent.includes("Chrome")) {
        return 'chrome';
    } else if (userAgent.includes("Firefox")) {
        return 'firefox';
    } else if (userAgent.includes("Safari")) {
        return 'safari';
    } else if (userAgent.includes("Opera")) {
        return 'opera';
    } else {
        return 'unknown';
    }
}

function getOsInfo() {
    // if a browser has no support for navigator.userAgentData.platform use platform as fallback
    const userAgent = (navigator.userAgentData?.platform ?? navigator.platform).toLowerCase();

    if (userAgent.includes('win')) {
        return 'windows';
    } else if (userAgent.includes('android')) {
        return 'android';
    } else if (userAgent.includes('mac')) {
        return 'mac';
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
        return 'ios';
    } else if (userAgent.includes('linux')) {
        return 'linux';
    }
    return 'unknown';
}