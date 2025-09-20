import { useState, useEffect } from "react";
import axios from "axios";
import "./EmployeeForm.css";

const EMP_API = "http://localhost:3000/api/employees";
const TEAM_API = "http://localhost:3000/api/teams";

const EmployeeForm = ({ onSuccess, editEmployee }) => {
  const [empName, setEmpName] = useState("");
  const [designation, setDesignation] = useState("");
  const [teamId, setTeamId] = useState("");
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchTeams();
    if (editEmployee) {
      setEmpName(editEmployee.emp_name);
      setDesignation(editEmployee.designation);
      setTeamId(editEmployee.team_id || "");
    }
  }, [editEmployee]);

  const fetchTeams = async () => {
    const res = await axios.get(TEAM_API);
    setTeams(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        emp_name: empName,
        designation,
        team_id: teamId || null,
      };

      if (editEmployee) {
        await axios.put(`${EMP_API}/${editEmployee.id}`, payload);
      } else {
        await axios.post(EMP_API, payload);
      }

      setEmpName("");
      setDesignation("");
      setTeamId("");
      onSuccess(); // refresh list
    } catch (err) {
      console.error("Error saving employee:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <h3>{editEmployee ? "Edit Employee" : "Add Employee"}</h3>

      <div className="form-group">
        <label htmlFor="empName" className="form-label">
          Employee Name
        </label>
        <input
          id="empName"
          type="text"
          className="form-input"
          placeholder="Enter employee name"
          value={empName}
          onChange={(e) => setEmpName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="designation" className="form-label">
          Designation
        </label>
        <input
          id="designation"
          type="text"
          className="form-input"
          placeholder="Enter designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="team" className="form-label">
          Team
        </label>
        <select
          id="team"
          className="form-select"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
        >
          <option value="">Select a team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className={`form-submit-btn ${editEmployee ? "update" : ""}`}
      >
        {editEmployee ? "Update" : "Add"} Employee
      </button>
    </form>
  );
};

export default EmployeeForm;
