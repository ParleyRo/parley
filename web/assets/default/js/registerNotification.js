const publicVapidKey = 'BBgcwAZurSm_Gusak9ENTRW1iGvFqYj8eq5XNPDJkoWJ7GccgPNm76BuDDFgaVzUKKzl6Hqs6YixodQD-WitjSk';

// Check for service worker
if ("serviceWorker" in navigator) {
    saveData();
    send().catch(err => console.error(err));
}

async function saveData() {

    const browser = getBrowserInfo();
    const os = getOsInfo();
    const isMobileDevice = isMobile();

    await fetch("/saveData", {
        method: "POST",
        body: JSON.stringify({
            details: {
                browser: browser,
                os: os,
                isMobile: isMobileDevice
            },
            navigator: JSON.stringify({
                userAgent: navigator.userAgent,
                platform: (navigator.userAgentData?.platform ?? navigator.platform),
                isMobile: isMobileDevice
            })
        }),
        headers: {
        "content-type": "application/json"
        }
    });
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
    const isMobileDevice = isMobile();

    // Send Push Notification
    console.log("Sending Push...");
    await fetch("/subscribeNotification", {
        method: "POST",
        body: JSON.stringify({
            subscription: subscription,
            details: {
                browser: browser,
                os: os,
                isMobile: isMobileDevice
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

// function isMobile() {

//     return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false;

// }

function isMobile() {
    const userAgent = navigator.userAgent;
    const isAndroid = /Android/i.test(userAgent);
    const isIOS = /iPad|Tablet/i.test(userAgent); // Adjust for iPad/Tablet detection
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallViewport = window.innerWidth <= 768; // Example viewport size check
  
    return (isAndroid || isIOS || isTouchDevice) && (isSmallViewport || // Mobile check
            window.innerWidth <= 1024); // Optional tablet check based on width
  }

function getBrowserInfo() {

    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes("edg")) {
        return 'edge';
    } else if (userAgent.includes("msie") || userAgent.includes("trident/")){
        return 'ie';
    } else if (userAgent.includes("chrome")) {
        return 'chrome';
    } else if (userAgent.includes("firefox")) {
        return 'firefox';
    } else if (userAgent.includes("safari")) {
        return 'safari';
    } else if (userAgent.includes("opera")) {
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