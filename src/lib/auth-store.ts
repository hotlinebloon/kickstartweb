export type DemoRole = "applicant" | "employer";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: DemoRole;
};

const AUTH_STORAGE_KEY = "kickstart_demo_user";

export function getDefaultRedirect(role: DemoRole) {
  if (role === "applicant") return "/applicant/opportunities";
  return "/employer/applicants";
}

export function getCurrentUser(): DemoUser | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as DemoUser;
  } catch {
    return null;
  }
}

export function saveCurrentUser(user: DemoUser) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function loginAs(role: DemoRole) {
  const user: DemoUser = {
    id: role === "applicant" ? "applicant-arta" : "employer-novatech",
    name: role === "applicant" ? "Arta Krasniqi" : "NovaTech Employer",
    email:
      role === "applicant"
        ? "arta@example.com"
        : "employer@novatech.test",
    role,
  };

  saveCurrentUser(user);

  return user;
}

export function registerDemoUser(input: {
  name: string;
  email: string;
  role: DemoRole;
}) {
  const user: DemoUser = {
    id: `${input.role}-${Date.now()}`,
    name: input.name,
    email: input.email,
    role: input.role,
  };

  saveCurrentUser(user);

  return user;
}

export function logout() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}