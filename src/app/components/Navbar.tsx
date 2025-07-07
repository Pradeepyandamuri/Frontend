"use client";

import { getUser, logout } from "./../utils/auth";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 border border-gray-300 bg-gray-100 shadow-sm rounded-md mb-6">

      <div className="flex items-center">
        <img src="/TaskSchedulerLogo1.png" alt="Logo" className="h-20 w-40 object-contain hover:scale-105 transition-transform duration-300"/>
        <span className="text-2xl font-extrabold text-black">Task Scheduler</span>
      </div>

      {user ? (
        <div className="flex gap-4 items-center">
          <span className="text-gray-700 font-medium">Hello, {user.name}</span>
          <button
            onClick={logout}
            className="text-sm font-medium text-white bg-red-600 px-4 py-1 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="space-x-3">
          <Link
            href="/login"
            className="text-sm font-medium text-blue-600 border border-blue-600 px-4 py-1 rounded hover:bg-blue-600 hover:text-white transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium text-white bg-blue-600 px-4 py-1 rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
