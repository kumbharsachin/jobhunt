import { db, collection, addDoc, getDocs } from './firebase.js';

// Your RapidAPI Key
const RAPIDAPI_KEY = "bd72922905msh21c00cd25cd5246p1fceddjsn00598acd436f";

// Different job searches
const JOB_SEARCHES = [
  "software engineer india",
  "data analyst india",
  "UI UX designer india",
  "marketing manager india",
  "sales executive india",
  "product manager india",
  "web developer india",
  "business analyst india",
  "HR manager india",
  "content writer india"
];

// Fetch jobs for one search query
async function fetchJobsByQuery(query, page) {
  try {
    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=${page}&num_pages=1`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
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
    const snapshot = await getDocs(collection(db, "jobs"));
    let existingIds = [];
    snapshot.forEach(doc => {
      if (doc.data().jobId) {
        existingIds.push(doc.data().jobId);
      }
    });

    let newJobsCount = 0;

    for (let job of jobs) {
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
      existingIds.push(job.job_id);
    }

    return newJobsCount;

  } catch(error) {
    console.error("Error saving jobs:", error);
    return 0;
  }
}

// Main function — fetch all job types
async function autoPostJobs() {
  console.log("🤖 Auto posting jobs...");
  let totalJobs = 0;

  for (let query of JOB_SEARCHES) {
    console.log("Fetching: " + query);

    // Get 2 pages per search = 20 jobs per category
    for (let page = 1; page <= 2; page++) {
      let jobs = await fetchJobsByQuery(query, page);
      if (jobs.length > 0) {
        let count = await saveJobsToFirebase(jobs);
        totalJobs += count;
      }

      // Wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log("✅ Total new jobs added: " + totalJobs);
  alert("✅ Auto posted " + totalJobs + " new jobs!");
}

export { autoPostJobs };