
const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

const pool = require("./db");
const checkRole = require("./middleware/checkRole");

    
app.get("/test-db", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows);
});

app.get("/test-users", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});



app.post("/save-user", async (req, res) => {
  const { clerk_user_id, name, role } = req.body;

  await pool.query(
    "INSERT INTO users (clerk_user_id, name, role) VALUES ($1,$2,$3)",
    [clerk_user_id, name, role]
  );

  res.send("User saved");
});

app.get("/get-user/:clerkId", async (req, res) => {
  const { clerkId } = req.params;

  const result = await pool.query(
    "SELECT * FROM users WHERE clerk_user_id = $1",
    [clerkId]
  );

  res.json(result.rows[0]);
});

app.post("/create-session", checkRole(["trainer"]), async (req, res) => {
  const { title, batch_id, trainer_id, date } = req.body;

  await pool.query(
    "INSERT INTO sessions (title, batch_id, trainer_id, date) VALUES ($1,$2,$3,$4)",
    [title, batch_id, trainer_id, date]
  );

  res.send("Session created");
});

app.get("/sessions", async (req, res) => {
  const result = await pool.query("SELECT * FROM sessions ORDER BY id DESC");
  res.json(result.rows);
});

app.post("/mark-attendance", checkRole(["student"]), async (req, res) => {
  const { session_id, student_id } = req.body;

  await pool.query(
    "INSERT INTO attendance (session_id, student_id, status) VALUES ($1,$2,$3)",
    [session_id, student_id, "present"]
  );

  res.send("Attendance marked");
});

app.get("/session-attendance/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  const result = await pool.query(
    "SELECT * FROM attendance WHERE session_id = $1",
    [sessionId]
  );

  res.json(result.rows);
});


