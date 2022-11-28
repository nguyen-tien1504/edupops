// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBUYkrCMR-zm4aAhCmQgWYEOjo41rYv95A',
  authDomain: "edupops-server.firebaseapp.com",
  projectId: "edupops-server",
  storageBucket: "edupops-server.appspot.com",
  messagingSenderId: "145699045956",
  appId: "1:145699045956:web:ff643b92a7840b74baf211",
  measurementId: "G-W2VPZYH4LT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth(app);
