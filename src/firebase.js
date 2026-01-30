import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// आपकी ओरिजिनल कॉन्फ़िगरेशन
const firebaseConfig = {
  apiKey: "AIzaSyBhNDgsAtOsxdfNGfTEqbuQoYgbtTjUSVo",
  authDomain: "khatri-online.firebaseapp.com",
  databaseURL: "https://khatri-online-default-rtdb.firebaseio.com",
  projectId: "khatri-online",
  storageBucket: "khatri-online.firebasestorage.app",
  messagingSenderId: "117940742720",
  appId: "1:117940742720:web:5d7dce7c186199e9fbcda5",
  measurementId: "G-Q5QF1HL598"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// एक्सपोर्ट करें ताकि App.js इस्तेमाल कर सके
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
