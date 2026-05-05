"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function SelectRole() {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState("");

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  const saveRole = async () => {
    if (!user) {
      alert("User not loaded");
      return;
    }

    await fetch("http://localhost:5000/save-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clerk_user_id: user.id,
        name: user.firstName || "User",
        role,
      }),
    });

    alert("Role saved!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Select Role</h1>

      <p>User: {user?.firstName}</p>

      <select onChange={(e) => setRole(e.target.value)}>
        <option value="">Select</option>
        <option value="student">Student</option>
        <option value="trainer">Trainer</option>
        <option value="institution">Institution</option>
      </select>

      <br /><br />

      <button onClick={saveRole}>Save</button>
    </div>
  );
}