importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");


//Using singleton breaks instantiating messaging()
// App firebase = FirebaseWeb.instance.app;

firebase.initializeApp({
  apiKey: "Your key",
  authDomain: "*Your Firebase Porject Id*.firebaseapp.com", 
  projectId: "Your Firebase Porject Id",
  storageBucket: "*Your Firebase Porject Id*.appspot.com",
  messagingSenderId:"Your message Sender Id",
  appId: "Your Firebase App Id",
  measurementId: "Your measurementId",
});

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Optional:
messaging.onBackgroundMessage((message) => {
  console.log("onBackgroundMessage", message);
});
