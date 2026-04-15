import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiL8t-lZ8nJfnv1ho7iZH4tLELsnUxRZ4",
  authDomain: "pratica-02-e08c8.firebaseapp.com",
  projectId: "pratica-02-e08c8",
  storageBucket: "pratica-02-e08c8.firebasestorage.app",
  messagingSenderId: "352924224397",
  appId: "1:352924224397:web:175fa7792edbfa00044bc4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);