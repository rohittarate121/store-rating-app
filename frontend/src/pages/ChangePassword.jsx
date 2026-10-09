import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "../styles/auth.css";
import "../styles/common.css";

export default function ChangePassword() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function goBack() {
    if (user.role === "admin") navigate("/admin");
    else if (user.role === "owner") navigate("/owner");
    else navigate("/dashboard");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.patch("/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setSuccess("Password changed successfully");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Store Rating App</h2>
        <h3>Change Password</h3>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
            <small style={{ color: "#888" }}>
              8-16 characters, one uppercase letter, one special character
            </small>
          </div>

          <div className="form-field">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>

        <p className="auth-link">
          <span
            onClick={goBack}
            style={{ cursor: "pointer", color: "#2c3e50", fontWeight: "bold" }}
          >
            ← Back to Dashboard
          </span>
        </p>
      </div>
    </div>
  );
}
