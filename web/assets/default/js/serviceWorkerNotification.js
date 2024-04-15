console.log('Service Worker notification Loaded ...');

self.addEventListener('push',function(e){

    const data = e.data.json();

    console.log('Push Recieved ...');
    
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon,
        image: data.image,
        urgency: 'verry-high', // Set priority to high,
        requireInteraction: false // Set requireInteraction to true
    });
});