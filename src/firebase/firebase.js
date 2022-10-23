// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0MIKprGdWs8vQLLHy_vBLmOMHu0Zcr34",
  authDomain: "to-do-list-app-1be61.firebaseapp.com",
  projectId: "to-do-list-app-1be61",
  storageBucket: "to-do-list-app-1be61.appspot.com",
  messagingSenderId: "805295673575",
  appId: "1:805295673575:web:1e0ea853419c0213b81242",
  measurementId: "G-NQJW6BEMX9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore()
export const storage = getStorage();