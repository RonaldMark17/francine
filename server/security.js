import crypto from 'crypto';

// ==========================================
// PASSWORD HASHING & VERIFICATION (scrypt)
// ==========================================

/**
 * Hashes a plaintext password using scrypt with a unique cryptographically random salt.
 * @param {string} password - Plaintext password
 * @returns {string} Formatted hash string: "scrypt$<salt>$<hash>"
 */
export function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

/**
 * Verifies a plaintext password against a stored scrypt hash string using timing-safe comparison.
 * Supports legacy plaintext migration fallback.
 * @param {string} password - Plaintext password to test
 * @param {string} storedHash - Stored hash or legacy plaintext
 * @returns {{ match: boolean, needsUpgrade: boolean }}
 */
export function verifyPassword(password, storedHash) {
  if (!password || !storedHash) {
    return { match: false, needsUpgrade: false };
  }

  // Handle scrypt formatted hash: scrypt$<salt>$<hexKey>
  if (storedHash.startsWith('scrypt$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 3) {
      return { match: false, needsUpgrade: false };
    }
    const salt = parts[1];
    const expectedKeyHex = parts[2];

    try {
      const derivedKey = crypto.scryptSync(password, salt, 64);
      const expectedKey = Buffer.from(expectedKeyHex, 'hex');

      if (derivedKey.length !== expectedKey.length) {
        return { match: false, needsUpgrade: false };
      }

      // Timing-safe comparison prevents timing side-channel attacks
      const match = crypto.timingSafeEqual(derivedKey, expectedKey);
      return { match, needsUpgrade: false };
    } catch (err) {
      console.error('Password verification error:', err);
      return { match: false, needsUpgrade: false };
    }
  }

  // Legacy plaintext fallback (for backwards-compatibility during migration)
  if (password === storedHash) {
    return { match: true, needsUpgrade: true };
  }

  return { match: false, needsUpgrade: false };
}

/**
 * Sanitizes a user object by removing the password hash before returning to clients.
 * @param {object} user
 * @returns {object} Safe user profile
 */
export function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

// ==========================================
// SESSION & TOKEN UTILITIES
// ==========================================

/**
 * Generates a cryptographically strong 256-bit random auth/session token.
 */
export function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// ==========================================
// BRUTE-FORCE RATE LIMITER
// ==========================================
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 3 * 60 * 1000; // 3 minutes

export function checkRateLimit(key) {
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record) return { allowed: true };

  if (record.lockedUntil && now < record.lockedUntil) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { 
      allowed: false, 
      message: `Too many failed login attempts. Account temporarily locked for security. Try again in ${remainingSeconds} seconds.` 
    };
  }

  // Reset if window expired
  if (now - record.firstAttempt > LOCKOUT_MS) {
    loginAttempts.delete(key);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedLogin(key) {
  const now = Date.now();
  const record = loginAttempts.get(key) || { count: 0, firstAttempt: now };
  record.count += 1;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
  }

  loginAttempts.set(key, record);
}

export function clearFailedLogin(key) {
  loginAttempts.delete(key);
}

// ==========================================
// PASSWORD POLICY & VALIDATION
// ==========================================
export function validatePasswordPolicy(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required and must be text.' };
  }
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long.' };
  }
  if (password.length > 128) {
    return { valid: false, message: 'Password cannot exceed 128 characters.' };
  }
  return { valid: true };
}

// ==========================================
// INPUT SANITIZATION & ESCAPING
// ==========================================
export function sanitizeString(str, maxLength = 255) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength);
}

export function sanitizeEmail(email) {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase().slice(0, 100);
}

// ==========================================
// SECURITY AUDIT LOG EVENT TYPES
// ==========================================
export const SECURITY_EVENTS = {
  LOGIN_SUCCESS: 'AUTH_LOGIN_SUCCESS',
  LOGIN_FAILURE: 'AUTH_LOGIN_FAILURE',
  ACCOUNT_LOCKED: 'AUTH_ACCOUNT_LOCKED',
  USER_REGISTERED: 'AUTH_USER_REGISTERED',
  USER_LOGOUT: 'AUTH_USER_LOGOUT',
  PASSWORD_CHANGED: 'AUTH_PASSWORD_CHANGED',
  PASSWORD_UPGRADED: 'AUTH_PASSWORD_UPGRADED_SCRYPT',
  ORDER_PLACED: 'STORE_ORDER_PLACED',
  ORDER_STATUS_CHANGED: 'STORE_ORDER_STATUS_CHANGED',
  STOCK_ADJUSTED: 'STORE_STOCK_ADJUSTED',
  DATABASE_RESET: 'ADMIN_DATABASE_RESET'
};
