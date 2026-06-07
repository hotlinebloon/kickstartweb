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
  status?: "draft" | "active" | "closed";
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
  method?: "proof" | "quick";
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

export type WeeklyReview = {
  id: string;
  placementId: string;
  generatedAt: string;
  periodStart: string;
  periodEnd: string;
  health: "on_track" | "needs_attention" | "at_risk";
  headline: string;
  summary: string;
  wins: string[];
  needsWork: string[];
  nextFocus: string[];
  ownerAction: string | null;
  evidence: {
    tasksUpdated: number;
    tasksCompleted: number;
    tasksWaitingReview: number;
    overdueTasks: number;
    averageRating: number | null;
  };
};

export type DemoState = {
  applicant: ApplicantProfile;
  company: Company;
  opportunities: Opportunity[];
  applications: Application[];
  placements: Placement[];
  tasks: GrowthTask[];
  weeklyReviews: WeeklyReview[];
  savedOpportunityIds: string[];
};

const STORAGE_KEY = "kickstart_demo_state_v2";

function todayPlus(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function todayMinus(days: number) {
  return todayPlus(-days);
}

function uid(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createInitialState(): DemoState {
  const applicant: ApplicantProfile = {
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
  };
  const opportunities: Opportunity[] = [
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
    {
      id: "opp-ux-research",
      title: "UX Research Intern",
      companyId: "company-novatech",
      type: "Internship",
      location: "Prishtina",
      workMode: "Hybrid",
      deadline: todayPlus(18),
      skills: ["User interviews", "Figma", "Writing"],
      description:
        "Help the product team understand first-time users and turn interviews into clear product recommendations.",
      responsibilities: [
        "Prepare interview questions",
        "Take structured research notes",
        "Summarize findings and recommendations",
      ],
      requirements: [
        "Strong listening and writing skills",
        "Interest in product design",
        "A school or personal research example",
      ],
      questions: [
        "What makes a user interview useful?",
        "Tell us about a time you learned from feedback.",
        "What product would you like to improve and why?",
      ],
      scenarioTask:
        "Outline five questions you would ask a student who abandoned an internship application.",
      proofRequirement: "Add a research note, case study, presentation, or Figma link.",
    },
    {
      id: "opp-qa-tester",
      title: "Junior QA Tester",
      companyId: "company-novatech",
      type: "Entry-level",
      location: "Prishtina",
      workMode: "On-site",
      deadline: todayPlus(11),
      skills: ["Testing", "Bug reports", "Attention to detail"],
      description:
        "Test new product flows, reproduce issues, and write bug reports the engineering team can act on.",
      responsibilities: [
        "Run browser and mobile test cases",
        "Write reproducible bug reports",
        "Verify fixes before release",
      ],
      requirements: [
        "Patient and methodical working style",
        "Clear written communication",
        "Comfort learning new software",
      ],
      questions: [
        "How do you explain a bug clearly?",
        "What details belong in a useful bug report?",
        "Why are you interested in software testing?",
      ],
      scenarioTask:
        "Describe how you would test a registration form before release.",
      proofRequirement: "Add a sample bug report, testing checklist, or project link.",
    },
    {
      id: "opp-content-creator",
      title: "Product Content Assistant",
      companyId: "company-novatech",
      type: "Micro-project",
      location: "Remote",
      workMode: "Remote",
      deadline: todayPlus(24),
      skills: ["Writing", "Social media", "Canva"],
      description:
        "Turn product updates and customer stories into concise educational content for young applicants.",
      responsibilities: [
        "Draft short product posts",
        "Create simple visual explainers",
        "Maintain a weekly content calendar",
      ],
      requirements: [
        "Clear, concise writing",
        "Basic visual design skills",
        "Ability to work from a brief",
      ],
      questions: [
        "What makes educational content useful?",
        "Show us a topic you can explain simply.",
        "How would you adapt one idea for two channels?",
      ],
      scenarioTask:
        "Write an outline for a post that helps students submit stronger proof of work.",
      proofRequirement: "Add a writing sample, social post, presentation, or Canva link.",
    },
    {
      id: "opp-support-associate",
      title: "Customer Support Associate",
      companyId: "company-novatech",
      type: "Entry-level",
      location: "Prishtina",
      workMode: "Hybrid",
      deadline: todayPlus(16),
      skills: ["Communication", "Problem solving", "Documentation"],
      description:
        "Help applicants and employers solve product questions while improving the support knowledge base.",
      responsibilities: [
        "Respond to customer questions",
        "Document recurring issues",
        "Escalate product bugs with useful context",
      ],
      requirements: [
        "Calm written communication",
        "Strong problem-solving habits",
        "Comfort speaking Albanian and English",
      ],
      questions: [
        "How do you handle a frustrated customer?",
        "What makes a support reply useful?",
        "Describe a problem you solved for someone else.",
      ],
      scenarioTask:
        "Draft a response to an applicant whose proof link will not open.",
      proofRequirement: "Add a writing sample, support response, or documentation link.",
    },
    {
      id: "opp-finance-operations",
      title: "Finance Operations Intern",
      companyId: "company-novatech",
      type: "Internship",
      location: "Prishtina",
      workMode: "Hybrid",
      deadline: todayPlus(21),
      skills: ["Excel", "Reporting", "Attention to detail"],
      description:
        "Support monthly reporting, organize transaction records, and improve recurring finance checklists.",
      responsibilities: ["Prepare reporting sheets", "Check transaction records", "Document recurring processes"],
      requirements: ["Comfort with spreadsheets", "Reliable attention to detail", "Clear written communication"],
      questions: ["Why are you interested in finance operations?", "How do you check your work?", "What spreadsheet task have you completed?"],
      scenarioTask: "Describe how you would investigate a mismatch between two monthly reports.",
      proofRequirement: "Add a spreadsheet, report, checklist, or relevant school project.",
    },
    {
      id: "opp-community-coordinator",
      title: "Community Programs Assistant",
      companyId: "company-novatech",
      type: "Micro-project",
      location: "Prizren",
      workMode: "Hybrid",
      deadline: todayPlus(27),
      skills: ["Event planning", "Communication", "Documentation"],
      description:
        "Help coordinate a short student program, communicate with participants, and document what improves attendance.",
      responsibilities: ["Coordinate participant updates", "Support event logistics", "Summarize attendance feedback"],
      requirements: ["Organized communication", "Comfort working with groups", "Ability to document follow-up actions"],
      questions: ["How would you keep participants informed?", "Describe an event or group activity you supported.", "How do you follow up after a missed deadline?"],
      scenarioTask: "Create a simple communication plan for a student workshop with 30 participants.",
      proofRequirement: "Add an event plan, communication sample, presentation, or school project.",
    },
  ];

  const fakeApplicants: ApplicantProfile[] = [
    {
      id: "applicant-leon",
      fullName: "Leon Berisha",
      email: "leon@example.com",
      education: "Computer Science student",
      school: "University of Prishtina",
      location: "Prishtina, Kosovo",
      skills: ["React", "TypeScript", "GitHub"],
      bio: "Second-year student focused on accessible frontend development and reliable delivery.",
      cvName: "leon-berisha-cv.pdf",
      githubUrl: "https://github.com/leon-demo",
      portfolioUrl: "https://leon-demo.dev",
    },
    {
      id: "applicant-era",
      fullName: "Era Hoxha",
      email: "era@example.com",
      education: "Psychology student",
      school: "AAB College",
      location: "Prishtina, Kosovo",
      skills: ["User interviews", "Figma", "Research synthesis"],
      bio: "Research-minded student interested in making digital products easier for first-time users.",
      cvName: "era-hoxha-cv.pdf",
      githubUrl: "https://github.com/era-demo",
      portfolioUrl: "https://era-demo.dev",
    },
    {
      id: "applicant-blerim",
      fullName: "Blerim Gashi",
      email: "blerim@example.com",
      education: "Information Technology student",
      school: "RIT Kosovo",
      location: "Fushe Kosove, Kosovo",
      skills: ["Testing", "Bug reports", "JavaScript"],
      bio: "Methodical tester who enjoys finding edge cases and documenting reliable reproduction steps.",
      cvName: "blerim-gashi-cv.pdf",
      githubUrl: "https://github.com/blerim-demo",
      portfolioUrl: "https://blerim-demo.dev",
    },
    {
      id: "applicant-elira",
      fullName: "Elira Dema",
      email: "elira@example.com",
      education: "Media and communication graduate",
      school: "University of Prishtina",
      location: "Gjakova, Kosovo",
      skills: ["Writing", "Canva", "Social media"],
      bio: "Early-career communicator who turns technical ideas into concise, useful content.",
      cvName: "elira-dema-cv.pdf",
      githubUrl: "https://github.com/elira-demo",
      portfolioUrl: "https://elira-demo.dev",
    },
    {
      id: "applicant-noar",
      fullName: "Noar Shala",
      email: "noar@example.com",
      education: "Economics student",
      school: "University of Prishtina",
      location: "Prizren, Kosovo",
      skills: ["Excel", "Python", "Data cleaning"],
      bio: "Detail-oriented student building practical experience with spreadsheets and data quality.",
      cvName: "noar-shala-cv.pdf",
      githubUrl: "https://github.com/noar-demo",
      portfolioUrl: "https://noar-demo.dev",
    },
    {
      id: "applicant-diona",
      fullName: "Diona Rexhepi",
      email: "diona@example.com",
      education: "Business administration student",
      school: "University of Prishtina",
      location: "Prishtina, Kosovo",
      skills: ["Excel", "Reporting", "Attention to detail"],
      bio: "Business student interested in reliable reporting, finance operations, and improving recurring processes.",
      cvName: "diona-rexhepi-cv.pdf",
      githubUrl: "https://github.com/diona-demo",
      portfolioUrl: "https://diona-demo.dev",
    },
    {
      id: "applicant-luan",
      fullName: "Luan Morina",
      email: "luan@example.com",
      education: "Public relations student",
      school: "University of Prizren",
      location: "Prizren, Kosovo",
      skills: ["Event planning", "Communication", "Documentation"],
      bio: "Community-focused student with experience coordinating school events and participant communication.",
      cvName: "luan-morina-cv.pdf",
      githubUrl: "https://github.com/luan-demo",
      portfolioUrl: "https://luan-demo.dev",
    },
  ];

  const fakeApplications: Application[] = fakeApplicants.map((profile, index) => {
    const opportunity = opportunities[index];
    const statuses: ApplicationStatus[] = [
      "under_review",
      "shortlisted",
      "submitted",
      "rejected",
      "submitted",
      "under_review",
      "shortlisted",
    ];
    return {
      id: `seed-application-${profile.id}`,
      opportunityId: opportunity.id,
      applicantId: profile.id,
      status: statuses[index],
      submittedAt: `${todayMinus(index + 1)}T10:00:00.000Z`,
      updatedAt: `${todayMinus(Math.max(index - 1, 0))}T14:00:00.000Z`,
      applicantSnapshot: profile,
      answers: opportunity.questions.map((question, answerIndex) => ({
        question,
        answer: [
          `I am interested in ${opportunity.title.toLowerCase()} work because it connects directly to the projects and skills I am developing.`,
          `My strongest relevant example is available in my portfolio, where I explain the process, decisions, and result.`,
          `I would begin by clarifying the expected outcome, testing a small approach, and documenting what changes after feedback.`,
        ][answerIndex] ?? "I would approach this with a clear plan and specific proof.",
      })),
      scenarioResponse:
        "I would first clarify the goal and constraints, then create a small testable version, ask for feedback, and document the evidence behind each revision.",
      proofUrl: profile.portfolioUrl,
      method: index === 4 ? "quick" : "proof",
      employerNote:
        statuses[index] === "shortlisted"
          ? "Relevant proof and clear learning goals. Compare with the final shortlist."
          : statuses[index] === "rejected"
            ? "Good communication, but the submitted proof does not yet match this role."
            : undefined,
    };
  });

  return {
    applicant,
    company: {
      id: "company-novatech",
      name: "NovaTech",
      industry: "Software / Startup",
      location: "Prishtina, Kosovo",
      description:
        "NovaTech is a small software company looking for beginner-friendly interns who can learn fast and submit proof of work.",
    },
    opportunities,
    applications: fakeApplications,
    placements: [],
    tasks: [],
    weeklyReviews: [],
    savedOpportunityIds: [],
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
    const parsed = JSON.parse(raw) as DemoState;
    const initial = createInitialState();
    const parsedOpportunityIds = new Set((parsed.opportunities ?? []).map((item) => item.id));
    const parsedApplicationIds = new Set((parsed.applications ?? []).map((item) => item.id));
    const hydrated = {
      ...parsed,
      opportunities: [
        ...(parsed.opportunities ?? []),
        ...initial.opportunities.filter((item) => !parsedOpportunityIds.has(item.id)),
      ],
      applications: [
        ...(parsed.applications ?? []),
        ...initial.applications.filter((item) => !parsedApplicationIds.has(item.id)),
      ],
      weeklyReviews: parsed.weeklyReviews ?? [],
      savedOpportunityIds: parsed.savedOpportunityIds ?? [],
    };
    saveState(hydrated);
    return hydrated;
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
  if (existing && isApplicationFinal(existing.status)) return state;

  const now = new Date().toISOString();
  const application: Application = {
    id: existing?.id ?? uid("application"),
    opportunityId: input.opportunityId,
    applicantId: state.applicant.id,
    status: existing?.status ?? "submitted",
    submittedAt: existing?.submittedAt ?? now,
    updatedAt: now,
    applicantSnapshot: state.applicant,
    answers: input.answers,
    scenarioResponse: input.scenarioResponse,
    proofUrl: input.proofUrl,
    method: "proof",
  };

  const next: DemoState = {
    ...state,
    applications: [application, ...state.applications.filter((item) => item.id !== application.id)],
  };

  saveState(next);
  return next;
}

export function submitQuickApply(opportunityId: string): DemoState {
  const state = getState();
  const opportunity = state.opportunities.find((item) => item.id === opportunityId);
  if (!opportunity) return state;

  const existing = state.applications.find(
    (item) => item.opportunityId === opportunityId && item.applicantId === state.applicant.id
  );
  if (existing) return state;

  const now = new Date().toISOString();
  const application: Application = {
    id: uid("application"),
    opportunityId,
    applicantId: state.applicant.id,
    status: "submitted",
    submittedAt: now,
    updatedAt: now,
    applicantSnapshot: state.applicant,
    answers: [],
    scenarioResponse: "",
    proofUrl: state.applicant.portfolioUrl || state.applicant.githubUrl,
    method: "quick",
  };
  const next = {
    ...state,
    applications: [application, ...state.applications.filter((item) => item.id !== application.id)],
  };
  saveState(next);
  return next;
}

export function updateOpportunityPreference(input: {
  opportunityId: string;
  preference: "saved" | "clear";
}): DemoState {
  const state = getState();
  const withoutSaved = state.savedOpportunityIds.filter((id) => id !== input.opportunityId);
  const next = {
    ...state,
    savedOpportunityIds:
      input.preference === "saved" ? [...withoutSaved, input.opportunityId] : withoutSaved,
  };
  saveState(next);
  return next;
}

export function createOpportunity(input: {
  title: string;
  type: Opportunity["type"];
  location: string;
  workMode: Opportunity["workMode"];
  deadline: string;
  skills: string[];
  description: string;
}): DemoState {
  const state = getState();
  const opportunity: Opportunity = {
    id: uid("opportunity"),
    title: input.title.trim(),
    companyId: state.company.id,
    type: input.type,
    location: input.location.trim(),
    workMode: input.workMode,
    deadline: input.deadline,
    skills: input.skills,
    description: input.description.trim(),
    responsibilities: [
      "Complete clearly scoped work with regular progress updates",
      "Submit evidence that the team can review",
      "Use feedback to improve the next version",
    ],
    requirements: [
      "Interest in the role and willingness to learn",
      "Clear communication and reliable follow-through",
      "One relevant example of previous work",
    ],
    questions: [
      "Why are you interested in this opportunity?",
      "What relevant work or learning can you show?",
      "What would you like to improve during this placement?",
    ],
    scenarioTask:
      "Describe how you would approach your first assigned task, including how you would clarify expectations and share progress.",
    proofRequirement:
      "Add one relevant link the employer can open, such as a portfolio item, project, document, or repository.",
    status: "active",
  };
  const next = { ...state, opportunities: [opportunity, ...state.opportunities] };
  saveState(next);
  return next;
}

export function updateOpportunityStatus(
  opportunityId: string,
  status: NonNullable<Opportunity["status"]>
): DemoState {
  const state = getState();
  const next = {
    ...state,
    opportunities: state.opportunities.map((opportunity) =>
      opportunity.id === opportunityId ? { ...opportunity, status } : opportunity
    ),
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
      rating:
        typeof input.rating === "number"
          ? Math.max(1, Math.min(5, input.rating))
          : task.rating,
      completedAt: input.status === "completed" ? now : undefined,
      updatedAt: now,
    };
  });

  const next = { ...state, tasks };
  saveState(next);
  return next;
}

function startOfReviewPeriod(date = new Date()) {
  const start = new Date(date);
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);
  return start;
}

function buildWeeklyReview(placement: Placement, state: DemoState): WeeklyReview {
  const now = new Date();
  const periodStart = startOfReviewPeriod(now);
  const tasks = state.tasks.filter((task) => task.placementId === placement.id);
  const recentTasks = tasks.filter(
    (task) => new Date(task.updatedAt).getTime() >= periodStart.getTime()
  );
  const completed = recentTasks.filter((task) => task.status === "completed");
  const waitingReview = tasks.filter((task) => task.status === "needs_review");
  const overdue = tasks.filter(
    (task) =>
      task.status !== "completed" &&
      new Date(`${task.dueDate}T23:59:59`).getTime() < now.getTime()
  );
  const active = tasks.filter((task) => task.status === "working_on_it");
  const notStarted = tasks.filter((task) => task.status === "havent_started");
  const ratings = tasks
    .map((task) => task.rating)
    .filter((rating): rating is number => typeof rating === "number");
  const averageRating =
    ratings.length === 0
      ? null
      : Number(
          (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
        );

  const health: WeeklyReview["health"] =
    overdue.length >= 2 || (recentTasks.length === 0 && tasks.length > 0)
      ? "at_risk"
      : overdue.length > 0 || waitingReview.length > 0
        ? "needs_attention"
        : "on_track";

  const wins: string[] = [];
  if (completed.length > 0) {
    wins.push(
      `Completed ${completed.length} task${completed.length === 1 ? "" : "s"} this week: ${completed
        .slice(0, 2)
        .map((task) => task.title)
        .join(", ")}.`
    );
  }
  if (waitingReview.length > 0) {
    wins.push(
      `Submitted ${waitingReview.length} task${waitingReview.length === 1 ? "" : "s"} for review.`
    );
  }
  if (averageRating !== null) {
    wins.push(`Maintaining an average reviewed-work rating of ${averageRating}/5.`);
  }
  if (wins.length === 0) {
    wins.push("Placement is active, but no completed or submitted work was recorded this week.");
  }

  const needsWork: string[] = [];
  if (overdue.length > 0) {
    needsWork.push(
      `${overdue.length} overdue task${overdue.length === 1 ? " needs" : "s need"} a recovery plan.`
    );
  }
  if (notStarted.length > 0) {
    needsWork.push(
      `${notStarted.length} assigned task${notStarted.length === 1 ? " has" : "s have"} not been started.`
    );
  }
  if (recentTasks.length === 0 && tasks.length > 0) {
    needsWork.push("No task activity was recorded during this review period.");
  }
  if (needsWork.length === 0) {
    needsWork.push("Keep updates specific by including outcomes, blockers, and work links.");
  }

  const nextFocus: string[] = [];
  if (overdue[0]) nextFocus.push(`Resolve overdue work: ${overdue[0].title}.`);
  if (active[0]) nextFocus.push(`Finish and submit: ${active[0].title}.`);
  if (notStarted[0]) nextFocus.push(`Start the next assigned task: ${notStarted[0].title}.`);
  if (nextFocus.length === 0) nextFocus.push("Agree the next stretch task for continued growth.");

  const ownerAction =
    waitingReview.length > 0
      ? `Review ${waitingReview.length} submitted task${waitingReview.length === 1 ? "" : "s"}.`
      : overdue.length > 0
        ? `Check in on ${overdue.length} overdue task${overdue.length === 1 ? "" : "s"}.`
        : null;

  const headline =
    health === "on_track"
      ? "On track with no mentor action needed"
      : health === "needs_attention"
        ? "Progressing, with one mentor action needed"
        : "At risk and needs a focused check-in";

  return {
    id: uid("weekly-review"),
    placementId: placement.id,
    generatedAt: now.toISOString(),
    periodStart: periodStart.toISOString(),
    periodEnd: now.toISOString(),
    health,
    headline,
    summary: `${recentTasks.length} task update${recentTasks.length === 1 ? "" : "s"} recorded this week. ${completed.length} completed, ${active.length} in progress, and ${waitingReview.length} waiting for review.`,
    wins,
    needsWork,
    nextFocus,
    ownerAction,
    evidence: {
      tasksUpdated: recentTasks.length,
      tasksCompleted: completed.length,
      tasksWaitingReview: waitingReview.length,
      overdueTasks: overdue.length,
      averageRating,
    },
  };
}

export function generateWeeklyReviews(): DemoState {
  const state = getState();
  const generated = state.placements.map((placement) =>
    buildWeeklyReview(placement, state)
  );
  const placementIds = new Set(generated.map((review) => review.placementId));
  const next = {
    ...state,
    weeklyReviews: [
      ...generated,
      ...(state.weeklyReviews ?? []).filter(
        (review) => !placementIds.has(review.placementId)
      ),
    ],
  };

  saveState(next);
  return next;
}

export function getApplicationStatusLabel(status: ApplicationStatus) {
  const labels: Record<ApplicationStatus, string> = {
    submitted: "Submitted",
    under_review: "Under review",
    shortlisted: "Shortlisted",
    accepted: "Accepted",
    rejected: "Rejected",
  };
  return labels[status];
}

export function isApplicationFinal(status: ApplicationStatus) {
  return status === "accepted" || status === "rejected";
}

export function getTaskStatusLabel(status: TaskStatus) {
  const labels: Record<TaskStatus, string> = {
    havent_started: "Not started",
    working_on_it: "In progress",
    needs_review: "Submitted for review",
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
  const date = /^\d{4}-\d{2}-\d{2}$/.test(dateString)
    ? new Date(`${dateString}T00:00:00`)
    : new Date(dateString);

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
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
