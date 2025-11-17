'use client';
import { useState } from "react";
import { loginUser } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.access_token);
      setMessage("Login successful!");
      
      switch (data.role) {
      case 1:
        router.push("/dashboard/admin");
        break;
      case 2:
        router.push("/dashboard/manager");
        break;
      case 3:
        router.push("/dashboard/se");
        break;
      case 4:
        router.push("/dashboard/ssm");
        break;
      case 5:
        router.push("/dashboard/nbd");
        break;
      case 6:
        router.push("/dashboard/hr");
        break;
      case 7:
        router.push("/dashboard/purchase")
        break;
      default:
        router.push("/");
    }
    } catch {
      setMessage("Invalid credentials.");
    }
  }

  return (
    <div style={{ padding: 40 }} className="flex flex-col mx-auto items-center justify-center w-[40%] h-screen">
      <div className=" flex flex-col p-8 bg-blue-100 rounded-2xl shadow-lg w-80 items-center">
        <h1 className="mb-4 font-bold">BIOPHAR LIFESCIENCES</h1>
        <h2 className="mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="p-2 rounded border-1" /><br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="p-2 rounded border-1"/><br />
          <button type="submit">Login</button>
        </form>
        {message && <p className={`p-2 mt-2 ${(message==="Invalid credentials.")?"bg-red-500":"bg-green-500"} text-white`}>{message}</p>}
      </div>
    </div>
  );
}
