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

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getCurrentUser(): DemoUser | null {
  if (!canUseStorage()) return null;

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as DemoUser;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function saveCurrentUser(user: DemoUser) {
  if (!canUseStorage()) return;

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function loginAs(role: DemoRole) {
  const user: DemoUser =
    role === "applicant"
      ? {
          id: "applicant-demo",
          name: "Arta Krasniqi",
          email: "arta@example.com",
          role: "applicant",
        }
      : {
          id: "employer-demo",
          name: "NovaTech Employer",
          email: "employer@novatech.com",
          role: "employer",
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
    name:
      input.name.trim() ||
      (input.role === "applicant" ? "Demo Applicant" : "Demo Employer"),
    email: input.email.trim() || "demo@kickstart.local",
    role: input.role,
  };

  saveCurrentUser(user);

  return user;
}

export function logout() {
  if (!canUseStorage()) return;

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}