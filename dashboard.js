// Import Firebase
import { saveJob, getJobs } from './firebase.js';

window.onload = function() {

  let user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (user) {
    document.getElementById('companyName').innerText = user.name;
  }

  document.getElementById('postJobBtn').addEventListener('click', postJob);

  document.getElementById('tab-postJob').addEventListener('click', function() {
    showSection('postJob');
  });
  document.getElementById('tab-myJobs').addEventListener('click', function() {
    showSection('myJobs');
    loadMyJobs();
  });
  document.getElementById('tab-applications').addEventListener('click', function() {
    showSection('applications');
  });
  document.getElementById('tab-stats').addEventListener('click', function() {
    showSection('stats');
    loadStats();
  });
}

function showSection(section) {
  let sections = ['postJob', 'myJobs', 'applications', 'stats'];
  sections.forEach(function(s) {
    document.getElementById(s).style.display = 'none';
  });
  document.getElementById(section).style.display = 'block';

  let tabs = ['tab-postJob', 'tab-myJobs', 'tab-applications', 'tab-stats'];
  tabs.forEach(function(t) {
    document.getElementById(t).classList.remove('active');
  });
  document.getElementById('tab-' + section).classList.add('active');
}

// Post a Job
async function postJob() {
  let title = document.getElementById('jobTitle').value;
  let company = document.getElementById('jobCompany').value;
  let location = document.getElementById('jobLocation').value;
  let salary = document.getElementById('jobSalary').value;
  let type = document.getElementById('jobType').value;
  let exp = document.getElementById('jobExp').value;
  let desc = document.getElementById('jobDesc').value;
  let req = document.getElementById('jobReq').value;

  if (!title || !company || !location || !salary || !desc) {
    alert("⚠️ Please fill in all required fields!");
    return;
  }

  let job = {
    title: title,
    company: company,
    location: location,
    salary: salary,
    type: type,
    exp: exp,
    desc: desc,
    req: req,
    date: new Date().toLocaleDateString()
  };

  // Save to Firebase
  await saveJob(job);

  // Save to localStorage too
  let jobs = JSON.parse(localStorage.getItem('postedJobs')) || [];
  jobs.push(job);
  localStorage.setItem('postedJobs', JSON.stringify(jobs));

  alert("✅ Job posted successfully!");

  document.getElementById('jobTitle').value = '';
  document.getElementById('jobCompany').value = '';
  document.getElementById('jobLocation').value = '';
  document.getElementById('jobSalary').value = '';
  document.getElementById('jobDesc').value = '';
  document.getElementById('jobReq').value = '';
}

// Load My Jobs
async function loadMyJobs() {
  let list = document.getElementById('myJobsList');
  list.innerHTML = '<p>Loading jobs...</p>';

  // Get jobs from Firebase
  let jobs = await getJobs();

  if (!jobs || jobs.length === 0) {
    list.innerHTML = '<div class="empty-box"><p>📭 No jobs posted yet.</p></div>';
    return;
  }

  list.innerHTML = '';
  jobs.forEach(function(job, index) {
    list.innerHTML += '<div class="job-post-card">' +
      '<div>' +
      '<h3>' + job.title + '</h3>' +
      '<p>🏢 ' + job.company + ' | 📍 ' + job.location + ' | 💰 ' + job.salary + ' | 🕒 ' + job.type + '</p>' +
      '<p>📅 Posted on ' + job.date + '</p>' +
      '</div>' +
      '</div>';
  });
}

// Load Stats
async function loadStats() {
  let jobs = await getJobs();
  document.getElementById('totalJobs').innerText = jobs ? jobs.length : 0;
}