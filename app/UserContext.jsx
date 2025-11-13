// components/UserContext.jsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({ user: null, setUser: () => { } });

export default function AuthProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser);

  // optional: keep initialUser in sync if it changes (rare)
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    console.log("undefined")
  }
  return ctx;
}

