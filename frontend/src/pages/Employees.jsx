import { useState, useEffect } from "react";
import axios from "axios";
import "./Employees.css";
import EmployeeForm from "../components/EmployeeForm";

const EMP_API = "http://localhost:3000/api/employees";
const TEAM_API = "http://localhost:3000/api/teams";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(EMP_API);
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      if (error.code === "ECONNREFUSED") {
        alert(
          "Cannot connect to server. Please make sure the backend is running on port 3000"
        );
      } else if (error.response?.status === 404) {
        alert("API endpoint not found. Please check the server configuration.");
      } else {
        alert("Error loading employees. Please try again later.");
      }
      setEmployees([]);
    }
  };

  const handleEdit = (employee) => {
    setEditEmployee(employee);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${EMP_API}/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee. Please try again.");
    }
  };

  const handleSuccess = () => {
    fetchEmployees();
    setEditEmployee(null);
  };

  return (
    <div className="employees-container">
      <h2 className="employees-title">Employees Management</h2>
      <div className="employee-form-container">
        <EmployeeForm onSuccess={handleSuccess} editEmployee={editEmployee} />
      </div>
      <div className="employees-table-container">
        <table className="employees-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Designation</th>
              <th>Team</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td className="employee-name">{emp.emp_name}</td>
                <td className="employee-designation">{emp.designation}</td>
                <td className="employee-team">{emp.team_name || "No Team"}</td>
                <td>
                  <div className="employee-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(emp)}
                      aria-label="Edit employee"
                    >
                      <span className="button-text">Edit</span>
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(emp.id)}
                      aria-label="Delete employee"
                    >
                      <span className="button-text">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan="4" className="no-employees">
                  <p>No employees available. Add your first employee!</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Employees;
