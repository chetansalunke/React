const db = require("../config/db");


exports.createEmployee = async (req, res) => {
  try {
    const { emp_name, designation, team_id } = req.body;

   
    if (!emp_name) {
      return res.status(400).json({ message: "Employee name is required" });
    }


    const [result] = await db.execute(
      "INSERT INTO employees (emp_name, designation, team_id) VALUES (?, ?, ?)",
      [emp_name, designation || null, team_id || null]
    );


    res.status(201).json({
      id: result.insertId,
      emp_name,
      designation,
      team_id,
      message: "Employee created successfully",
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ message: "Failed to create employee" });
  }
};


exports.getAllEmployees = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        e.id,
        e.emp_name,
        e.designation,
        e.team_id,
        t.name as team_name
      FROM employees e
      LEFT JOIN teams t ON e.team_id = t.id
      ORDER BY e.id DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};


exports.getEmployeeById = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `
      SELECT 
        e.id,
        e.emp_name,
        e.designation,
        e.team_id,
        t.name as team_name
      FROM employees e
      LEFT JOIN teams t ON e.team_id = t.id
      WHERE e.id = ?
    `,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ message: "Failed to fetch employee" });
  }
};


exports.updateEmployee = async (req, res) => {
  try {
    const { emp_name, designation, team_id } = req.body;

    if (!emp_name) {
      return res.status(400).json({ message: "Employee name is required" });
    }

    
    const [existing] = await db.execute(
      "SELECT id FROM employees WHERE id = ?",
      [req.params.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }


    await db.execute(
      "UPDATE employees SET emp_name = ?, designation = ?, team_id = ? WHERE id = ?",
      [emp_name, designation || null, team_id || null, req.params.id]
    );

    res.json({ message: "Employee updated successfully" });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "Failed to update employee" });
  }
};


exports.deleteEmployee = async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM employees WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Failed to delete employee" });
  }
};
