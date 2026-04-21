export const ONBOARDING_PROGRESS: Record<string, number> = {
  intro_problem: 4,
  intro_friction: 8,
  intro_solution: 12,
  q_experience: 20,
  seg_beginner: 28,
  seg_amateur: 28,
  seg_pro: 28,
  q_blocker: 35,
  q_note_learning: 50,
  q_goal: 65,
  q_learning_style: 80,
  q_daily_time: 92,
  proof_science: 95,
  social_proof: 97,
  loading_plan: 99,
  plan_summary: 100,
};

export const getOnboardingProgress = (screenName: string): number => ONBOARDING_PROGRESS[screenName] ?? 50;

let lastOnboardingProgress = 0;

export const getLastOnboardingProgress = (): number => lastOnboardingProgress;

export const setLastOnboardingProgress = (progress: number): void => {
  lastOnboardingProgress = Math.max(0, Math.min(100, progress));
};
