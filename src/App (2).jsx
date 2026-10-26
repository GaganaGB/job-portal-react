
import { useEffect, useState } from "react";
import "./App.css";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

function App() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [withdrawn, setWithdrawn] = useState(0);
  const [offers, setOffers] = useState(0);
  const [dashboardTitle, setDashboardTitle] =
    useState("Dashboard Overview");
  const [jobForm, setJobForm] = useState({ name: "", category: "Software / Technology", location: "India", type: "Full Time" });
  const [editingId, setEditingId] = useState(null);
  const [jobMessage, setJobMessage] = useState("");
  const [savingJob, setSavingJob] = useState(false);

  // GET jobs from Express API
  const loadJobs = () => {
    fetch(`${API_BASE}/api/jobs`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load jobs from the server.");
        return response.json();
      })
      .then((data) => setJobs(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.error("Error loading jobs:", error);
        setJobMessage("Could not load jobs. Check that the backend is running.");
      });
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleJobField = (event) => {
    const { name, value } = event.target;
    setJobForm((current) => ({ ...current, [name]: value }));
  };

  const resetJobForm = () => {
    setJobForm({ name: "", category: "Software / Technology", location: "India", type: "Full Time" });
    setEditingId(null);
  };

  const saveJob = async (event) => {
    event.preventDefault();
    if (!jobForm.name.trim()) {
      setJobMessage("Please enter a company or job name.");
      return;
    }
    setSavingJob(true);
    setJobMessage("");
    try {
      const response = await fetch(`${API_BASE}/api/jobs${editingId !== null ? `/${editingId}` : ""}`, {
        method: editingId !== null ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: jobForm.name.trim(),
          category: jobForm.category.trim(),
          location: jobForm.location.trim(),
          type: jobForm.type.trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not save the job.");
      setJobMessage(editingId !== null ? "Job updated successfully." : "Job added successfully.");
      resetJobForm();
      await loadJobs();
    } catch (error) {
      setJobMessage(error.message || "Could not save the job.");
    } finally {
      setSavingJob(false);
    }
  };

  const startEditing = (job) => {
    setEditingId(job._id);
    setJobForm({
      name: job.name || "",
      category: job.category || "Software / Technology",
      location: job.location || "India",
      type: job.type || "Full Time",
    });
    setJobMessage("Edit the details and click Update Job.");
    document.getElementById("job-manager")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const deleteJob = async (job) => {
    if (!window.confirm(`Delete the job for ${job.name}?`)) return;
    setJobMessage("");
    try {
      const response = await fetch(`${API_BASE}/api/jobs/${job._id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not delete the job.");
      if (editingId === job._id) resetJobForm();
      setJobMessage("Job deleted successfully.");
      await loadJobs();
    } catch (error) {
      setJobMessage(error.message || "Could not delete the job.");
    }
  };

  // Apply
  const applyJob = (company) => {
    if (!appliedJobs.includes(company)) {
      setAppliedJobs([...appliedJobs, company]);
      alert("Applied to " + company);
    } else {
      alert("Already applied to " + company);
    }
  };

  // Withdraw
  const cancelJob = (company) => {
    if (appliedJobs.includes(company)) {
      setAppliedJobs(
        appliedJobs.filter((job) => job !== company)
      );
      setWithdrawn(withdrawn + 1);
      alert("Application withdrawn");
    } else {
      alert("You have not applied to " + company);
    }
  };

  // Registration
  const validateForm = (event) => {
    event.preventDefault();

    const fname = document.getElementById("fname").value.trim();
    const lname = document.getElementById("lname").value.trim();
    const userid = document.getElementById("userid").value;
    const password = document.getElementById("password").value;
    const mobile = document.getElementById("mobile").value;
    const email = document.getElementById("email").value;
    const dob = document.getElementById("dob").value;
    const postal = document.getElementById("postal").value;

    const namePattern = /^[A-Za-z]{3,}$/;
    const userPattern = /^(?=.*[A-Z]).{6,}$/;
    const mobilePattern = /^[6-9][0-9]{9}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const postalPattern = /^[0-9]{6}$/;

    if (!namePattern.test(fname)) {
      alert(
        "First Name should contain only alphabets and at least 3 characters."
      );
      return;
    }

    if (!namePattern.test(lname)) {
      alert(
        "Last Name should contain only alphabets and at least 3 characters."
      );
      return;
    }

    if (userid.includes(" ") || !userPattern.test(userid)) {
      alert(
        "User ID must be at least 6 characters and contain one capital letter."
      );
      return;
    }

    if (password.length < 8) {
      alert("Password should be at least 8 characters.");
      return;
    }

    if (!mobilePattern.test(mobile)) {
      alert(
        "Mobile Number must be exactly 10 digits and start with 6, 7, 8 or 9."
      );
      return;
    }

    if (!emailPattern.test(email)) {
      alert("Please enter a valid Email ID.");
      return;
    }

    if (!dob) {
      alert("Please select your Date of Birth.");
      return;
    }

    if (!postalPattern.test(postal)) {
      alert("Postal Code must be exactly 6 digits.");
      return;
    }

    alert("Registration Successful!");
  };

  // Change dashboard text
  const changeText = () => {
    setDashboardTitle("Welcome to Job Portal Dashboard");
  };

  // Change dashboard style
  const changeStyle = () => {
    setDashboardTitle("Welcome to Job Portal Dashboard");
  };

  return (
    <div className="page">

      {/* HEADER */}
      <header className="top-header">
        <div className="logo">
          <h2>Job Portal</h2>
        </div>

        <div className="login">
          <a href="#">Login</a>
          <a href="#register">Register</a>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="navbar">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#jobs">Jobs</a></li>
          <li><a href="#companies">Companies</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-overlay">
          <h1>Find Your Dream Job</h1>
          <p>Search thousands of jobs from top companies.</p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search Job"
            />
            <button>Search</button>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories">
        <h2>Popular Categories</h2>

        <div className="category-box">

          <div className="category-card">
            <div className="category-icon">💻</div>
            <h3>IT & Software</h3>
            <p>Software Developer, Tester, AI Engineer</p>
          </div>

          <div className="category-card">
            <div className="category-icon">🏥</div>
            <h3>Healthcare</h3>
            <p>Doctor, Nurse, Pharmacist</p>
          </div>

          <div className="category-card">
            <div className="category-icon">🎓</div>
            <h3>Education</h3>
            <p>Teacher, Lecturer, Professor</p>
          </div>

        </div>
      </section>

      {/* DASHBOARD */}
      <section className="applications">

        {/* SIDEBAR */}
        <aside className="sidebar">

          <h2>Response</h2>

          <div className="response-box">
            <h3>Applications</h3>
            <p>{appliedJobs.length}</p>
          </div>

          <div className="response-box">
            <h3>Companies Applied</h3>
            <p>{appliedJobs.length}</p>
          </div>

          <div className="response-box">
            <h3>Offer Letters</h3>
            <p>{offers}</p>
          </div>

          <div className="response-box">
            <h3>Withdrawn</h3>
            <p>{withdrawn}</p>
          </div>

          <ul>
            <li>Profile</li>
            <li>Settings</li>
          </ul>

        </aside>

        {/* MAIN DASHBOARD */}
        <main className="main-content">

          <div className="dashboard-heading">
            <h2
              id="dashboardTitle"
              className="dashboard-title"
            >
              {dashboardTitle}
            </h2>

            <div>
              <button onClick={changeText}>
                Change Text
              </button>

              <button onClick={changeStyle}>
                Change Style
              </button>
            </div>
          </div>

          <div className="dashboard-grid">

            <div className="dashboard-box">
              <span>💼</span>
              <h3>Jobs</h3>
              <p>250+</p>
            </div>

            <div className="dashboard-box">
              <span>🏢</span>
              <h3>Companies</h3>
              <p>120+</p>
            </div>

            <div className="dashboard-box">
              <span>📄</span>
              <h3>Applications</h3>
              <p>{appliedJobs.length}</p>
            </div>

            <div className="dashboard-box">
              <span>🤝</span>
              <h3>Interviews</h3>
              <p>15</p>
            </div>

          </div>

          {/* JOB CRUD MANAGER */}
          <section className="job-manager" id="job-manager">
            <h2>{editingId !== null ? "Edit Job" : "Manage Jobs"}</h2>
            <p>Add a job or update an existing job. Changes are saved in MongoDB.</p>
            <form className="job-manager-form" onSubmit={saveJob}>
              <input name="name" value={jobForm.name} onChange={handleJobField} placeholder="Company / Job Name (e.g. Amazon)" required />
              <input name="category" value={jobForm.category} onChange={handleJobField} placeholder="Category" required />
              <input name="location" value={jobForm.location} onChange={handleJobField} placeholder="Location" required />
              <select name="type" value={jobForm.type} onChange={handleJobField}>
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Internship</option>
                <option>Remote</option>
                <option>Contract</option>
              </select>
              <button className="register-button" type="submit" disabled={savingJob}>
                {savingJob ? "Saving..." : editingId !== null ? "Update Job" : "Add Job"}
              </button>
              {editingId !== null && <button type="button" className="cancel-edit-button" onClick={resetJobForm}>Cancel Edit</button>}
            </form>
            {jobMessage && <p className="job-message" role="status">{jobMessage}</p>}
          </section>

          {/* AVAILABLE JOBS */}
          <section className="jobs" id="jobs">

            <div className="jobs-heading">
              <div>
                <h2>Available Jobs</h2>
                <p>Latest opportunities from top companies</p>
              </div>

              <button
                className="refresh-button"
                onClick={loadJobs}
              >
                🔄 Refresh Jobs
              </button>
            </div>

            <div className="job-list">

              {jobs.map((job) => (

                <div className="job" key={job._id}>

                  <div className="job-company-icon">
                    {job.name.charAt(0)}
                  </div>

                  <div className="job-details">
                    <h3>{job.name}</h3>
                    <p>{job.category}</p>
                    <small>📍 {job.location} &nbsp; | &nbsp; {job.type}</small>
                  </div>

                  <div className="job-buttons">

                    <button
                      className="apply"
                      onClick={() => applyJob(job.name)}
                    >
                      Apply
                    </button>

                    <button
                      className="withdraw"
                      onClick={() => cancelJob(job.name)}
                    >
                      Withdraw
                    </button>
                    <button className="edit-job-button" onClick={() => startEditing(job)}>Edit</button>
                    <button className="delete-job-button" onClick={() => deleteJob(job)}>Delete</button>

                  </div>

                </div>

              ))}

            </div>

          </section>

        </main>
      </section>

      {/* REGISTRATION */}
      <section className="register" id="register">

        <div className="register-container">

          <div className="register-text">
            <p className="section-label">JOIN OUR COMMUNITY</p>
            <h2>Job Registration</h2>
            <p>
              Create your account and explore exciting
              career opportunities from top companies.
            </p>
          </div>

          <form onSubmit={validateForm}>

            <div className="form-row">
              <input
                type="text"
                id="fname"
                placeholder="First Name"
              />

              <input
                type="text"
                id="lname"
                placeholder="Last Name"
              />
            </div>

            <div className="form-row">
              <input
                type="text"
                id="userid"
                placeholder="User ID"
              />

              <input
                type="password"
                id="password"
                placeholder="Password"
              />
            </div>

            <div className="form-row">
              <input
                type="text"
                id="mobile"
                placeholder="Mobile Number"
              />

              <input
                type="email"
                id="email"
                placeholder="Email ID"
              />
            </div>

            <div className="form-row">
              <input
                type="date"
                id="dob"
              />

              <input
                type="text"
                id="postal"
                placeholder="Postal Code"
              />
            </div>

            <button
              type="submit"
              className="register-button"
            >
              Register Now
            </button>

          </form>

        </div>

      </section>

      {/* FOOTER */}
      <footer id="contact">
        <div className="footer-content">

          <div>
            <h2>Job Portal</h2>
            <p>
              Connecting talented people with great
              career opportunities.
            </p>
          </div>

          <div>
            <h3>Quick Links</h3>
            <p>Home</p>
            <p>Jobs</p>
            <p>Companies</p>
          </div>

          <div>
            <h3>Contact</h3>
            <p>📧 support@jobportal.com</p>
            <p>📞 +91 98765 43210</p>
          </div>

        </div>

        <div className="copyright">
          © 2026 Job Portal | Built with React & ExpressJS
        </div>
      </footer>

    </div>
  );
}

export default App;

