"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function Student() {
  const { user } = useUser();
  const [sessions, setSessions] = useState([]);
  const [dbUser, setDbUser] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/get-user/${user.id}`)
        .then((res) => res.json())
        .then((data) => setDbUser(data));
    }

    fetch("http://localhost:5000/sessions")
      .then((res) => res.json())
      .then((data) => setSessions(data));
  }, [user]);

  const markAttendance = async (sessionId: number) => {
    await fetch("http://localhost:5000/mark-attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "clerk-id": user?.id || "",
      },
      body: JSON.stringify({
        session_id: sessionId,
        student_id: dbUser?.id,
      }),
    });

    alert("Attendance marked!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Student Dashboard 🎓</h1>

      {sessions.map((s: any) => (
        <div key={s.id}>
          <p>{s.title} - {s.date}</p>
          <button onClick={() => markAttendance(s.id)}>
            Mark Attendance
          </button>
        </div>
      ))}
    </div>
  );
}