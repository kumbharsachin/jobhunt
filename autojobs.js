import { db, collection, addDoc, getDocs } from './firebase.js';

// Your RapidAPI Key
const RAPIDAPI_KEY = "YOUR_RAPIDAPI_KEY_HERE";

// Fetch jobs from JSearch API
async function fetchJobsFromAPI() {
  try {
    const response = await fetch(
      "https://jsearch.p.rapidapi.com/search?query=software+engineer+india&page=1&num_pages=1",
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":bd72922905msh21c00cd25cd5246p1fceddjsn00598acd436f,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
        }
      }
    );

    const data = await response.json();
    return data.data || [];

  } catch(error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

// Save jobs to Firebase
async function saveJobsToFirebase(jobs) {
  try {
    // Get existing jobs to avoid duplicates
    const snapshot = await getDocs(collection(db, "jobs"));
    let existingIds = [];
    snapshot.forEach(doc => {
      if (doc.data().jobId) {
        existingIds.push(doc.data().jobId);
      }
    });

    let newJobsCount = 0;

    for (let job of jobs) {
      // Skip if already saved
      if (existingIds.includes(job.job_id)) continue;

      await addDoc(collection(db, "jobs"), {
        jobId: job.job_id,
        title: job.job_title,
        company: job.employer_name,
        location: job.job_city + ", " + job.job_country,
        salary: job.job_min_salary ? "₹" + job.job_min_salary : "Not specified",
        type: job.job_employment_type || "Full Time",
        exp: job.job_required_experience?.required_experience_in_months > 24 ? "2+ years" : "Fresher",
        desc: job.job_description?.substring(0, 500) || "No description",
        req: job.job_required_skills?.join(", ") || "Not specified",
        url: job.job_apply_link,
        date: new Date().toLocaleDateString(),
        source: "API"
      });

      newJobsCount++;
    }

    console.log("✅ Added " + newJobsCount + " new jobs!");
    return newJobsCount;

  } catch(error) {
    console.error("Error saving jobs:", error);
    return 0;
  }
}

// Main function — fetch and save jobs
async function autoPostJobs() {
  console.log("🤖 Auto posting jobs...");
  let jobs = await fetchJobsFromAPI();
  if (jobs.length > 0) {
    let count = await saveJobsToFirebase(jobs);
    alert("✅ Auto posted " + count + " new jobs!");
  } else {
    alert("⚠️ No new jobs found!");
  }
}

export { autoPostJobs };