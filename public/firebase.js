import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAdPyYmmvRlPadP9MmAkq3t2QCFUAiFvag",
  authDomain: "my-kitch.firebaseapp.com",
  projectId: "my-kitch",
  storageBucket: "my-kitch.firebasestorage.app",
  messagingSenderId: "91210543742",
  appId: "1:91210543742:web:39051c7fffed8c0f8d9e2f",
  measurementId: "G-35JMWG4FVB"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
