import { useState, useEffect } from "react";
import axios from "axios";
import TeamForm from "../components/TeamForm";
import "./Teams.css";

const API = "http://localhost:3000/api/teams";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [editTeam, setEditTeam] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await axios.get(API);
      setTeams(res.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
      if (error.code === "ECONNREFUSED") {
        alert(
          "Cannot connect to server. Please make sure the backend is running on port 3000"
        );
      } else if (error.response?.status === 404) {
        alert("API endpoint not found. Please check the server configuration.");
      } else {
        alert("Error loading teams. Please try again later.");
      }
      setTeams([]);
    }
  };

  const handleEdit = (team) => {
    setEditTeam(team);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchTeams();
    } catch (error) {
      console.error("Error deleting team:", error);
      alert("Failed to delete team. Please try again.");
    }
  };

  const handleSuccess = () => {
    fetchTeams();
    setEditTeam(null);
  };

  return (
    <div className="teams-container">
      <h2 className="teams-title">Teams Management</h2>
      <div className="team-form-container">
        <TeamForm onSuccess={handleSuccess} editTeam={editTeam} />
      </div>
      <div className="teams-list-container">
        <div className="teams-header">
          <div className="header-name">Team Name</div>
          <div className="header-description">Description</div>
          <div className="header-actions">Actions</div>
        </div>
        {teams.map((team) => (
          <div key={team.id} className="team-list-item">
            <div className="team-name">{team.name}</div>
            <div className="team-description">{team.description}</div>
            <div className="team-actions">
              <button
                className="edit-button"
                onClick={() => handleEdit(team)}
                aria-label="Edit team"
              >
                <span className="button-text">Edit</span>
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(team.id)}
                aria-label="Delete team"
              >
                <span className="button-text">Delete</span>
              </button>
            </div>
          </div>
        ))}
        {teams.length === 0 && (
          <div className="no-teams">
            <p>No teams available. Create your first team!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Teams;
