// ─── API Configuration ────────────────────────────────────────────────────────
const API_BASE = '/api';

// ─── Token Management ─────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem('cr_token');
const setToken = (t) => localStorage.setItem('cr_token', t);
const removeToken = () => localStorage.removeItem('cr_token');

const getUser = () => {
  const u = localStorage.getItem('cr_user');
  return u ? JSON.parse(u) : null;
};
const setUser = (u) => localStorage.setItem('cr_user', JSON.stringify(u));
const removeUser = () => localStorage.removeItem('cr_user');

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers }
  });

  const data = await res.json();

  if (res.status === 401) {
    removeToken();
    removeUser();
    window.location.href = '/pages/login.html';
    return;
  }

  return { ok: res.ok, status: res.status, data };
}

// ─── Auth API ─────────────────────────────────────────────────────────────────
const Auth = {
  login: (email, password) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  signup: (name, email, password) =>
    apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

  me: () => apiFetch('/auth/me'),

  logout: () => {
    removeToken();
    removeUser();
    window.location.href = '/pages/login.html';
  }
};

// ─── Students API ─────────────────────────────────────────────────────────────
const Students = {
  getAll: (params = '') => apiFetch(`/students${params}`),
  getById: (id) => apiFetch(`/students/${id}`),
  create: (data) => apiFetch('/students', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/students/${id}`, { method: 'DELETE' }),
  getStats: () => apiFetch('/students/stats/summary'),
  search: (q) => apiFetch(`/students?search=${encodeURIComponent(q)}`)
};

// ─── Attendance API ───────────────────────────────────────────────────────────
const Attendance = {
  getAll: (params = '') => apiFetch(`/attendance${params}`),
  create: (data) => apiFetch('/attendance', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/attendance/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/attendance/${id}`, { method: 'DELETE' }),
  getStudentSummary: (studentId) => apiFetch(`/attendance/summary/${studentId}`)
};