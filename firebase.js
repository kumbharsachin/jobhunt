import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD-dYNwBIo1aUryS7F6-gwIEJS5vq8xBt8",
  authDomain: "jobhunt-6f406.firebaseapp.com",
  projectId: "jobhunt-6f406",
  storageBucket: "jobhunt-6f406.firebasestorage.app",
  messagingSenderId: "166338331012",
  appId: "1:166338331012:web:87618fa72d59812d911dd1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs };