// components/UserContext.jsx
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext({ user: null, setUser: () => { }, refreshUser: async () => { } });

export default function AuthProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser);

  const refreshUser = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/auth/me");
      const newUser = res.data?.user ?? null;
      setUser(newUser);
      return newUser;
    } catch (err) {
      console.error("refreshUser error:", err.response?.data || err.message || err);
      setUser(null);
      return null;
    }
  }, []);

  // optional: keep initialUser in sync if it changes (rare)
  useEffect(() => {
    if (!initialUser) refreshUser();
  }, [initialUser, refreshUser]);

  return <AuthContext.Provider value={{ user, setUser, refreshUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    console.log("undefined")
  }
  return ctx;
}

