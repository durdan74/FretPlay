import React, { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type OnboardingSegment = 'Débutant' | 'Amateur' | 'Avancé';

type OnboardingFlowState = {
  experience: string | null;
  segment: OnboardingSegment | null;
  blockers: string[];
  noteLearning: string[];
  goal: string | null;
  learningStyle: string | null;
  dailyTime: string | null;
};

type OnboardingFlowContextValue = OnboardingFlowState & {
  setExperience: (value: string) => void;
  setSegment: (value: OnboardingSegment) => void;
  setBlockers: (values: string[]) => void;
  setNoteLearning: (values: string[]) => void;
  setGoal: (value: string) => void;
  setLearningStyle: (value: string) => void;
  setDailyTime: (value: string) => void;
  resetFlow: () => void;
};

const DEFAULT_STATE: OnboardingFlowState = {
  experience: null,
  segment: null,
  blockers: [],
  noteLearning: [],
  goal: null,
  learningStyle: null,
  dailyTime: null,
};

const OnboardingFlowContext = createContext<OnboardingFlowContextValue | null>(null);

export function OnboardingFlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingFlowState>(DEFAULT_STATE);

  const value = useMemo<OnboardingFlowContextValue>(
    () => ({
      ...state,
      setExperience: (value) => setState((prev) => ({ ...prev, experience: value })),
      setSegment: (value) => setState((prev) => ({ ...prev, segment: value })),
      setBlockers: (values) => setState((prev) => ({ ...prev, blockers: values })),
      setNoteLearning: (values) => setState((prev) => ({ ...prev, noteLearning: values })),
      setGoal: (value) => setState((prev) => ({ ...prev, goal: value })),
      setLearningStyle: (value) => setState((prev) => ({ ...prev, learningStyle: value })),
      setDailyTime: (value) => setState((prev) => ({ ...prev, dailyTime: value })),
      resetFlow: () => setState(DEFAULT_STATE),
    }),
    [state],
  );

  return <OnboardingFlowContext.Provider value={value}>{children}</OnboardingFlowContext.Provider>;
}

export function useOnboardingFlow() {
  const ctx = useContext(OnboardingFlowContext);
  if (!ctx) {
    throw new Error('useOnboardingFlow must be used inside OnboardingFlowProvider');
  }
  return ctx;
}
