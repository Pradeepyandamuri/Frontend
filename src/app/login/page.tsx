"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token); 
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");
    } else {
      alert(data.message || "Login failed");
    }
  };
  const handleRedirect=()=>{
    router.push('/signup')
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Log In
        </button>
        If you don't have account please <button type="button" onClick={handleRedirect}
        className="bg-blue-600 text-white px-2 rounded"
        >SignUp</button>
      </form>
    </div>
  );
}
