const db = require('../../libraries/database.js');
const Tracer = require('tracer').colorConsole();
const webpush = require('web-push');
const common = require('../../helpers/Common.js');
const database = require('../../libraries/database.js');


const vapidKeys = {
	publicKey: 'BBgcwAZurSm_Gusak9ENTRW1iGvFqYj8eq5XNPDJkoWJ7GccgPNm76BuDDFgaVzUKKzl6Hqs6YixodQD-WitjSk',
	privateKey: 'fItZ6HGMiFEw2uglMGwTUYCholqHSVF8y4VV9KQg9Uc'
}
webpush.setVapidDetails(
	'mailto:cristian.pirloaga@gmail.com',
	vapidKeys.publicKey,
	vapidKeys.privateKey
);

class Notification {

	static FLAG_SENT_SUCCESS = 1;
	static FLAG_SENT_FAIL = 2;
	static FLAG_CLICK = 4;
	static FLAG_CLOSE = 8;
	static FLAG_ACTION_CLOSE = 16;
	static FLAG_ACTION_OPENPAGE = 32;

	static sendPushNotification(subscriptionData, notificationData) {

        const subscription = {
            endpoint: subscriptionData.endpoint,
            keys: {
              auth: subscriptionData.auth,
              p256dh: subscriptionData.p256dh
            }
        }

        const customData = {...JSON.parse(subscriptionData.details), ip: subscriptionData.ip, time: subscriptionData.time};
        
        const hash = common.md5Hash(JSON.stringify(customData));

        customData['hash'] = hash;

        db.insert('notificationsEvents',{
            hash,
            details: JSON.stringify(customData),
            data: JSON.stringify(notificationData),
            flags: 0
        });

        notificationData['customData'] = {...customData};

		webpush.sendNotification(subscription, JSON.stringify(notificationData))
			.then(() => {
                db.update('notificationsEvents',{flags: Notification.FLAG_SENT_SUCCESS},{hash});

                Tracer.info(`Push notification sent successfully to IP: ${subscriptionData.ip}`);
            })
			.catch(error => {
                
                db.update('notificationsEvents',{flags: Notification.FLAG_SENT_FAIL},{hash});

                if(error.statusCode === 410){
                    
                    db.delete('subscribtionNotifications',{id: subscriptionData.id});
                    
                    Tracer.warn(`Error sending push notification: Subscrition ID: ${subscriptionData.id} deleted !!!`);

                    return;
                }

                Tracer.error('Error sending push notification:', error);
            });
	}

}

module.exports = Notification; 