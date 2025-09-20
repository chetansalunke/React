import { useState, useEffect } from 'react';
import axios from 'axios';

const EMP_API = 'http://localhost:3000/api/employees';
const TEAM_API = 'http://localhost:3000/api/teams';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [emp_name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [team_id, setTeamId] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchEmployees();
    fetchTeams();
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.get(EMP_API);
    setEmployees(res.data);
  };

  const fetchTeams = async () => {
    const res = await axios.get(TEAM_API);
    setTeams(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${EMP_API}/${editId}`, { emp_name, designation, team_id });
      setEditId(null);
    } else {
      await axios.post(EMP_API, { emp_name, designation, team_id });
    }
    setName('');
    setDesignation('');
    setTeamId('');
    fetchEmployees();
  };

  const handleEdit = (emp) => {
    setName(emp.emp_name);
    setDesignation(emp.designation);
    setTeamId(emp.team_id);
    setEditId(emp.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${EMP_API}/${id}`);
    fetchEmployees();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Employees</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          placeholder="Employee Name"
          value={emp_name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          required
        />
        <select value={team_id} onChange={(e) => setTeamId(e.target.value)} required>
          <option value="">Select Team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
        <button type="submit">{editId ? 'Update' : 'Add'} Employee</button>
      </form>
      <ul>
        {employees.map((emp) => (
          <li key={emp.id}>
            <strong>{emp.emp_name}</strong> - {emp.designation} (
              {emp.team_name || 'No Team'})
            <button onClick={() => handleEdit(emp)}>Edit</button>
            <button onClick={() => handleDelete(emp.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Employees;
