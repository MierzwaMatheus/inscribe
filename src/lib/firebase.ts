// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCt9SCSTaZiDSaICNzXWzbnAfsMerZi4-I",
  authDomain: "inbot-docs.firebaseapp.com",
  projectId: "inbot-docs",
  storageBucket: "inbot-docs.firebasestorage.app",
  messagingSenderId: "941217675143",
  appId: "1:941217675143:web:16cf5fe0e97d93b5a58522",
  measurementId: "G-SJ3WDCTDQD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);