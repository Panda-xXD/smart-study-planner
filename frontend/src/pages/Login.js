import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false); // toggle mode
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) navigate("/dashboard");
  }, [navigate]);

  const handleSubmit = () => {
    if (!name.trim() || !password.trim()) {
      alert("Enter name and password");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (isSignup) {
      // CREATE ACCOUNT
      if (users[name]) {
        alert("User already exists");
        return;
      }

      users[name] = { password };
      localStorage.setItem("users", JSON.stringify(users));
      alert("Account created! You can login now.");
      setIsSignup(false);
      return;
    } else {
      // LOGIN
      if (!users[name]) {
        alert("User does not exist. Create an account.");
        return;
      }

      if (users[name].password !== password) {
        alert("Incorrect password");
        return;
      }

      localStorage.setItem("user", name);
      navigate("/dashboard");
    }
  };

  return (
    <div className="modern-login">

      {/* HERO SECTION */}
      <section className="hero">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          StudyFlow
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Smarter exam preparation powered by behavioral analytics.
        </motion.p>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        {[
          "Track your readiness",
          "ML Completion Forecast",
          "Adaptive Planning"
        ].map((item, i) => (
          <motion.div
            key={i}
            className="feature-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            viewport={{ once: true }}
          >
            {item}
          </motion.div>
        ))}
      </section>

      {/* LOGIN / SIGNUP SECTION */}
      <section className="login-section">
        <motion.div
          className="login-glass"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>{isSignup ? "Create Account" : "Login"}</h2>

          <input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="primary-btn" onClick={handleSubmit}>
            {isSignup ? "Create Account" : "Login"}
          </button>

          <p
            style={{
              marginTop: 15,
              cursor: "pointer",
              fontSize: 13,
              color: "#9aa4b2"
            }}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Create one"}
          </p>

        </motion.div>
      </section>

    </div>
  );
}

export default Login;
