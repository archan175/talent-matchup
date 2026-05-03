import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export type UserRole = "freelancer" | "recruiter";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
};

const USERS_KEY = "eruka_users";
const SESSION_KEY = "eruka_session";
const PROFILE_KEY = "eruka_profile";

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

export async function fetchRegisteredUsers(): Promise<AuthUser[]> {
  if (!isSupabaseConfigured || !supabase) return getRegisteredUsers();

  const { data, error } = await supabase
    .from("profiles")
    .select("id,name,email,role")
    .order("created_at", { ascending: false });

  if (error || !data) return getRegisteredUsers();

  return data.map((profile) => ({
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
  }));
}

function saveRegisteredUsers(users: AuthUser[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveCurrentUser(user: AuthUser) {
  if (!isBrowser()) return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(user));
  window.localStorage.setItem(SESSION_KEY, user.email.trim().toLowerCase());
}

export async function signUpUser(newUser: AuthUser) {
  if (isSupabaseConfigured && supabase) {
    const normalizedEmail = newUser.email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: newUser.password || "",
      options: {
        data: {
          name: newUser.name,
          role: newUser.role,
        },
      },
    });

    if (error) {
      return { ok: false as const, message: error.message };
    }

    const authUser = data.user;
    if (!authUser) {
      return { ok: false as const, message: "Could not create account." };
    }

    const profile: AuthUser = {
      id: authUser.id,
      name: newUser.name,
      email: normalizedEmail,
      role: newUser.role,
    };

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
    });

    if (profileError && data.session) {
      return { ok: false as const, message: profileError.message };
    }

    saveCurrentUser(profile);
    return { ok: true as const };
  }

  const users = getRegisteredUsers();
  const normalizedEmail = newUser.email.trim().toLowerCase();
  const existing = users.find((user) => user.email.toLowerCase() === normalizedEmail);

  if (existing) {
    return { ok: false as const, message: "An account with this email already exists." };
  }

  const userToStore: AuthUser = {
    ...newUser,
    id: newUser.id || `user-${Date.now()}`,
    email: normalizedEmail,
  };

  saveRegisteredUsers([...users, userToStore]);
  setSession(userToStore.email);
  return { ok: true as const };
}

export async function loginUser(email: string, password: string) {
  if (isSupabaseConfigured && supabase) {
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      return { ok: false as const, message: error.message };
    }

    const authUser = data.user;
    if (!authUser) {
      return { ok: false as const, message: "Invalid email or password." };
    }

    const { data: profileRow } = await supabase
      .from("profiles")
      .select("id,name,email,role")
      .eq("id", authUser.id)
      .single();

    saveCurrentUser({
      id: authUser.id,
      name: profileRow?.name || authUser.user_metadata?.name || normalizedEmail,
      email: profileRow?.email || normalizedEmail,
      role: profileRow?.role || authUser.user_metadata?.role || "freelancer",
    });

    return { ok: true as const };
  }

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
  if (supabase) {
    void supabase.auth.signOut();
  }
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem(PROFILE_KEY);
}

export function getCurrentUser(): AuthUser | null {
  if (!isBrowser()) return null;

  const rawProfile = window.localStorage.getItem(PROFILE_KEY);
  if (rawProfile) {
    try {
      return JSON.parse(rawProfile) as AuthUser;
    } catch {
      window.localStorage.removeItem(PROFILE_KEY);
    }
  }

  const currentEmail = window.localStorage.getItem(SESSION_KEY);
  if (!currentEmail) return null;

  const users = getRegisteredUsers();
  return users.find((user) => user.email.toLowerCase() === currentEmail.toLowerCase()) ?? null;
}
