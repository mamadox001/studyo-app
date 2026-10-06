// Studyo Auth & Cloudflare D1 Sync Service
// 100% Free Edge Cloud Storage + Local-First Fallback

const AUTH_STORAGE_KEYS = {
  USER: 'studyo_auth_user_v1',
  TOKEN: 'studyo_auth_token_v1',
  LOCAL_USERS: 'studyo_mock_cloud_users_v1',
  LAST_SYNC: 'studyo_last_sync_timestamp_v1'
};

class AuthService {
  constructor() {
    this.currentUser = this.loadUser();
    this.token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN) || null;
    this.listeners = new Set();
    this.isSyncing = false;
  }

  loadUser() {
    const raw = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  getUser() {
    return this.currentUser;
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return !!this.currentUser && !!this.token;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach(cb => cb(this.currentUser));
  }

  // Verify current session with Cloudflare or local storage
  async checkMe() {
    if (!this.token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          this.currentUser = data.user;
          localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(data.user));
          this.notify();
        }
      } else if (res.status === 401) {
        this.logout();
      }
    } catch {
      // Offline fallback: keep current user from localStorage
    }
  }

  // ==========================================
  // Register Account (Email + Password)
  // ==========================================
  async register(email, password, displayName = '') {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = displayName.trim() || cleanEmail.split('@')[0];

    try {
      // 1. Attempt Cloudflare Pages API
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password, displayName: cleanName })
      });

      // If Cloudflare endpoint handled it
      if (res.status === 201 || res.status === 200) {
        const data = await res.json();
        this.setSession(data.user, data.token);
        return { success: true, user: data.user, cloudMode: true };
      } else if (res.status !== 404) {
        // Real Cloudflare error (e.g. 409 user exists or 400 invalid)
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Registration failed.');
      }
    } catch (err) {
      if (!err.message?.includes('Failed to fetch') && !err.message?.includes('404')) {
        throw err;
      }
    }

    // 2. Local Fallback (for local development before Cloudflare deployment)
    const localUsers = this.getLocalUsers();
    if (localUsers.find(u => u.email === cleanEmail)) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const salt = Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b => b.toString(16)).join('');
    const fakeHash = await this.hashLocalPassword(password, salt);
    const newUser = {
      id: 'usr_' + Date.now().toString(36),
      email: cleanEmail,
      displayName: cleanName,
      passwordHash: fakeHash,
      salt,
      createdAt: new Date().toISOString()
    };

    localUsers.push(newUser);
    localStorage.setItem(AUTH_STORAGE_KEYS.LOCAL_USERS, JSON.stringify(localUsers));

    const token = 'local_jwt_' + btoa(JSON.stringify({ userId: newUser.id, email: cleanEmail }));
    const publicUser = { id: newUser.id, email: newUser.email, displayName: newUser.displayName };
    this.setSession(publicUser, token);

    return { success: true, user: publicUser, cloudMode: false };
  }

  // ==========================================
  // Login Account (Email + Password)
  // ==========================================
  async login(email, password) {
    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Attempt Cloudflare Pages API
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });

      if (res.ok) {
        const data = await res.json();
        this.setSession(data.user, data.token);
        return { success: true, user: data.user, cloudMode: true };
      } else if (res.status !== 404) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Invalid email or password.');
      }
    } catch (err) {
      if (!err.message?.includes('Failed to fetch') && !err.message?.includes('404')) {
        throw err;
      }
    }

    // 2. Local Fallback (for local development)
    const localUsers = this.getLocalUsers();
    const user = localUsers.find(u => u.email === cleanEmail);
    if (!user) {
      throw new Error('No account found with this email. Please register first.');
    }

    const computedHash = await this.hashLocalPassword(password, user.salt);
    if (computedHash !== user.passwordHash) {
      throw new Error('Incorrect password. Please try again.');
    }

    const token = 'local_jwt_' + btoa(JSON.stringify({ userId: user.id, email: cleanEmail }));
    const publicUser = { id: user.id, email: user.email, displayName: user.displayName };
    this.setSession(publicUser, token);

    return { success: true, user: publicUser, cloudMode: false };
  }

  // ==========================================
  // Logout
  // ==========================================
  logout() {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    this.notify();
  }

  // ==========================================
  // Sync Study Progress to Cloudflare D1
  // ==========================================
  async syncToCloud(payload) {
    if (!this.isAuthenticated() || this.isSyncing) return;
    this.isSyncing = true;

    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        localStorage.setItem(AUTH_STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
      }
    } catch (e) {
      // Graceful offline ignore
    } finally {
      this.isSyncing = false;
    }
  }

  // Set active session
  setSession(user, token) {
    this.currentUser = user;
    this.token = token;
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
    this.notify();
  }

  // Local helper for development hashing
  getLocalUsers() {
    try {
      return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEYS.LOCAL_USERS) || '[]');
    } catch {
      return [];
    }
  }

  async hashLocalPassword(password, salt) {
    const enc = new TextEncoder();
    const data = enc.encode(password + ':' + salt);
    const hashBuf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

export const authService = new AuthService();
