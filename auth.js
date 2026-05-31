/**
 * Smartcodai - Authentication & Authorization Module
 * Handles user registration, login, session management, and admin course unlocking.
 * Data is stored in localStorage (client-side only).
 */

const AUTH = (() => {
  const USERS_KEY = 'smartcodai_users';
  const SESSION_KEY = 'smartcodai_session';
  const ADMIN_EMAIL = 'admin@smartcodai.com';

  // ── Helpers ──────────────────────────────────────────────

  function _getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch { return []; }
  }

  function _saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function _hash(password) {
    // Simple hash for demo purposes. In production, use bcrypt on a server.
    let hash = 0;
    const str = 'sc_salt_' + password + '_2026';
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'h_' + Math.abs(hash).toString(36);
  }

  function _generateId() {
    return 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  // ── User Registration ────────────────────────────────────

  /**
   * Register a new user.
   * @param {string} name  - Full name
   * @param {string} email - Email address
   * @param {string} password - Password (min 6 chars)
   * @returns {{ success: boolean, error?: string, user?: object }}
   */
  function register(name, email, password) {
    if (!name || !email || !password) {
      return { success: false, error: 'Tous les champs sont requis.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Le mot de passe doit contenir au moins 6 caracteres.' };
    }
    const emailLower = email.trim().toLowerCase();
    const users = _getUsers();
    if (users.find(u => u.email === emailLower)) {
      return { success: false, error: 'Un compte avec cet email existe deja.' };
    }

    const user = {
      id: _generateId(),
      name: name.trim(),
      email: emailLower,
      password: _hash(password),
      unlockedCourses: [],  // ['php', 'python', 'n8n', 'openclaw']
      createdAt: new Date().toISOString(),
      role: emailLower === ADMIN_EMAIL ? 'admin' : 'user'
    };

    users.push(user);
    _saveUsers(users);

    // Auto-login after registration
    _createSession(user);
    return { success: true, user: _sanitize(user) };
  }

  // ── User Login ───────────────────────────────────────────

  /**
   * Login with email and password.
   * @returns {{ success: boolean, error?: string, user?: object }}
   */
  function login(email, password) {
    if (!email || !password) {
      return { success: false, error: 'Email et mot de passe requis.' };
    }
    const emailLower = email.trim().toLowerCase();
    const users = _getUsers();
    const user = users.find(u => u.email === emailLower && u.password === _hash(password));
    if (!user) {
      return { success: false, error: 'Email ou mot de passe incorrect.' };
    }
    _createSession(user);
    return { success: true, user: _sanitize(user) };
  }

  // ── Session Management ───────────────────────────────────

  function _createSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      userId: user.id,
      loginAt: new Date().toISOString()
    }));
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
  }

  /**
   * Get the currently logged-in user.
   * @returns {object|null} Sanitized user object or null.
   */
  function getCurrentUser() {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY));
      if (!session || !session.userId) return null;
      const users = _getUsers();
      const user = users.find(u => u.id === session.userId);
      return user ? _sanitize(user) : null;
    } catch { return null; }
  }

  function isLoggedIn() {
    return getCurrentUser() !== null;
  }

  /**
   * Redirect to login if not authenticated. Call this at the top of protected pages.
   */
  function requireAuth() {
    if (!isLoggedIn()) {
      window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
    }
  }

  // ── Admin Checks ─────────────────────────────────────────

  function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
  }

  function requireAdmin() {
    if (!isLoggedIn()) {
      window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }
    if (!isAdmin()) {
      window.location.href = 'dashboard.html';
    }
  }

  // ── Course Unlocking (Admin) ─────────────────────────────

  /**
   * Unlock a course for a specific user.
   * @param {string} userId  - The user's ID
   * @param {string} course  - Course slug: 'php', 'python', 'n8n', 'openclaw'
   */
  function unlockCourse(userId, course) {
    const users = _getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return { success: false, error: 'Utilisateur introuvable.' };
    if (!user.unlockedCourses) user.unlockedCourses = [];
    if (!user.unlockedCourses.includes(course)) {
      user.unlockedCourses.push(course);
    }
    _saveUsers(users);
    return { success: true };
  }

  /**
   * Lock a course for a specific user.
   */
  function lockCourse(userId, course) {
    const users = _getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return { success: false, error: 'Utilisateur introuvable.' };
    user.unlockedCourses = (user.unlockedCourses || []).filter(c => c !== course);
    _saveUsers(users);
    return { success: true };
  }

  /**
   * Check if the current user has access to a course.
   */
  function hasAccess(course) {
    const user = getCurrentUser();
    if (!user) return false;
    if (user.role === 'admin') return true;
    return (user.unlockedCourses || []).includes(course);
  }

  /**
   * Get all users (admin only).
   */
  function getAllUsers() {
    return _getUsers().map(_sanitize);
  }

  /**
   * Get a single user by ID (admin only).
   */
  function getUserById(userId) {
    const users = _getUsers();
    const user = users.find(u => u.id === userId);
    return user ? _sanitize(user) : null;
  }

  // ── Internal ─────────────────────────────────────────────

  function _sanitize(user) {
    const { password, ...safe } = user;
    return safe;
  }

  // ── Public API ───────────────────────────────────────────

  return {
    register,
    login,
    logout,
    getCurrentUser,
    isLoggedIn,
    requireAuth,
    isAdmin,
    requireAdmin,
    unlockCourse,
    lockCourse,
    hasAccess,
    getAllUsers,
    getUserById,
    ADMIN_EMAIL
  };
})();
