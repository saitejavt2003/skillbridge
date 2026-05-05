"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function Trainer() {
  const { user } = useUser();
  const [dbUser, setDbUser] = useState<any>(null);

  const [sessions, setSessions] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  // Fetch logged-in user from DB
  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/get-user/${user.id}`)
        .then((res) => res.json())
        .then((data) => setDbUser(data));
    }
  }, [user]);

  // Fetch sessions
  useEffect(() => {
    fetch("http://localhost:5000/sessions")
      .then((res) => res.json())
      .then((data) => setSessions(data));
  }, []);

  // Create session
  const createSession = async () => {
    await fetch("http://localhost:5000/create-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "clerk-id": user?.id || "",
      },
      body: JSON.stringify({
        title,
        date,
        batch_id: 1,
        trainer_id: dbUser?.id, // ✅ REAL USER
      }),
    });

    alert("Session created!");
  };

  // View attendance
  const viewAttendance = async (sessionId: number) => {
    const res = await fetch(
      `http://localhost:5000/session-attendance/${sessionId}`
    );
    const data = await res.json();
    setAttendance(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Trainer Dashboard 👨‍🏫</h1>

      <h2>Create Session</h2>
      <input
        placeholder="Session title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />
      <input type="date" onChange={(e) => setDate(e.target.value)} />
      <br /><br />
      <button onClick={createSession}>Create</button>

      <h2>Your Sessions</h2>

      {sessions.map((s: any) => (
        <div key={s.id} style={{ marginBottom: 10 }}>
          <p>{s.title} - {s.date}</p>
          <button onClick={() => viewAttendance(s.id)}>
            View Attendance
          </button>
        </div>
      ))}

      <h2>Attendance Data</h2>

      {attendance.map((a: any) => (
        <p key={a.id}>
          Student ID: {a.student_id} | Status: {a.status}
        </p>
      ))}
    </div>
  );
}