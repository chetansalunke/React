import { useState, useEffect } from "react";
import axios from "axios";
import TeamForm from "../components/TeamForm";

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
    <div style={{ padding: "20px" }}>
      <h2>Teams</h2>
      <div style={{ marginBottom: "20px" }}>
        <TeamForm onSuccess={handleSuccess} editTeam={editTeam} />
      </div>
      <div className="teams-list">
        {teams.map((team) => (
          <div
            key={team.id}
            style={{
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>{team.name}</strong> - {team.description}
            </div>
            <div>
              <button
                onClick={() => handleEdit(team)}
                style={{ marginRight: "5px" }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(team.id)}
                style={{ backgroundColor: "#ff4444", color: "white" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Teams;
