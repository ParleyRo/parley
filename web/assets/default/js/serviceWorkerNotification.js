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
        badge: data.badge,
        image: data.image,
        urgency: data.urgency, 
        requireInteraction: data.requireInteraction, 
        persistent: data.persistent, 
        tag: data.tag,
    });

});