// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyCS3ciV3AOfPol9QCuB_ssVasichMmJl4s",
    authDomain: "clone-9c2f2.firebaseapp.com",
    projectId: "clone-9c2f2",
    storageBucket: "clone-9c2f2.firebasestorage.app",
    messagingSenderId: "22283773156",
    appId: "1:22283773156:web:0c5d4d14555b9caf3bb8f1",
    measurementId: "G-4P7B2SFL41"
  };
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  
  export {db,auth};