console.log('Service Worker notification Loaded ...');

self.addEventListener('push',function(e){

    const data = e.data.json();

    console.log('Push Recieved ...');
    
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
    });

});