// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSPzfe-fIq_T5YiH_K3CGFjkXuVtXh_s4",
  authDomain: "workoutrpg-14ea8.firebaseapp.com",
  projectId: "workoutrpg-14ea8",
  storageBucket: "workoutrpg-14ea8.firebasestorage.app",
  messagingSenderId: "365189784249",
  appId: "1:365189784249:web:711c00340542c7b238f168",
  measurementId: "G-YMB052NVCF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };