import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAgjqgxftIEEdzdM2bGJM3NFjblM6KJ-FY",
  authDomain: "mydietapp-backend.firebaseapp.com",
  projectId: "mydietapp-backend",
  storageBucket: "mydietapp-backend.firebasestorage.app",
  messagingSenderId: "785721866692",
  appId: "1:785721866692:web:f52e03b840c8545c6c4c91",
  measurementId: "G-9TRBHKM5BL"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

// Analytics'i de kullanmak istersen:
//export const analytics = getAnalytics(app);
export const db = getFirestore(app); 
