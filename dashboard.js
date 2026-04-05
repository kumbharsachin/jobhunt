import { db, collection, addDoc, getDocs } from './firebase.js';

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

  let options = {
    key: rzp_test_SZnDOjNGcbyLJQ,
    amount: 99900,
    currency: "INR",
    name: "JobHunt",
    description: "Job Posting Fee ₹999",
    handler: async function(response) {
      try {
        await addDoc(collection(db, "jobs"), {
          title: title,
          company: company,
          location: location,
          salary: salary,
          type: type,
          exp: exp,
          desc: desc,
          req: req,
          date: new Date().toLocaleDateString(),
          paymentId: response.razorpay_payment_id
        });

        alert("✅ Payment successful! Job posted!");

        document.getElementById('jobTitle').value = '';
        document.getElementById('jobCompany').value = '';
        document.getElementById('jobLocation').value = '';
        document.getElementById('jobSalary').value = '';
        document.getElementById('jobDesc').value = '';
        document.getElementById('jobReq').value = '';

      } catch(error) {
        alert("❌ Error: " + error.message);
      }
    },
    prefill: {
      name: "Employer",
      email: "employer@example.com"
    },
    theme: {
      color: "#3498db"
    }
  };
let rzp = new window.Razorpay(options);
  rzp.open();
}

async function loadMyJobs() {
  let list = document.getElementById('myJobsList');
  list.innerHTML = '<p>Loading...</p>';

  try {
    const snapshot = await getDocs(collection(db, "jobs"));
    let jobs = [];
    snapshot.forEach(doc => {
      jobs.push({ id: doc.id, ...doc.data() });
    });

    if (jobs.length === 0) {
      list.innerHTML = '<div class="empty-box"><p>📭 No jobs posted yet.</p></div>';
      return;
    }

    list.innerHTML = '';
    jobs.forEach(function(job) {
      list.innerHTML += '<div class="job-post-card">' +
        '<div>' +
        '<h3>' + job.title + '</h3>' +
        '<p>🏢 ' + job.company + ' | 📍 ' + job.location + ' | 💰 ' + job.salary + '</p>' +
        '<p>📅 Posted on ' + job.date + '</p>' +
        '</div>' +
        '</div>';
    });
  } catch(error) {
    list.innerHTML = '<p>❌ Error loading jobs</p>';
  }
}

async function loadStats() {
  try {
    const snapshot = await getDocs(collection(db, "jobs"));
    document.getElementById('totalJobs').innerText = snapshot.size;
  } catch(error) {
    console.error(error);
  }
}