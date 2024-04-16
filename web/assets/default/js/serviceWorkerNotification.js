console.log('Service Worker notification Loaded ...');

self.addEventListener('push',function(e){

    const data = e.data.json();

    console.log('Push Recieved ...');

    // const a = {
    //     body: e.content,
    //     icon: e.icon,
    //     image: e.image,
    //     data: e,
    //     actions: e.buttons,
    //     tag: r.tag,
    //     requireInteraction: r.persistNotification,
    //     renotify: !0,
    //     badge: e.badge,
    //     vibrate: e.vibrate
    // };
    
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon,
        image: data.image,
        urgency: 'very-high', // Set priority to high,
        requireInteraction: false, // Set requireInteraction to true
        renotify: data.tag ? true : false,
        tag: data.tag,
    });

});