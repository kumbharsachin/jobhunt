import { autoPostJobs } from './autojobs.js';
import { db, collection, getDocs } from './firebase.js';

// Filter jobs
function filterJobs() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let cards = document.querySelectorAll(".job-card");
  cards.forEach(function(card) {
    let text = card.innerText.toLowerCase();
    if (text.includes(input)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Load jobs from Firebase
async function loadJobsFromFirebase() {
  let container = document.getElementById("jobList");
  container.innerHTML = '<p style="text-align:center; padding:20px;">Loading jobs...</p>';

  try {
    const snapshot = await getDocs(collection(db, "jobs"));
    let jobs = [];
    snapshot.forEach(doc => {
      jobs.push({ id: doc.id, ...doc.data() });
    });

    if (jobs.length === 0) {
      container.innerHTML = '<p style="text-align:center;">No jobs yet!</p>';
      return;
    }

    container.innerHTML = '';
    jobs.forEach(function(job) {
      container.innerHTML += `
        <div class="job-card">
          <h2>${job.title}</h2>
          <p class="company">🏢 ${job.company}</p>
          <p>📍 ${job.location} | 💰 ${job.salary}</p>
          <p class="tag">${job.type}</p>
          <button onclick="window.open('${job.url || 'job.html'}', '_blank')">Apply Now</button>
        </div>
      `;
    });

  } catch(error) {
    container.innerHTML = '<p>❌ Error loading jobs</p>';
  }
}

// Make functions available globally
window.filterJobs = filterJobs;
window.autoPostJobs = autoPostJobs;

// Load jobs when page opens
window.onload = function() {
  loadJobsFromFirebase();

  // Auto post jobs every time page loads
  autoPostJobs();
}