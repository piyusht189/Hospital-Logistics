// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    apiKey: "AIzaSyCAEGsd7VnalEEnNdVI3rdEaWynQkSwUXs",
    authDomain: "drivecraft-labs.firebaseapp.com",
    databaseURL: "https://drivecraft-labs.firebaseio.com",
    projectId: "drivecraft-labs",
    storageBucket: "drivecraft-labs.appspot.com",
    messagingSenderId: "885290379388",
    appId: "1:885290379388:web:ec33fdc024db931ae981f9",
    measurementId: "G-8R7ZE769Q5"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
