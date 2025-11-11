// src/app/dashboard/hooks/useUserRole.tsx
"use client";
import { useEffect, useState } from "react";


export const useUserRole = () => {
  const [role, setRole] = useState<string>("user"); // default 'user'
  const [username, setUsername] = useState<string>("Guest");

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setRole("guest");
        return;
      }
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Payload:", payload);
      setUsername((payload?.email as string) || "Guest");
      setRole((payload?.role as string) || "user");
    } catch (err) {
      setRole("user");
    }
  }, []);

  return {role,username};
};
