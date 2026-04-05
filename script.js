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

// Load real jobs from RemoteOK API
function loadRealJobs() {
  let container = document.getElementById("jobList");

  fetch("https://remoteok.com/api")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // Remove first item (it's not a job)
      data.shift();

      // Show first 10 jobs
      let jobs = data.slice(0, 10);

      // Clear existing cards
      container.innerHTML = '';

      jobs.forEach(function(job) {
        container.innerHTML += `
          <div class="job-card">
            <h2>${job.position}</h2>
            <p class="company">🏢 ${job.company}</p>
            <p>📍 Remote | 💰 ${job.salary ? job.salary : 'Not specified'}</p>
            <p class="tag">Remote</p>
            <button onclick="window.open('${job.url}', '_blank')">Apply Now</button>
          </div>
        `;
      });
    })
    .catch(function(error) {
      console.log("API error:", error);
    });
}

// Load jobs when page opens
window.onload = function() {
  loadRealJobs();
}