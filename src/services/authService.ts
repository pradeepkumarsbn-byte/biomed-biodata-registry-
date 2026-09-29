export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'Administrator' | 'Individual';
  profileId?: string; // Linked profile ID for Individual role
  lastLogin: string;
}

export interface StoredCredential {
  id: string;
  email: string;
  username: string;
  password: string;
  pin: string;
  name: string;
  role: 'Administrator' | 'Individual';
  profileId?: string;
}

const AUTH_STORAGE_KEY = 'biomed_auth_user_v1';
const CREDS_STORAGE_KEY = 'biomed_auth_credentials_v2';

const DEFAULT_ACCOUNTS: StoredCredential[] = [
  {
    id: 'usr-admin',
    email: 'admin@biomed.org',
    username: 'admin',
    password: 'admin',
    pin: '1234',
    name: 'Administrator',
    role: 'Administrator',
  },
  {
    id: 'usr-pradeep',
    email: 'your-pradeepkumar.sbn@gmail.com',
    username: 'pradeep',
    password: 'user123',
    pin: '1111',
    name: 'Pradeep Kumar',
    role: 'Individual',
    profileId: 'bio-pradeep-kumar',
  }
];

export const authService = {
  getAccounts(): StoredCredential[] {
    try {
      const data = localStorage.getItem(CREDS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(CREDS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
        return DEFAULT_ACCOUNTS;
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ACCOUNTS;
    } catch {
      return DEFAULT_ACCOUNTS;
    }
  },

  saveAccounts(accounts: StoredCredential[]): void {
    try {
      localStorage.setItem(CREDS_STORAGE_KEY, JSON.stringify(accounts));
    } catch (err) {
      console.error('Failed to save accounts:', err);
    }
  },

  getCurrentUser(): AuthUser | null {
    try {
      const local = localStorage.getItem(AUTH_STORAGE_KEY);
      if (local) return JSON.parse(local);

      const session = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (session) return JSON.parse(session);

      return null;
    } catch {
      return null;
    }
  },

  login(identifier: string, secret: string, remember: boolean): { success: boolean; error?: string; user?: AuthUser } {
    const accounts = this.getAccounts();
    const cleanId = identifier.trim().toLowerCase();
    const cleanSecret = secret.trim();

    // Find matching account by email or username, and check password or PIN
    const match = accounts.find(acc => {
      const idMatch = acc.email.toLowerCase() === cleanId || acc.username.toLowerCase() === cleanId;
      const passMatch = acc.password === cleanSecret;
      const pinMatch = acc.pin === cleanSecret || (cleanId === acc.pin);
      return (idMatch && passMatch) || pinMatch;
    });

    if (match) {
      const user: AuthUser = {
        id: match.id,
        email: match.email,
        name: match.name,
        role: match.role,
        profileId: match.profileId,
        lastLogin: new Date().toISOString(),
      };

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

      return { success: true, user };
    }

    return { 
      success: false, 
      error: 'Invalid credentials. Please verify your username/email, password, or PIN.' 
    };
  },

  register(name: string, email: string, password: string, pin: string = '1234', profileId?: string): { success: boolean; error?: string; user?: AuthUser } {
    const accounts = this.getAccounts();
    const cleanEmail = email.trim().toLowerCase();

    if (accounts.some(a => a.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const username = cleanEmail.split('@')[0] || `user_${Date.now()}`;
    const newCred: StoredCredential = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      username,
      password: password.trim(),
      pin: pin.trim() || '1234',
      name: name.trim(),
      role: 'Individual',
      profileId,
    };

    accounts.push(newCred);
    this.saveAccounts(accounts);

    const user: AuthUser = {
      id: newCred.id,
      email: newCred.email,
      name: newCred.name,
      role: newCred.role,
      profileId: newCred.profileId,
      lastLogin: new Date().toISOString(),
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return { success: true, user };
  },

  logout(): void {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (err) {
      console.error('Error logging out:', err);
    }
  },

  changeCredentials(newEmail: string, newPassword: string, newPin?: string, newName?: string): { success: boolean; error?: string } {
    try {
      const accounts = this.getAccounts();
      const current = this.getCurrentUser();
      if (!current) return { success: false, error: 'Not logged in' };

      const idx = accounts.findIndex(a => a.id === current.id || a.email.toLowerCase() === current.email.toLowerCase());
      if (idx >= 0) {
        accounts[idx].email = newEmail.trim() || accounts[idx].email;
        accounts[idx].password = newPassword.trim() || accounts[idx].password;
        accounts[idx].pin = newPin?.trim() || accounts[idx].pin;
        accounts[idx].name = newName?.trim() || accounts[idx].name;
        this.saveAccounts(accounts);

        // Update active session
        current.email = accounts[idx].email;
        current.name = accounts[idx].name;
        if (localStorage.getItem(AUTH_STORAGE_KEY)) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(current));
        } else {
          sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(current));
        }

        return { success: true };
      }

      return { success: false, error: 'Account not found' };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update credentials' };
    }
  },

  resetPasswordWithPin(identifier: string, pin: string, newPassword: string): { success: boolean; error?: string; message?: string } {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPin = pin.trim();
    const cleanPass = newPassword.trim();

    if (!cleanId) return { success: false, error: 'Please enter your username or email address.' };
    if (!cleanPin) return { success: false, error: 'Please enter your 4-digit security PIN.' };
    if (!cleanPass) return { success: false, error: 'Please enter your new password.' };
    if (cleanPass.length < 4) return { success: false, error: 'Password must be at least 4 characters long.' };

    const accounts = this.getAccounts();
    const match = accounts.find(a => 
      a.email.toLowerCase() === cleanId || 
      a.username.toLowerCase() === cleanId
    );

    if (!match) {
      return { 
        success: false, 
        error: `No account found with username or email "${identifier}". Please verify your credentials or register a personal account.` 
      };
    }

    if (match.pin !== cleanPin) {
      return { 
        success: false, 
        error: 'Incorrect 4-digit security PIN for this account. Please try again.' 
      };
    }

    // Update password
    match.password = cleanPass;
    this.saveAccounts(accounts);

    return { 
      success: true, 
      message: `Password for ${match.name} (${match.email}) updated successfully! You can now sign in with your new password.` 
    };
  },

  syncAccountsFromCloud(remoteAccounts: StoredCredential[]): void {
    try {
      if (!Array.isArray(remoteAccounts) || remoteAccounts.length === 0) return;
      const localAccounts = this.getAccounts();
      const map = new Map<string, StoredCredential>();
      for (const a of localAccounts) {
        if (a && a.id) map.set(a.id, a);
      }
      for (const ra of remoteAccounts) {
        if (!ra || !ra.email) continue;
        const key = ra.id || ra.email.toLowerCase();
        if (!map.has(key)) {
          map.set(key, ra);
        }
      }
      const merged = Array.from(map.values());
      this.saveAccounts(merged);
    } catch (err) {
      console.warn('Error syncing accounts from cloud:', err);
    }
  },

  resetDefaultAccounts(): void {
    localStorage.setItem(CREDS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
  },

  getStoredCredentials(user?: AuthUser): StoredCredential {
    const accounts = this.getAccounts();
    if (user) {
      const match = accounts.find(a => a.id === user.id || a.email.toLowerCase() === user.email.toLowerCase());
      if (match) return match;
    }
    const current = this.getCurrentUser();
    if (current) {
      const match = accounts.find(a => a.id === current.id || a.email.toLowerCase() === current.email.toLowerCase());
      if (match) return match;
    }
    return accounts[0] || DEFAULT_ACCOUNTS[0];
  },

  resetDefaultCredentials(): void {
    this.resetDefaultAccounts();
  }
};

