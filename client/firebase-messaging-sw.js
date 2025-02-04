//  import firebase from 'firebase/compat/app'
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "Your key",
    authDomain: "*Your Firebase Porject Id*.firebaseapp.com",
    projectId: "Your Firebase Porject Id",
    storageBucket: "*Your Firebase Porject Id*.appspot.com",
    messagingSenderId: "our message Sender Id",
    appId: "Your Firebase App Id",
    measurementId: "Your measurementId",
    vapidKey: "Your vapidKey"
};


firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    // Customize notification here
    const title = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(title,
        notificationOptions);
});

