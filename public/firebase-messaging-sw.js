importScripts('https://www.gstatic.com/firebasejs/5.3.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.3.0/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '182145913801'
  });


const messaging = firebase.messaging();
var config = {
	apiKey: "AIzaSyCLjvInkTICWVDqRKx7HcGztQD--pI0mEE",
	authDomain: "leftright-2e5de.firebaseapp.com",
	databaseURL: "https://leftright-2e5de.firebaseio.com",
	projectId: "leftright-2e5de",
	storageBucket: "leftright-2e5de.appspot.com",
	messagingSenderId: "371521623116"
};

firebase.initializeApp(config);