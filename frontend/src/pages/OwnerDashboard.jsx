import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "../styles/common.css";
import "../styles/owner.css";

export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const res = await api.get("/owner/dashboard");
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;
  if (error) return <p style={{ padding: "2rem", color: "red" }}>{error}</p>;

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <h2>Store Rating App</h2>
        <div className="navbar-links">
          <span>Welcome, {user?.name?.split(" ")[0]}</span>
          <Link to="/change-password">Change Password</Link>
          <button className="btn btn-danger btn-small" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="page-container">
        <h3 style={{ marginBottom: "1rem", color: "#2c3e50" }}>
          {data.store.name}
        </h3>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          {data.store.address}
        </p>

        {/* Store Stats */}
        <div className="owner-store-info">
          <div className="owner-stat-card">
            <h3>{data.averageRating ? data.averageRating : "N/A"}</h3>
            <p>Average Rating</p>
          </div>
          <div className="owner-stat-card">
            <h3>{data.totalRatings}</h3>
            <p>Total Ratings</p>
          </div>
          <div className="owner-stat-card">
            <h3>{data.store.email}</h3>
            <p>Store Email</p>
          </div>
        </div>

        {/* Ratings Table */}
        <div className="section-header">
          <h3>Users Who Rated Your Store</h3>
        </div>

        {data.ratings.length === 0 ? (
          <p style={{ color: "#888", marginTop: "1rem" }}>
            No ratings submitted yet
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Submitted On</th>
              </tr>
            </thead>
            <tbody>
              {data.ratings.map((r) => (
                <tr key={r.id}>
                  <td>{r.user.name}</td>
                  <td>{r.user.email}</td>
                  <td>{r.rating} / 5</td>
                  <td>{new Date(r.submittedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
