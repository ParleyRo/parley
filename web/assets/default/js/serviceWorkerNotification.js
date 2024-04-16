console.log('Service Worker notification Loaded ...');

self.addEventListener('push',async function(e){

    const data = e.data.json();

    console.log('Push Recieved ...');
    
    const sent = await self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon,
        image: data.image,
        urgency: 'very-high', // Set priority to high,
        requireInteraction: true // Set requireInteraction to true
    });

    console.log(sent);
});