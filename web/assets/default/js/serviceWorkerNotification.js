console.log('Service Worker notification Loaded ...');

self.addEventListener('push',function(event){

    const data = event.data.json();
    console.log('Push Recieved ...');

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon,
            badge: data.badge,
            image: data.image,
            urgency: data.urgency, 
            requireInteraction: data.requireInteraction, 
            persistent: data.persistent, 
            tag: data.tag,
            dir: data.dir,
            data: data.customData,
            actions: [
                { action: 'close', title: 'Close' },
                { action: 'openPage', title: 'Open a page' },
            ],
        })
    )

});

self.addEventListener('notificationclick', (event) => {

    const notification = event.notification;
    const tag = notification.tag; 
    
    console.log(event);
    
    if(notification?.data?.hash){

        fetch("/updateNotification", {
            method: "POST",
            body: JSON.stringify({
                hash: notification.data.hash,
                type: 'click'
            }),
            headers: {
                "content-type": "application/json"
            }
        });
    }

    const action = event.action; // Access the clicked action name

    if (action) {
        // User clicked a custom button
        self.notificationActions[action](notification); // Call the corresponding action function
        
    } else {
        // User clicked the default close button (optional)
        fetch("/updateNotification", {
            method: "POST",
            body: JSON.stringify({
                hash: notification.data.hash,
                type: 'close'
            }),
            headers: {
                "content-type": "application/json"
            }
        });
        
        notification.close(); // Close the notification
    }   

});


self.notificationActions = {

    close: function (notification) {
        // Handle action logic (e.g., open a specific page)

        fetch("/updateNotification", {
            method: "POST",
            body: JSON.stringify({
                hash: notification.data.hash,
                type: 'action-close'
            }),
            headers: {
                "content-type": "application/json"
            }
        });

        notification.close(); // Close the notification
    },
    openPage: function (notification) {
        // Handle action logic (e.g., perform an API call)
        const customUri = ['ip',notification?.data?.ip?.replaceAll('.','-') ?? 'n-a','os',notification?.data?.os ?? 'n-a','browser',notification?.data?.browser ?? 'n-a','isMobile',notification?.data?.isMobile?.toString() ?? 'n-a'].join('/');

        clients.openWindow(`https://parley.ro/${customUri}`); // Example: Open your website
        
        fetch("/updateNotification", {
            method: "POST",
            body: JSON.stringify({
                hash: notification.data.hash,
                type: 'action-open'
            }),
            headers: {
                "content-type": "application/json"
            }
        });

        notification.close(); // Close the notification
    },
  };