const db = require("../config/db");


exports.createTeam = async (req, res) => {
  try {
    
    console.log("Creating team with:", {
      name: req.body.name,
      description: req.body.description,
      contentType: req.headers["content-type"],
    });

    
    if (!req.body.name) {
      return res.status(400).json({ message: "Team name is required" });
    }

   
    const [result] = await db.execute(
      "INSERT INTO teams (name, description) VALUES (?, ?)",
      [req.body.name || null, req.body.description || null]
    );

   
    res.status(201).json({
      id: result.insertId,
      name: req.body.name,
      description: req.body.description,
      message: "Team created successfully",
    });
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({
      message: "Failed to create team",
      error: error.message,
    });
  }
};


exports.getAllTeams = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM teams");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch teams" });
  }
};


exports.getTeamById = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM teams WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Team not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch team" });
  }
};


exports.updateTeam = async (req, res) => {
  try {
    await db.execute(
      "UPDATE teams SET name = ?, description = ? WHERE id = ?",
      [req.body.name, req.body.description, req.params.id]
    );
    res.json({ message: "Team updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update team" });
  }
};


exports.deleteTeam = async (req, res) => {
  try {
    await db.execute("DELETE FROM teams WHERE id = ?", [req.params.id]);
    res.json({ message: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete team" });
  }
};
