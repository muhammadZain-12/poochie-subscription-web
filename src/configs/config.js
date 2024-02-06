// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqI6ESoZkzUImSQ9AZpoD5NOXTelSVP9U",
  authDomain: "poochie-fcf63.firebaseapp.com",
  projectId: "poochie-fcf63",
  storageBucket: "poochie-fcf63.appspot.com",
  messagingSenderId: "889265375440",
  appId: "1:889265375440:web:40333aceb290f843c036d5",
  measurementId: "G-VYFNNZW592"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app