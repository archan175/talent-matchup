export type UserRole = "freelancer" | "recruiter";

export type AuthUser = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

const USERS_KEY = "eruka_users";
const SESSION_KEY = "eruka_session";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getRegisteredUsers(): AuthUser[] {
  if (!isBrowser()) return [];

  const rawUsers = window.localStorage.getItem(USERS_KEY);
  if (!rawUsers) return [];

  try {
    return JSON.parse(rawUsers) as AuthUser[];
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users: AuthUser[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function signUpUser(newUser: AuthUser) {
  const users = getRegisteredUsers();
  const normalizedEmail = newUser.email.trim().toLowerCase();
  const existing = users.find((user) => user.email.toLowerCase() === normalizedEmail);

  if (existing) {
    return { ok: false as const, message: "An account with this email already exists." };
  }

  const userToStore: AuthUser = {
    ...newUser,
    email: normalizedEmail,
  };

  saveRegisteredUsers([...users, userToStore]);
  setSession(userToStore.email);
  return { ok: true as const };
}

export function loginUser(email: string, password: string) {
  const users = getRegisteredUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const match = users.find(
    (user) => user.email.toLowerCase() === normalizedEmail && user.password === password,
  );

  if (!match) {
    return { ok: false as const, message: "Invalid email or password." };
  }

  setSession(match.email);
  return { ok: true as const };
}

export function setSession(email: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem(SESSION_KEY, email.trim().toLowerCase());
}

export function logoutUser() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): AuthUser | null {
  if (!isBrowser()) return null;

  const currentEmail = window.localStorage.getItem(SESSION_KEY);
  if (!currentEmail) return null;

  const users = getRegisteredUsers();
  return users.find((user) => user.email.toLowerCase() === currentEmail.toLowerCase()) ?? null;
}
