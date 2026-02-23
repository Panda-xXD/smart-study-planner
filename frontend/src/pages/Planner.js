import { useNavigate } from "react-router-dom";

function Planner() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

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

  const plannerData = subjects
    .map((s) => {
      const topics = getTopics(s);
      const remaining = estimateRemaining(topics);

      return {
        name: s,
        remaining,
        topics
      };
    })
    .sort((a, b) => b.remaining - a.remaining);

  const todayPlan = plannerData.slice(0, 3);

  const openSubject = (name) => {
    navigate(`/subject/${name}`);
  };

  return (
    <div className="page">
      <div className="planner-container">

        <div className="planner-header">
          <h1>Focus Planner</h1>
          <p className="muted">
            Your smartest next moves
          </p>
        </div>

        {/* TODAY PLAN */}
        <div className="card">
          <h3>Today Focus</h3>

          {todayPlan.length === 0 ? (
            <p className="muted">No subjects yet</p>
          ) : (
            todayPlan.map((s, i) => (
              <div
                key={i}
                className="planner-item"
                onClick={() => openSubject(s.name)}
              >
                <div>
                  <strong>{s.name}</strong>
                  <p className="muted">
                    Remaining load: {s.remaining.toFixed(1)}
                  </p>
                </div>

                <button className="secondary-btn">
                  Study →
                </button>
              </div>
            ))
          )}
        </div>

        {/* INSIGHTS */}
        <div className="card">
          <h3>Insights</h3>

          <div className="planner-insights">
            <div className="insight-box">
              <h2>{plannerData.length}</h2>
              <span>Subjects</span>
            </div>

            <div className="insight-box">
              <h2>
                {plannerData.reduce((t, s) => t + s.remaining, 0).toFixed(1)}
              </h2>
              <span>Total Load</span>
            </div>

            <div className="insight-box">
              <h2>AI</h2>
              <span>Prioritized</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Planner;
