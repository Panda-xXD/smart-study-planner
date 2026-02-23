import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";


function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const name = location.state?.name || "Student";
  const user = localStorage.getItem("user");
  const [subjects, setSubjects] = useState(
    JSON.parse(localStorage.getItem(`subjects-${user}`)) || []
);
  const [subjectName, setSubjectName] = useState("");

  const addSubject = () => {
    if (subjectName.trim() !== "") {
      setSubjects([...subjects, subjectName]);
      setSubjectName("");
    }
  };
  
  const openPlanner = () => navigate("/planner");

  const openFocusMode = () => {
  const subjects =
    JSON.parse(localStorage.getItem(`subjects-${user}`)) || [];

  const getTopics = (subject) =>
    JSON.parse(localStorage.getItem(`topics-${user}-${subject}`)) || [];

  const estimateRemaining = (topics) => {
    return topics.reduce((total, t) => {
      const base = t.importance || 1;

      const completion =
        t.readiness === 1 ? 0 :
        t.readiness === 2 ? 0.3 :
        t.readiness === 3 ? 0.6 : 1;

      return total + base * (1 - completion);
    }, 0);
  };

  const ranked = subjects
    .map((s) => ({
      name: s,
      remaining: estimateRemaining(getTopics(s))
    }))
    .sort((a, b) => b.remaining - a.remaining);

  if (ranked.length === 0) return;

  navigate(`/subject/${ranked[0].name}`);
};


  const deleteSubject = (subject) => {
  const updated = subjects.filter((s) => s !== subject);
  setSubjects(updated); 

  const user = localStorage.getItem("user");
  localStorage.removeItem(`topics-${user}-${subject}`);
};

  useEffect(() => {
  if (user) {
    localStorage.setItem(`subjects-${user}`, JSON.stringify(subjects));
  }
}, [subjects, user]);
const getSubjectProgress = (subject) => {
  const user = localStorage.getItem("user");
  const topics =
    JSON.parse(localStorage.getItem(`topics-${user}-${subject}`)) || [];

  if (topics.length === 0) return 0;

  const total = topics.reduce((sum, t) => {
    if (t.readiness === 1) return sum + 0;
    if (t.readiness === 2) return sum + 33;
    if (t.readiness === 3) return sum + 66;
    if (t.readiness === 4) return sum + 100;
    return sum;
  }, 0);

  return Math.round(total / topics.length);
};



  return (
  <div className="page">
    <div className="dashboard-modern">

      {/* HERO HEADER */}
      <div className="dash-hero">
        <div>
          <h1 className="dash-title">Welcome back, {user} 👋</h1>
          <p className="dash-sub">
            Your consistency is building momentum. Keep going.
          </p>
        </div>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>

      {/* INSIGHTS */}
      <div className="insight-grid">

        <div className="insight-card">
          <h3>{subjects.length}</h3>
          <p>Subjects</p>
        </div>

        <div className="insight-card">
          <h3>
            {subjects.length === 0
              ? 0
              : Math.round(
                  subjects.reduce(
                    (sum, s) => sum + getSubjectProgress(s),
                    0
                  ) / subjects.length
                )}
            %
          </h3>
          <p>Avg Readiness</p>
        </div>

        <div className="insight-card" onClick={openFocusMode}>
          <h3>Focus Mode</h3>
        </div>


        <div className="insight-card">
          <h3>🔥</h3>
          <p>Study Momentum</p>
        </div>
      </div>  

      {/* SMART FOCUS CARD */}
      <div className="focus-card">
        <div>
          <h2>What should you study next?</h2>
          <p>
            Your high-priority subjects will appear here as your ML engine
            learns your behavior.
          </p>
        </div>

        <button className="primary-btn" onClick={openPlanner}>
          Open planner →
        </button>

      </div>

      {/* ADD SUBJECT */}
      <div className="add-floating">
        <input
          placeholder="Add new subject..."
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
        />
        <button className="primary-btn" onClick={addSubject}>
          Add
        </button>
      </div>

      {/* SUBJECT GRID */}
      <div className="subjects-modern">
        {subjects.length === 0 ? (
          <p className="empty-text">No subjects yet — start your system 🚀</p>
        ) : (
          subjects.map((sub, index) => (
            <div
              key={index}
              className="subject-tile"
              onClick={() => navigate(`/subject/${sub}`)}
            >
              <div className="tile-top">
                <h4>{sub}</h4>
                <span>→</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${getSubjectProgress(sub)}%` }}
                />
              </div>

              <span className="progress-text">
                {getSubjectProgress(sub)}% complete
              </span>
            </div>
          ))
        )}
      </div>

    </div>
  </div>
);


}


export default Dashboard;
