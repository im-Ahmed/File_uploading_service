// API helper — reads server URL from localStorage key 'fp_server'

function getServer() {
  return (localStorage.getItem("fp_server") || "").replace(/\/$/, "");
}

function getToken() {
  return localStorage.getItem("fp_token") || null;
}

async function apiFetch(path, opts = {}) {
  const server = getServer();
  // If server is not configured, use a relative path so Vite dev proxy can forward requests.
  const url = server ? server + path : path;
  const headers = { ...(opts.headers || {}) };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Don't set Content-Type for FormData — browser sets it with boundary
  const res = await fetch(url, { ...opts, credentials: "include", headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data.message || data.error || `Request failed (${res.status})`,
    );
  }
  return data;
}

// ── Users ─────────────────────────────────────────────────────────────
export async function register(email, password, username) {
  return apiFetch("/api/v1/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username }),
  });
}

export async function login(email, password) {
  return apiFetch("/api/v1/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export async function refreshToken() {
  return apiFetch("/api/v1/users/refresh-token", {
    method: "POST",
  });
}

export async function getCurrentUser() {
  return apiFetch("/api/v1/users/current-user", {
    method: "GET",
  });
}

export async function logout() {
  return apiFetch("/api/v1/users/logout", {
    method: "GET",
  });
}

// ── Files ─────────────────────────────────────────────────────────────
export async function uploadFile(filename, file) {
  const fd = new FormData();
  fd.append("filename", filename);
  fd.append("uploaded_file", file);
  return apiFetch("/api/v1/files/upload", {
    method: "POST",
    body: fd,
  });
}

export async function getAllFiles() {
  return apiFetch("/api/v1/files/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json", // Tells server the data format
      Authorization: `Bearer ${localStorage.getItem("fp_token")}`, // Example auth header
      "X-Custom-Header": "CustomValue", // Example custom header
    },
  });
}

export async function getFileById(id) {
  return apiFetch(`/api/v1/files/${id}`, {
    method: "GET",
  });
}

export async function deleteFile(id) {
  return apiFetch(`/api/v1/files/d/${id}`, {
    method: "DELETE",
  });
}

// ── Health ─────────────────────────────────────────────────────────────
export async function healthCheck() {
  const server = getServer();
  if (!server) return false;
  try {
    const res = await fetch(server + "/api/v1/healthcheck");
    return res.ok;
  } catch {
    return false;
  }
}
