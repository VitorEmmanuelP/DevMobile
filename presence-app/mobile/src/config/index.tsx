import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDDhQO3aUkC7sIkF3_zBxswfjZsDRAHevs",
  authDomain: "presence-app-4dfb9.firebaseapp.com",
  projectId: "presence-app-4dfb9",
  storageBucket: "presence-app-4dfb9.firebasestorage.app",
  messagingSenderId: "411288216015",
  appId: "1:411288216015:web:073c29e7026d4f5028f2ba"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);