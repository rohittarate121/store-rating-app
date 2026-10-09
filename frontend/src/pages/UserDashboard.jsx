import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "../styles/common.css";
import "../styles/user.css";

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchStores();
  }, [filters]);

  async function fetchStores() {
    setLoading(true);
    try {
      const res = await api.get("/stores", { params: filters });
      setStores(res.data);
    } catch (err) {
      console.error("Failed to fetch stores");
    } finally {
      setLoading(false);
    }
  }

  function showMessage(text, type) {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  }

  async function handleSubmitRating(storeId) {
    const rating = selectedRatings[storeId];
    if (!rating) {
      showMessage("Please select a rating first", "error");
      return;
    }

    try {
      await api.post("/ratings", { storeId, rating });
      showMessage("Rating submitted successfully", "success");
      setSelectedRatings({ ...selectedRatings, [storeId]: null });
      fetchStores();
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Failed to submit rating",
        "error",
      );
    }
  }

  async function handleUpdateRating(storeId, ratingId) {
    const rating = selectedRatings[storeId];
    if (!rating) {
      showMessage("Please select a new rating first", "error");
      return;
    }

    try {
      await api.patch(`/ratings/${ratingId}`, { rating });
      showMessage("Rating updated successfully", "success");
      setSelectedRatings({ ...selectedRatings, [storeId]: null });
      fetchStores();
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Failed to update rating",
        "error",
      );
    }
  }

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

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
        <h3 style={{ marginBottom: "1rem", color: "#2c3e50" }}>All Stores</h3>

        {/* Global message */}
        {message.text && (
          <p
            className={
              message.type === "error" ? "error-message" : "success-message"
            }
          >
            {message.text}
          </p>
        )}

        {/* Search */}
        <div className="search-bar">
          <input
            placeholder="Search by store name..."
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
          <input
            placeholder="Search by address..."
            value={filters.address}
            onChange={(e) =>
              setFilters({ ...filters, address: e.target.value })
            }
          />
          <button
            className="btn btn-primary"
            onClick={() => setFilters({ name: "", address: "" })}
          >
            Clear
          </button>
        </div>

        {/* Store Cards */}
        {loading ? (
          <p>Loading stores...</p>
        ) : stores.length === 0 ? (
          <p className="no-stores">No stores found</p>
        ) : (
          <div className="stores-grid">
            {stores.map((store) => (
              <div key={store.id} className="store-card">
                <h4>{store.name}</h4>
                <p>{store.address || "No address provided"}</p>

                <div className="store-rating-info">
                  <span>
                    Overall:{" "}
                    <strong>
                      {store.averageRating
                        ? `${store.averageRating} / 5`
                        : "No ratings yet"}
                    </strong>
                  </span>
                  <span>
                    Your rating:{" "}
                    <strong>
                      {store.myRating ? `${store.myRating} / 5` : "Not rated"}
                    </strong>
                  </span>
                </div>

                {/* Rating selector */}
                <div className="rating-selector">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      className={`rating-star ${selectedRatings[store.id] === num ? "selected" : ""}`}
                      onClick={() =>
                        setSelectedRatings({
                          ...selectedRatings,
                          [store.id]: num,
                        })
                      }
                    >
                      {num}
                    </button>
                  ))}
                </div>

                {/* Submit or Update button */}
                {store.myRating ? (
                  <button
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                    onClick={() =>
                      handleUpdateRating(store.id, store.myRatingId)
                    }
                  >
                    Update Rating
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                    onClick={() => handleSubmitRating(store.id)}
                  >
                    Submit Rating
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
