
const db = require('../../libraries/database.js');
const webpush = require('web-push');

const vapidKeys = {
	publicKey: 'BBgcwAZurSm_Gusak9ENTRW1iGvFqYj8eq5XNPDJkoWJ7GccgPNm76BuDDFgaVzUKKzl6Hqs6YixodQD-WitjSk',
	privateKey: 'fItZ6HGMiFEw2uglMGwTUYCholqHSVF8y4VV9KQg9Uc'
}
webpush.setVapidDetails(
	'mailto:cristian.pirloaga@gmail.com',
	vapidKeys.publicKey,
	vapidKeys.privateKey
);

class Home {
	
	static sendPushNotification(subscriptionData, dataToSend) {

        const subscription = {
            endpoint: subscriptionData.endpoint,
            keys: {
              auth: subscriptionData.auth,
              p256dh: subscriptionData.p256dh
            }
        }

		webpush.sendNotification(subscription, JSON.stringify(dataToSend))
			.then(() => console.log(`Push notification sent successfully to IP: ${subscriptionData.ip}`))
			.catch(error => {
                console.log(subscriptionData);
                if(error.statusCode === 410){
                    
                    db.delete('subscribtionNotifications',{id: subscriptionData.id});
                    
                    console.error(`Error sending push notification: Subscrition ID: ${subscriptionData.id} deleted !!!`);

                    return;
                }

                console.error('Error sending push notification:', error)
            });
	}

}

module.exports = Home; 