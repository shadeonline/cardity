// Import the functions you need from the SDKs you need
import * as firebase from 'firebase/app';
import { getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCf2BsSO7intMEZyZQUbf3gdQK_TNOvxHE",
  authDomain: "carditydb.firebaseapp.com",
  projectId: "carditydb",
  storageBucket: "carditydb.appspot.com",
  messagingSenderId: "627053711755",
  appId: "1:627053711755:web:caa91da4f88ef749419f8e",
  measurementId: "G-44WRTNPMRV"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app)
// const messaging = getMessaging(app);

export {auth, firestore, firebase};