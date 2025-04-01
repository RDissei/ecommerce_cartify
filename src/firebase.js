// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCS3ciV3AOfPol9QCuB_ssVasichMmJl4s",
  authDomain: "clone-9c2f2.firebaseapp.com",
  projectId: "clone-9c2f2",
  storageBucket: "clone-9c2f2.firebasestorage.app",
  messagingSenderId: "22283773156",
  appId: "1:22283773156:web:0c5d4d14555b9caf3bb8f1",
  measurementId: "G-4P7B2SFL41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);