export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "shortlisted"
  | "accepted"
  | "rejected";

export type TaskStatus =
  | "havent_started"
  | "working_on_it"
  | "needs_review"
  | "completed";

export type TaskPriority = "low" | "medium" | "high";

export type ApplicantProfile = {
  id: string;
  fullName: string;
  email: string;
  education: string;
  school: string;
  location: string;
  skills: string[];
  bio: string;
  cvName: string;
  githubUrl: string;
  portfolioUrl: string;
};

export type Company = {
  id: string;
  name: string;
  industry: string;
  location: string;
  description: string;
};

export type Opportunity = {
  id: string;
  title: string;
  companyId: string;
  type: "Internship" | "Micro-project" | "Entry-level";
  location: string;
  workMode: "Remote" | "Hybrid" | "On-site";
  deadline: string;
  skills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  questions: string[];
  scenarioTask: string;
  proofRequirement: string;
};

export type Application = {
  id: string;
  opportunityId: string;
  applicantId: string;
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  applicantSnapshot: ApplicantProfile;
  answers: { question: string; answer: string }[];
  scenarioResponse: string;
  proofUrl: string;
  employerNote?: string;
};

export type Placement = {
  id: string;
  applicationId: string;
  applicantId: string;
  companyId: string;
  opportunityId: string;
  roleTitle: string;
  managerName: string;
  startDate: string;
  status: "active";
};

export type GrowthTask = {
  id: string;
  placementId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  latestUpdate?: string;
  submissionLink?: string;
  feedbackComment?: string;
  rating?: number;
  completedAt?: string;
};

export type DemoState = {
  applicant: ApplicantProfile;
  company: Company;
  opportunities: Opportunity[];
  applications: Application[];
  placements: Placement[];
  tasks: GrowthTask[];
};

const STORAGE_KEY = "kickstart_11_step_demo_state";

function todayPlus(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function uid(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createInitialState(): DemoState {
  return {
    applicant: {
      id: "applicant-arta",
      fullName: "Arta Krasniqi",
      email: "arta@example.com",
      education: "High school student",
      school: "Don Bosko Prishtina",
      location: "Prishtina, Kosovo",
      skills: ["React", "CSS", "GitHub", "Communication"],
      bio: "Motivated student looking for a first real internship where she can prove herself through project work, feedback, and visible progress.",
      cvName: "arta-krasniqi-cv.pdf",
      githubUrl: "https://github.com/arta-demo",
      portfolioUrl: "https://arta-demo.dev",
    },
    company: {
      id: "company-novatech",
      name: "NovaTech",
      industry: "Software / Startup",
      location: "Prishtina, Kosovo",
      description:
        "NovaTech is a small software company looking for beginner-friendly interns who can learn fast and submit proof of work.",
    },
    opportunities: [
      {
        id: "opp-frontend-intern",
        title: "Frontend Intern",
        companyId: "company-novatech",
        type: "Internship",
        location: "Prishtina",
        workMode: "Hybrid",
        deadline: todayPlus(14),
        skills: ["React", "CSS", "GitHub"],
        description:
          "Help build simple landing page sections and dashboard UI while learning how a real product team works.",
        responsibilities: [
          "Build small React components",
          "Submit work through GitHub links",
          "Write weekly progress updates",
          "Use feedback to improve the next version",
        ],
        requirements: [
          "Basic React or HTML/CSS knowledge",
          "Willingness to learn",
          "Some proof of previous work, even if it is a school project",
        ],
        questions: [
          "Why are you interested in this internship?",
          "What project have you built before?",
          "What skill do you want to improve during this internship?",
        ],
        scenarioTask:
          "Explain how you would structure a simple landing page hero section for a startup website.",
        proofRequirement:
          "Add a GitHub, portfolio, website, document, or school project link.",
      },
      {
        id: "opp-data-assistant",
        title: "Junior Data Assistant",
        companyId: "company-novatech",
        type: "Micro-project",
        location: "Remote",
        workMode: "Remote",
        deadline: todayPlus(20),
        skills: ["Excel", "Python", "Data cleaning"],
        description:
          "Clean small datasets and prepare simple summaries for internal reports.",
        responsibilities: ["Clean CSV files", "Write short summaries", "Prepare charts"],
        requirements: ["Basic spreadsheet skills", "Careful attention to detail"],
        questions: [
          "Why are you interested in data work?",
          "What tool have you used for spreadsheets or analysis?",
          "How would you check if a dataset has mistakes?",
        ],
        scenarioTask:
          "Describe how you would clean a spreadsheet with missing values and duplicated rows.",
        proofRequirement: "Add a spreadsheet, notebook, GitHub, or report link.",
      },
    ],
    applications: [],
    placements: [],
    tasks: [],
  };
}

export function getState(): DemoState {
  if (typeof window === "undefined") return createInitialState();

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = createInitialState();
    saveState(initial);
    return initial;
  }

  try {
    return JSON.parse(raw) as DemoState;
  } catch {
    const initial = createInitialState();
    saveState(initial);
    return initial;
  }
}

export function saveState(state: DemoState) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

export function resetState() {
  const state = createInitialState();
  saveState(state);
  return state;
}

export function submitFocusedApply(input: {
  opportunityId: string;
  answers: { question: string; answer: string }[];
  scenarioResponse: string;
  proofUrl: string;
}): DemoState {
  const state = getState();
  const opportunity = state.opportunities.find((item) => item.id === input.opportunityId);
  if (!opportunity) return state;

  const existing = state.applications.find(
    (item) => item.opportunityId === input.opportunityId && item.applicantId === state.applicant.id
  );

  const now = new Date().toISOString();
  const application: Application = {
    id: existing?.id ?? uid("application"),
    opportunityId: input.opportunityId,
    applicantId: state.applicant.id,
    status: "submitted",
    submittedAt: existing?.submittedAt ?? now,
    updatedAt: now,
    applicantSnapshot: state.applicant,
    answers: input.answers,
    scenarioResponse: input.scenarioResponse,
    proofUrl: input.proofUrl,
  };

  const next: DemoState = {
    ...state,
    applications: [application, ...state.applications.filter((item) => item.id !== application.id)],
  };

  saveState(next);
  return next;
}

export function updateApplication(input: {
  applicationId: string;
  status: ApplicationStatus;
  employerNote?: string;
}): DemoState {
  const state = getState();
  const now = new Date().toISOString();

  const applications = state.applications.map((application) =>
    application.id === input.applicationId
      ? {
          ...application,
          status: input.status,
          updatedAt: now,
          employerNote: input.employerNote ?? application.employerNote,
        }
      : application
  );

  let next: DemoState = { ...state, applications };

  if (input.status === "accepted") {
    next = createPlacementAndStarterTasks(next, input.applicationId);
  }

  saveState(next);
  return next;
}

function createPlacementAndStarterTasks(state: DemoState, applicationId: string): DemoState {
  const application = state.applications.find((item) => item.id === applicationId);
  if (!application) return state;

  const opportunity = state.opportunities.find((item) => item.id === application.opportunityId);
  if (!opportunity) return state;

  const existingPlacement = state.placements.find((item) => item.applicationId === applicationId);
  if (existingPlacement) return state;

  const placementId = uid("placement");
  const placement: Placement = {
    id: placementId,
    applicationId,
    applicantId: application.applicantId,
    companyId: opportunity.companyId,
    opportunityId: opportunity.id,
    roleTitle: opportunity.title,
    managerName: "Dren from NovaTech",
    startDate: new Date().toISOString(),
    status: "active",
  };

  const starterTasks: GrowthTask[] = [
    {
      id: uid("task"),
      placementId,
      title: "Complete onboarding checklist",
      description: "Read the company workflow and write a short summary of what you understood.",
      priority: "medium",
      status: "havent_started",
      dueDate: todayPlus(3),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uid("task"),
      placementId,
      title: "Build first landing page section",
      description: "Create a simple responsive hero section and submit a GitHub or screenshot link.",
      priority: "high",
      status: "havent_started",
      dueDate: todayPlus(7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uid("task"),
      placementId,
      title: "Submit first progress update",
      description: "Write what you worked on, what blocked you, and what support you need.",
      priority: "medium",
      status: "havent_started",
      dueDate: todayPlus(5),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  return {
    ...state,
    placements: [placement, ...state.placements],
    tasks: [...starterTasks, ...state.tasks],
  };
}

export function updateTask(input: {
  taskId: string;
  status: TaskStatus;
  updateText?: string;
  submissionLink?: string;
  feedbackComment?: string;
  rating?: number;
}): DemoState {
  const state = getState();
  const now = new Date().toISOString();

  const tasks = state.tasks.map((task) => {
    if (task.id !== input.taskId) return task;

    return {
      ...task,
      status: input.status,
      latestUpdate: input.updateText ?? task.latestUpdate,
      submissionLink: input.submissionLink ?? task.submissionLink,
      feedbackComment: input.feedbackComment ?? task.feedbackComment,
      rating: input.rating ?? task.rating,
      completedAt: input.status === "completed" ? now : task.completedAt,
      updatedAt: now,
    };
  });

  const next = { ...state, tasks };
  saveState(next);
  return next;
}

export function getApplicationStatusLabel(status: ApplicationStatus) {
  const labels: Record<ApplicationStatus, string> = {
    submitted: "Submitted",
    under_review: "Under Review",
    shortlisted: "Shortlisted",
    accepted: "Accepted",
    rejected: "Rejected",
  };
  return labels[status];
}

export function getTaskStatusLabel(status: TaskStatus) {
  const labels: Record<TaskStatus, string> = {
    havent_started: "Haven’t Started",
    working_on_it: "Working On It",
    needs_review: "Needs Review",
    completed: "Completed",
  };
  return labels[status];
}

export function getPriorityLabel(priority: TaskPriority) {
  const labels: Record<TaskPriority, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };
  return labels[priority];
}

export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

export function getProgress(placementId: string, state = getState()) {
  const tasks = state.tasks.filter((task) => task.placementId === placementId);
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === "completed").length;
  const working = tasks.filter((task) => task.status === "working_on_it").length;
  const review = tasks.filter((task) => task.status === "needs_review").length;
  const notStarted = tasks.filter((task) => task.status === "havent_started").length;
  const rated = tasks.filter((task) => typeof task.rating === "number");
  const averageRating =
    rated.length === 0
      ? null
      : Number((rated.reduce((sum, task) => sum + (task.rating ?? 0), 0) / rated.length).toFixed(1));

  return {
    total,
    completed,
    working,
    review,
    notStarted,
    completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
    averageRating,
  };
}
