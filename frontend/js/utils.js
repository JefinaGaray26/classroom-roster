// ─── Toast Notifications ──────────────────────────────────────────────────────
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ─── Alert inside page ────────────────────────────────────────────────────────
function showAlert(id, message, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `alert alert-${type} show`;
  el.innerHTML = `<span>${type === 'error' ? '⚠️' : '✅'}</span> ${message}`;
  setTimeout(() => el.classList.remove('show'), 5000);
}

// ─── Auth Guard ───────────────────────────────────────────────────────────────
function requireAuth() {
  if (!getToken()) {
    window.location.href = '/pages/login.html';
    return false;
  }
  return true;
}

function redirectIfAuth() {
  if (getToken()) {
    window.location.href = '/pages/dashboard.html';
  }
}

// ─── Grade Helpers ────────────────────────────────────────────────────────────
function gradeClass(avg) {
  if (avg >= 90) return 'grade-excellent';
  if (avg >= 80) return 'grade-good';
  if (avg >= 75) return 'grade-average';
  return 'grade-poor';
}

function gradeLabel(avg) {
  if (avg >= 90) return 'Excellent';
  if (avg >= 80) return 'Good';
  if (avg >= 75) return 'Average';
  return 'Needs Improvement';
}

// ─── Avatar initials ──────────────────────────────────────────────────────────
function getInitials(firstName, lastName) {
  return `${(firstName || '?')[0]}${(lastName || '?')[0]}`.toUpperCase();
}

// ─── Avatar colors ────────────────────────────────────────────────────────────
const avatarColors = ['#1a3a5c', '#2d5f8a', '#e8a020', '#27ae60', '#8e44ad', '#e74c3c', '#16a085'];
function avatarColor(name) {
  let h = 0;
  for (let c of (name || '')) h = c.charCodeAt(0) + h;
  return avatarColors[h % avatarColors.length];
}

// ─── Format date ──────────────────────────────────────────────────────────────
function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// ─── Load user info into topbar ───────────────────────────────────────────────
function loadUserInfo() {
  const user = getUser();
  if (!user) return;
  const nameEl = document.getElementById('user-name');
  const avatarEl = document.getElementById('user-avatar');
  const roleEl = document.getElementById('user-role');
  if (nameEl) nameEl.textContent = user.name;
  if (avatarEl) {
    avatarEl.textContent = (user.name || 'U')[0].toUpperCase();
    avatarEl.style.background = avatarColor(user.name);
  }
  if (roleEl) roleEl.textContent = user.role || 'Teacher';
}