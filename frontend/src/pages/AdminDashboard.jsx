import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "../styles/common.css";
import "../styles/admin.css";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  // Users state
  const [users, setUsers] = useState([]);
  const [userFilters, setUserFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [userSort, setUserSort] = useState({ sortBy: "name", order: "ASC" });

  // Stores state
  const [stores, setStores] = useState([]);
  const [storeFilters, setStoreFilters] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [storeSort, setStoreSort] = useState({ sortBy: "name", order: "ASC" });

  // Owners dropdown
  const [owners, setOwners] = useState([]);

  // Modal state
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form state
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });
  const [storeForm, setStoreForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch {
      console.error("Failed to fetch stats");
    }
  }, []);

  const fetchOwners = useCallback(async () => {
    try {
      const res = await api.get("/admin/users", { params: { role: "owner" } });
      setOwners(res.data);
    } catch {
      console.error("Failed to fetch owners");
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get("/admin/users", {
        params: { ...userFilters, ...userSort },
      });
      setUsers(res.data);
    } catch {
      console.error("Failed to fetch users");
    }
  }, [userFilters, userSort]);

  const fetchStores = useCallback(async () => {
    try {
      const res = await api.get("/admin/stores", {
        params: { ...storeFilters, ...storeSort },
      });
      setStores(res.data);
    } catch {
      console.error("Failed to fetch stores");
    }
  }, [storeFilters, storeSort]);

  async function fetchUserDetail(id) {
    try {
      const res = await api.get(`/admin/users/${id}`);
      setSelectedUser(res.data);
    } catch {
      console.error("Failed to fetch user detail");
    }
  }

  useEffect(() => {
    fetchStats();
    fetchOwners();
  }, [fetchStats, fetchOwners]);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
  }, [userFilters, userSort, activeTab, fetchUsers]);

  useEffect(() => {
    if (activeTab === "stores") fetchStores();
  }, [storeFilters, storeSort, activeTab, fetchStores]);

  function handleUserSort(field) {
    setUserSort((prev) => ({
      sortBy: field,
      order: prev.sortBy === field && prev.order === "ASC" ? "DESC" : "ASC",
    }));
  }

  function handleStoreSort(field) {
    setStoreSort((prev) => ({
      sortBy: field,
      order: prev.sortBy === field && prev.order === "ASC" ? "DESC" : "ASC",
    }));
  }

  function sortArrow(currentSort, field) {
    if (currentSort.sortBy !== field) return "";
    return currentSort.order === "ASC" ? " ▲" : " ▼";
  }

  async function handleAddUser(e) {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    try {
      await api.post("/admin/users", userForm);
      setFormSuccess("User created successfully");
      setUserForm({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user",
      });
      fetchUsers();
      fetchStats();
      fetchOwners();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create user");
    }
  }

  async function handleAddStore(e) {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    try {
      await api.post("/admin/stores", storeForm);
      setFormSuccess("Store created successfully");
      setStoreForm({ name: "", email: "", address: "", ownerId: "" });
      fetchStores();
      fetchStats();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create store");
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
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalStores}</h3>
            <p>Total Stores</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalRatings}</h3>
            <p>Total Ratings</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={`tab-btn ${activeTab === "stores" ? "active" : ""}`}
            onClick={() => setActiveTab("stores")}
          >
            Stores
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <div className="section-header">
              <h3>Users</h3>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowAddUser(true);
                  setFormError("");
                  setFormSuccess("");
                }}
              >
                + Add User
              </button>
            </div>

            {/* User Filters */}
            <div className="search-bar">
              <input
                placeholder="Search by name..."
                value={userFilters.name}
                onChange={(e) =>
                  setUserFilters({ ...userFilters, name: e.target.value })
                }
              />
              <input
                placeholder="Search by email..."
                value={userFilters.email}
                onChange={(e) =>
                  setUserFilters({ ...userFilters, email: e.target.value })
                }
              />
              <input
                placeholder="Search by address..."
                value={userFilters.address}
                onChange={(e) =>
                  setUserFilters({ ...userFilters, address: e.target.value })
                }
              />
              <select
                value={userFilters.role}
                onChange={(e) =>
                  setUserFilters({ ...userFilters, role: e.target.value })
                }
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="owner">Owner</option>
              </select>
            </div>

            {/* Users Table */}
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleUserSort("name")}>
                    Name {sortArrow(userSort, "name")}
                  </th>
                  <th onClick={() => handleUserSort("email")}>
                    Email {sortArrow(userSort, "email")}
                  </th>
                  <th>Address</th>
                  <th onClick={() => handleUserSort("role")}>
                    Role {sortArrow(userSort, "role")}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", padding: "1rem" }}
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.address || "-"}</td>
                      <td>
                        <span className={`badge badge-${u.role}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-small"
                          onClick={() => fetchUserDetail(u.id)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Stores Tab */}
        {activeTab === "stores" && (
          <div>
            <div className="section-header">
              <h3>Stores</h3>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowAddStore(true);
                  setFormError("");
                  setFormSuccess("");
                }}
              >
                + Add Store
              </button>
            </div>

            {/* Store Filters */}
            <div className="search-bar">
              <input
                placeholder="Search by name..."
                value={storeFilters.name}
                onChange={(e) =>
                  setStoreFilters({ ...storeFilters, name: e.target.value })
                }
              />
              <input
                placeholder="Search by email..."
                value={storeFilters.email}
                onChange={(e) =>
                  setStoreFilters({ ...storeFilters, email: e.target.value })
                }
              />
              <input
                placeholder="Search by address..."
                value={storeFilters.address}
                onChange={(e) =>
                  setStoreFilters({ ...storeFilters, address: e.target.value })
                }
              />
            </div>

            {/* Stores Table */}
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleStoreSort("name")}>
                    Name {sortArrow(storeSort, "name")}
                  </th>
                  <th onClick={() => handleStoreSort("email")}>
                    Email {sortArrow(storeSort, "email")}
                  </th>
                  <th>Address</th>
                  <th>Owner</th>
                  <th>Avg Rating</th>
                </tr>
              </thead>
              <tbody>
                {stores.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", padding: "1rem" }}
                    >
                      No stores found
                    </td>
                  </tr>
                ) : (
                  stores.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.email}</td>
                      <td>{s.address || "-"}</td>
                      <td>{s.owner ? s.owner.name : "-"}</td>
                      <td>
                        {s.averageRating
                          ? `${s.averageRating} / 5`
                          : "No ratings"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="modal-overlay" onClick={() => setShowAddUser(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add New User</h3>
            {formError && <p className="error-message">{formError}</p>}
            {formSuccess && <p className="success-message">{formSuccess}</p>}
            <form onSubmit={handleAddUser}>
              <div className="form-field">
                <label>Full Name (20-60 characters)</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({ ...userForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-field">
                <label>Password</label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) =>
                    setUserForm({ ...userForm, password: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-field">
                <label>Address</label>
                <input
                  type="text"
                  value={userForm.address}
                  onChange={(e) =>
                    setUserForm({ ...userForm, address: e.target.value })
                  }
                />
              </div>
              <div className="form-field">
                <label>Role</label>
                <select
                  value={userForm.role}
                  onChange={(e) =>
                    setUserForm({ ...userForm, role: e.target.value })
                  }
                >
                  <option value="user">Normal User</option>
                  <option value="owner">Store Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowAddUser(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Store Modal */}
      {showAddStore && (
        <div className="modal-overlay" onClick={() => setShowAddStore(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Store</h3>
            {formError && <p className="error-message">{formError}</p>}
            {formSuccess && <p className="success-message">{formSuccess}</p>}
            <form onSubmit={handleAddStore}>
              <div className="form-field">
                <label>Store Name (20-60 characters)</label>
                <input
                  type="text"
                  value={storeForm.name}
                  onChange={(e) =>
                    setStoreForm({ ...storeForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  value={storeForm.email}
                  onChange={(e) =>
                    setStoreForm({ ...storeForm, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-field">
                <label>Address</label>
                <input
                  type="text"
                  value={storeForm.address}
                  onChange={(e) =>
                    setStoreForm({ ...storeForm, address: e.target.value })
                  }
                />
              </div>
              <div className="form-field">
                <label>Store Owner (optional)</label>
                <select
                  value={storeForm.ownerId}
                  onChange={(e) =>
                    setStoreForm({ ...storeForm, ownerId: e.target.value })
                  }
                >
                  <option value="">No owner assigned</option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowAddStore(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>User Details</h3>
            <div className="detail-modal-row">
              <span>Name:</span>
              <span>{selectedUser.name}</span>
            </div>
            <div className="detail-modal-row">
              <span>Email:</span>
              <span>{selectedUser.email}</span>
            </div>
            <div className="detail-modal-row">
              <span>Address:</span>
              <span>{selectedUser.address || "-"}</span>
            </div>
            <div className="detail-modal-row">
              <span>Role:</span>
              <span>
                <span className={`badge badge-${selectedUser.role}`}>
                  {selectedUser.role}
                </span>
              </span>
            </div>
            {selectedUser.role === "owner" && (
              <div className="detail-modal-row">
                <span>Store Rating:</span>
                <span>
                  {selectedUser.storeRating
                    ? `${selectedUser.storeRating} / 5`
                    : "No ratings yet"}
                </span>
              </div>
            )}
            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
