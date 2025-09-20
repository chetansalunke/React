import { useState, useEffect } from "react";
import axios from "axios";

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
    <form onSubmit={handleSubmit}>
      <h3>{editEmployee ? "Edit Employee" : "Add Employee"}</h3>
      <input
        type="text"
        placeholder="Name"
        value={empName}
        onChange={(e) => setEmpName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Designation"
        value={designation}
        onChange={(e) => setDesignation(e.target.value)}
        required
      />
      <select value={teamId} onChange={(e) => setTeamId(e.target.value)}>
        <option value="">Select Team</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
      <button type="submit">{editEmployee ? "Update" : "Add"} Employee</button>
    </form>
  );
};

export default EmployeeForm;
