const Expo = require("expo-server-sdk");
const _ = require('lodash');
const admin = require("firebase-admin");


exports.sendPush = function(messages) {
    let expo = new Expo();

    // The Expo push notification service accepts batches of notifications so
    // that you don't need to send 1000 requests to send 1000 notifications. We
    // recommend you batch your notifications to reduce the number of requests
    // and to compress them (notifications with similar content will get
    // compressed).
    let chunks = expo.chunkPushNotifications(messages);

    (async() => {
        // Send the chunks to the Expo push notification service. There are
        // different strategies you could use. A simple one is to send one chunk at a
        // time, which nicely spreads the load out over time:
        for (let chunk of chunks) {
            try {
                let receipts = await expo.sendPushNotificationsAsync(chunk);
                console.log(receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();
}

exports.pushFirebase = function(message, tokens) {
    console.log("tokens", tokens);
    // Send a message to the device corresponding to the provided
    // registration token.
    admin.messaging().sendToDevice(tokens, message)
        .then(function(response) {
            // See the MessagingDevicesResponse reference documentation for
            // the contents of response.
            console.log('Successfully sent message:', response);
        })
        .catch(function(error) {
            console.log('Error sending message:', error);
        });
}