import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import DateTimePicker from "../components/DateTimePicker";
import TimePicker from "../components/TimePicker";



function Subject() {
  const { name } = useParams();
  // TEMP: later this will come from backend ML
const learnerType = "Average";
  const user = localStorage.getItem("user");
  const [studyHours, setStudyHours] = useState(1);
  const [dailyHours, setDailyHours] = useState(2);
  const [examDate, setExamDate] = useState(() => {
    const saved = localStorage.getItem(`exam-date-${user}-${name}`);
    return saved ? new Date(saved) : undefined;
        });
    const [countdown, setCountdown] = useState(null);
  const [topics, setTopics] = useState(() => {
  const saved = localStorage.getItem(`topics-${user}-${name}`);
  return saved ? JSON.parse(saved) : [];
});
const efficiencyFactor =
  Number(localStorage.getItem(`efficiency-${user}`)) || 1.0;
  const [topicName, setTopicName] = useState("");

  const addTopic = () => {
    if (topicName.trim() !== "") {
      setTopics([
        ...topics,
        {
          name: topicName,
          readiness: 1,
          importance: 1
        }
      ]);
      setTopicName("");
    }
  };

useEffect(() => {
  if (!examDate) return;

  const interval = setInterval(() => {
    const now = new Date().getTime();
    const target = new Date(examDate).getTime();
    const distance = target - now;

    if (distance <= 0) {
      setCountdown(null);
      clearInterval(interval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (distance % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor(
      (distance % (1000 * 60)) / 1000
    );

    setCountdown({ days, hours, minutes, seconds });

  }, 1000);

  return () => clearInterval(interval);
}, [examDate]);




  const updateTopic = (index, field, value) => {
    const updated = [...topics];
    updated[index][field] = Number(value);
    setTopics(updated);
  };
  const getBaseTime = (importance) => {
  if (importance === 1) return 1;
  if (importance === 2) return 2;
  if (importance === 3) return 3;
  if (importance === 4) return 4;
  return 2;
};
const getDailyPlan = () => {
  let remaining = dailyHours;
  const plan = [];

  const sortedTopics = [...getNextTopics()];

  for (let topic of sortedTopics) {
    if (remaining <= 0) break;

    const time = estimateStudyTime(topic);
    if (time > 0) {
      const allocated = Math.min(time, remaining);
      plan.push({
        name: topic.name,
        time: allocated
      });
      remaining -= allocated;
    }
  }

  return plan;
};

const getCompletionFraction = (readiness) => {
  if (readiness === 1) return 0;
  if (readiness === 2) return 0.3;
  if (readiness === 3) return 0.6;
  if (readiness === 4) return 1;
  return 0;
};

const getLearnerFactor = () => {
  if (learnerType === "Weak") return 1.4;
  if (learnerType === "Strong") return 0.7;
  return 1.0;
};

const estimateStudyTime = (topic) => {
  const base = getBaseTime(topic.importance);
  const remaining = 1 - getCompletionFraction(topic.readiness);
  const learner = getLearnerFactor();

  const time = (base * remaining * learner) / efficiencyFactor;
  return Math.max(0, Math.round(time * 2) / 2);
};

const getTotalRemainingTime = () => {
  return topics.reduce((total, topic) => {
    return total + estimateStudyTime(topic);
  }, 0);
};

const deleteTopic = (index) => {
  const updated = topics.filter((_, i) => i !== index);
  setTopics(updated);
};

const logStudySession = (index) => {
  const updated = [...topics];
  const topic = updated[index];

  // current readiness
  const beforeReadiness = topic.readiness;
  const beforeCompletion = getCompletionFraction(beforeReadiness);

  // 🔼 auto-increase readiness (max +1)
  const newReadiness = Math.min(4, beforeReadiness + 1);
  topic.readiness = newReadiness;

  const afterCompletion = getCompletionFraction(newReadiness);
const gain = afterCompletion - beforeCompletion;

const roiKey = `roi-${user}-${name}`;

const roiData =
  JSON.parse(localStorage.getItem(roiKey)) || {
    totalGain: 0,
    totalHours: 0
  };

roiData.totalGain += gain;
roiData.totalHours += studyHours;

localStorage.setItem(roiKey, JSON.stringify(roiData));

  // observed efficiency
  const observedEfficiency =
    (afterCompletion - beforeCompletion) / studyHours;

  const oldEfficiency =
    Number(localStorage.getItem(`efficiency-${user}`)) || 1.0;
  const hour = new Date().getHours();
    const heatKey = `heatmap-${user}-${name}`;

    let heatData =
    JSON.parse(localStorage.getItem(heatKey)) ||
    Array(24).fill(0);

    // Safety: if old format detected, reset it
    if (!Array.isArray(heatData)) {
    heatData = Array(24).fill(0);
    }

    heatData[hour] += studyHours;

    localStorage.setItem(heatKey, JSON.stringify(heatData));

  
  const newEfficiency = Math.max(
    0.7,
    Math.min(1.3, 0.8 * oldEfficiency + 0.2 * observedEfficiency)
  );

  localStorage.setItem(`efficiency-${user}`, newEfficiency.toFixed(2));

  setTopics(updated);

  alert(
    `Study logged!
Readiness increased to level ${newReadiness}
Efficiency factor updated to ${newEfficiency.toFixed(2)}`
  );
};

const getROI = () => {
  const roiData =
    JSON.parse(localStorage.getItem(`roi-${user}-${name}`)) || {
      totalGain: 0,
      totalHours: 0
    };

  if (roiData.totalHours === 0) return 0;

  return (roiData.totalGain / roiData.totalHours).toFixed(2);
};

const getHeatmapData = () => {
  const data =
    JSON.parse(localStorage.getItem(`heatmap-${user}-${name}`));

  if (!Array.isArray(data)) {
    return Array(24).fill(0);
  }

  return data;
};



const getAlerts = () => {
  const alerts = [];

  topics.forEach((topic) => {
    if (topic.importance === 4 && topic.readiness === 1) {
      alerts.push(`⚠️ Critical topic not started: ${topic.name}`);
    }
    else if (topic.importance >= 3 && topic.readiness <= 2) {
      alerts.push(`⚠️ High-priority topic needs attention: ${topic.name}`);
    }
  });

  if (getTotalRemainingTime() > 10) {
    alerts.push("🔥 Large workload remaining — plan your time");
  }

  return alerts;
};

const getNextTopics = () => {
  return [...topics]
    .map((topic) => {
      const completion = getCompletionFraction(topic.readiness);
      const priority = topic.importance * (1 - completion);

      return {
        ...topic,
        priority
      };
    })
    .filter((t) => t.priority > 0)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3);
};
const getDaysLeft = () => {
  if (!examDate) return 0;

  const today = new Date();
  const exam = new Date(examDate);

  const diffTime = exam - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
};

    const dailyPlan = getDailyPlan();
        
    const getPressureIndex = () => {
    const remaining = getTotalRemainingTime();
    const available = dailyHours * getDaysLeft();


    if (available === 0) return 0;

    return remaining / available;
    };

const getPressureStatus = () => {
  const p = getPressureIndex();

  if (p <= 0.7) return { label: "Comfortable", color: "green" };
  if (p <= 1.0) return { label: "Tight", color: "orange" };
  return { label: "Critical", color: "red" };
};

const getCompletionForecast = () => {
  const remaining = getTotalRemainingTime();

  if (dailyHours === 0) return 0;

  return Math.ceil(remaining / dailyHours);
};

const getSuggestedDailyHours = () => {
  const remaining = getTotalRemainingTime();
  const daysLeft = getDaysLeft();

  if (daysLeft === 0) return 0;

  return Math.ceil(remaining / daysLeft);
};


const getStreakData = () => {
  const data =
    JSON.parse(localStorage.getItem(`study-streak-${user}`)) || {
      currentStreakHours: 0,
      bestStreakHours: 0,
      totalStudyHours: 0
    };

  return data;
};
useEffect(() => {
  if (examDate) {
    localStorage.setItem(
      `exam-date-${user}-${name}`,
      examDate.toISOString()
    );
  }
}, [examDate, user, name]);

useEffect(() => {
  if (user) {
    localStorage.setItem(`topics-${user}-${name}`, JSON.stringify(topics));
  }
}, [topics, name, user]);
useEffect(() => {
  if (!examDate) return;

  const interval = setInterval(() => {
    const now = new Date().getTime();
    const target = new Date(examDate).getTime();
    const distance = target - now;

    if (distance <= 0) {
      setCountdown(null);
      clearInterval(interval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (distance % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor(
      (distance % (1000 * 60)) / 1000
    );

    setCountdown({ days, hours, minutes, seconds });

  }, 1000);

  return () => clearInterval(interval);
}, [examDate]);





  return (
  <div className="page">
    <div className="subject-container">

      {/* HEADER */}
      <div className="subject-header">
        <h1>{name}</h1>
        <p className="muted">Track progress topic by topic</p>
      </div>

      {/* ALERTS */}
      {getAlerts().length > 0 && (
        <div className="alert-box">
          <h3>Alerts</h3>
          <ul>
            {getAlerts().map((alert, idx) => (
              <li key={idx}>{alert}</li>
            ))}
          </ul>
        </div>
      )}
        <div className="card exam-card">
  <h3 className="exam-title">Exam Countdown</h3>

  <div className="exam-row">
    <div className="exam-field">
      <label>Exam Date & Time</label>
      <TimePicker date={examDate} setDate={setExamDate} />
    </div>
  </div>

  {countdown && (
    <div className="countdown-grid">
      <div className="countdown-box">
        <h2>{countdown.days}</h2>
        <span>Days</span>
      </div>

      <div className="countdown-box">
        <h2>{countdown.hours}</h2>
        <span>Hours</span>
      </div>

      <div className="countdown-box">
        <h2>{countdown.minutes}</h2>
        <span>Minutes</span>
      </div>

      <div className="countdown-box">
        <h2>{countdown.seconds}</h2>
        <span>Seconds</span>
      </div>
    </div>
  )}
</div>


      {/* OVERVIEW */}
      <div className="overview-grid">
        <div className="overview-card">
          <h2>{getTotalRemainingTime()} hrs</h2>
          <p>Total remaining</p>
        </div>
        <div className="overview-card">
            <h2>{getCompletionForecast()} days</h2>
            <p>Completion Forecast</p>
        </div>

        <div className="overview-card">
          <h2>{dailyHours} hrs</h2>
          <p>Daily study target</p>
        </div>
        <div className="overview-card">
        <h2 style={{ color: getPressureStatus().color }}>
            {getPressureStatus().label}
        </h2>
        <p>Pressure Index</p>
        </div>

        <div className="overview-card">
            <h2>{getROI()}</h2>
            <p>Study ROI</p>
         </div>
         <div className="overview-card">
            <h2>{getStreakData().currentStreakHours.toFixed(1)} hrs</h2>
            <p>Current Hour Streak 🔥</p>
            <h2>{getStreakData().bestStreakHours.toFixed(1)} hrs</h2>
            <p>Best Streak 🏆</p>
        </div>
      </div>
       <div className="card heatmap-card">
            <div className="heatmap-header">
                <h3>Study Heatmap</h3>
                <p className="muted">
                Your study intensity across 24 hours
                </p>
            </div>

            <div className="heatmap-grid">
                {getHeatmapData().map((value, index) => {
                const intensity = Math.min(value / 3, 1);

                return (
                    <div
                    key={index}
                    className="heatmap-cell"
                    style={{
                        backgroundColor:
                        value === 0
                            ? "var(--surface)"
                            : `rgba(79,140,255,${intensity})`
                    }}
                    title={`${index}:00 - ${value.toFixed(1)} hrs`}
                    >
                    <span className="heatmap-hour">{index}</span>
                    </div>
                );
                })}
            </div>

            <div className="heatmap-legend">
                <span>Low</span>
                <div className="legend-bar"></div>
                <span>High</span>
            </div>
            </div>





      {/* DAILY PLAN */}
      <div className="card">
        <h3>Daily Study Plan</h3>

        <div className="planner-row">

        <div className="planner-input">
            <label>Study hours today</label>
            <input
            type="number"
            min="1"
            max="10"
            value={dailyHours}
            onChange={(e) => setDailyHours(Number(e.target.value))}
            />
        </div>
        {dailyHours < getSuggestedDailyHours() && (
        <p className="planner-warning">
            ⚠ You are planning less than required to stay on track.
        </p>
        )}

        <div className="planner-suggestion">
            <span>Suggested:</span>
            <strong>{getSuggestedDailyHours()} hrs</strong>
        </div>

        </div>
        <ul className="plan-list">
          {dailyPlan.length === 0 ? (
            <li className="muted">No study needed today 🎉</li>
          ) : (
            dailyPlan.map((item, idx) => (
              <li key={idx}>
                {item.name} — {item.time} hrs
              </li>
            ))
          )}
        </ul>
      </div>
        {/* SUGGESTED */}
        <div className="card">
        <h3>Suggested Topics</h3>
        {getNextTopics().length === 0 ? (
          <p className="muted">All topics mastered 🎉</p>
        ) : (
          <ul>
            {getNextTopics().map((topic, idx) => (
              <li key={idx}>
                {topic.name} — Priority {topic.priority.toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* ADD TOPIC */}
      <div className="card add-topic-card">
        <input
          placeholder="Add new topic"
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
        />
        <button className="primary-btn" onClick={addTopic}>
          Add Topic
        </button>
      </div>
      {/* TOPICS */}
      <div className="topics-section">
        <h3 className="section-title">Topics</h3>

        {topics.map((topic, index) => (
          <div key={index} className="topic-card">

            <div className="topic-header">
              <h4>{topic.name}</h4>
              <button
                className="delete-btn"
                onClick={() => deleteTopic(index)}
              >
                ✕
              </button>
            </div>

            <div className="topic-controls">
              <label>
                Readiness
                <select
                  value={topic.readiness}
                  onChange={(e) =>
                    updateTopic(index, "readiness", e.target.value)
                  }
                >
                  <option value={1}>Not Started</option>
                  <option value={2}>Learning</option>
                  <option value={3}>Almost Ready</option>
                  <option value={4}>Mastered</option>
                </select>
              </label>

              <label>
                Importance
                <select
                  value={topic.importance}
                  onChange={(e) =>
                    updateTopic(index, "importance", e.target.value)
                  }
                >
                  <option value={1}>Low</option>
                  <option value={2}>Medium</option>
                  <option value={3}>High</option>
                  <option value={4}>Critical</option>
                </select>
              </label>
            </div>

            <p className="muted">
              Estimated time: {estimateStudyTime(topic)} hrs
            </p>

            <div className="log-row">
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={studyHours}
                onChange={(e) => setStudyHours(Number(e.target.value))}
              />
              <button
                className="secondary-btn"
                onClick={() => logStudySession(index)}
              >
                Log Study
              </button>
            </div>

          </div>
        ))}
      </div>

      
      

    </div>
  </div>
);
}

export default Subject;
