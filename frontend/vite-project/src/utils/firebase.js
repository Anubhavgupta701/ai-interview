
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "interviewerrk.firebaseapp.com",
  projectId: "interviewerrk",
  storageBucket: "interviewerrk.firebasestorage.app",
  messagingSenderId: "363214809152",
  appId: "1:363214809152:web:978499278a37d7a8b757a5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };