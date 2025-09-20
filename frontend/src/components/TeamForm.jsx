import { useState, useEffect } from "react";
import axios from "axios";
import "./TeamForm.css";

const API = "http://localhost:3000/api/teams";

// Configure axios defaults for the API
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.post["Content-Type"] = "application/json";

const TeamForm = ({ onSuccess, editTeam }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editTeam) {
      setName(editTeam.name);
      setDescription(editTeam.description);
    }
  }, [editTeam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { name, description };
      if (editTeam) {
        await axios.put(`${API}/${editTeam.id}`, payload);
      } else {
        await axios.post(API, payload);
      }
      setName("");
      setDescription("");
      if (typeof onSuccess === "function") {
        onSuccess(); // refresh list
      }
    } catch (error) {
      console.error("Error saving team:", error);
      alert("Failed to save team. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="team-form">
      <h3>{editTeam ? "Edit Team" : "Add Team"}</h3>

      <div className="form-group">
        <label htmlFor="teamName" className="form-label">
          Team Name
        </label>
        <input
          id="teamName"
          type="text"
          className="form-input"
          placeholder="Enter team name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <input
          id="description"
          type="text"
          className="form-input"
          placeholder="Enter team description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className={`form-submit-btn ${editTeam ? "update" : ""}`}
      >
        {editTeam ? "Update" : "Add"} Team
      </button>
    </form>
  );
};

export default TeamForm;
