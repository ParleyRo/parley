console.log('Service Worker notification Loaded ...');

self.addEventListener('push',function(e){

    const data = e.data.json();

    console.log('Push Recieved ...');
    
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: 'https://gods.skyprivate.local/images/domain/orig/favicon.ico?v=1'
    });
});