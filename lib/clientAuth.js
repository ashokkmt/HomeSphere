// lib/clientAuth.js (client-side)
export async function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export async function setAccessToken(token) {
  localStorage.setItem("accessToken", token);
}

export async function clearAccessToken() {
  localStorage.removeItem("accessToken");
}

// call API with automatic refresh on 401 due to expired access token
export async function fetchWithAuth(url, options = {}) {
  let token = await getAccessToken();
  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");
  let res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    // try refresh token
    const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });
    if (!refreshRes.ok) {
      // refresh failed -> user must sign in again
      await clearAccessToken();
      return res;
    }
    const data = await refreshRes.json();
    await setAccessToken(data.accessToken);
    // retry original request with new token
    headers.set("Authorization", `Bearer ${data.accessToken}`);
    res = await fetch(url, { ...options, headers });
  }

  return res;
}
