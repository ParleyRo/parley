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

        updateNotification(notification.data.hash,'click');
        
    }

    const action = event.action; // Access the clicked action name

    if (action) {
        // User clicked a custom button
        self.notificationActions[action](notification); // Call the corresponding action function

    } else {
        // User clicked the default close button (optional)

        updateNotification(notification.data.hash,'close');
        
        notification.close(); // Close the notification
    }   

});


self.notificationActions = {

    close: function (notification) {
        // Handle action logic (e.g., open a specific page)

        updateNotification(notification.data.hash,'action-close');

        notification.close(); // Close the notification
    },
    openPage: function (notification) {
        // Handle action logic (e.g., perform an API call)
        const customUri = ['ip',notification?.data?.ip?.replaceAll('.','-') ?? 'n-a','os',notification?.data?.os ?? 'n-a','browser',notification?.data?.browser ?? 'n-a','isMobile',notification?.data?.isMobile?.toString() ?? 'n-a'].join('/');

        clients.openWindow(`https://parley.ro/${customUri}`); // Example: Open your website
        
        updateNotification(notification.data.hash,'action-open');

        notification.close(); // Close the notification
    },
  };


  function updateNotification(hash,type){
    fetch("/updateNotification", {
        method: "POST",
        body: JSON.stringify({
            hash: hash,
            type: type
        }),
        headers: {
            "content-type": "application/json"
        }
    });
  }