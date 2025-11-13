// utils/isAuthenticated.js

"use client"

import { useAuth } from "../../app/UserContext";

export function isAuthenticated() {
  const { user } = useAuth();
  return !!user;
}
