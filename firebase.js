import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBecaPJy3fj-MhEcd0YnPyS40YviRem-J8",
  authDomain: "jobhunt-49870.firebaseapp.com",
  projectId: "jobhunt-49870",
  storageBucket: "jobhunt-49870.firebasestorage.app",
  messagingSenderId: "243315667702",
  appId: "1:243315667702:web:a0d94de60a88345b9ff2d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Save Job to Firebase
async function saveJob(job) {
  try {
    await addDoc(collection(db, "jobs"), job);
    console.log("✅ Job saved!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Get All Jobs from Firebase
async function getJobs() {
  try {
    const snapshot = await getDocs(collection(db, "jobs"));
    let jobs = [];
    snapshot.forEach(doc => {
      jobs.push({ id: doc.id, ...doc.data() });
    });
    return jobs;
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

export { db, saveJob, getJobs };