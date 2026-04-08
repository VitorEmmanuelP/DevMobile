import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBCXXGSHIZui7Q7OB_hh706aTmlWE0Sj6I",
  authDomain: "unipam-vitor-app.firebaseapp.com",
  projectId: "unipam-vitor-app",
  storageBucket: "unipam-vitor-app.firebasestorage.app",
  messagingSenderId: "829209383043",
  appId: "1:829209383043:web:ef577c80acdd437eb78bb6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);