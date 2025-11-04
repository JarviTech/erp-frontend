'use client';
import { useState } from "react";
import { registerUser } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState(Number);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await registerUser(email, name, password, role);
      setMessage("User registered successfully!");
      router.push("/login");
    } catch {
      setMessage("Error registering user.");
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" /><br />
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" /><br />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" /><br />
        <input value={role} onChange={e => setRole(Number(e.target.value))} placeholder="Role" /><br />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
