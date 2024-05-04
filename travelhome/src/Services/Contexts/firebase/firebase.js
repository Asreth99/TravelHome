// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwM2WUDjOSxQ1qUenJBr991otdYC-toN8",
  authDomain: "travelhome-e9c88.firebaseapp.com",
  projectId: "travelhome-e9c88",
  storageBucket: "travelhome-e9c88.appspot.com",
  messagingSenderId: "265506041358",
  appId: "1:265506041358:web:d65ce3385314c991d4d65f",
  measurementId: "G-P6NWEPESCS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getFirestore(app);

export {app,auth,database};