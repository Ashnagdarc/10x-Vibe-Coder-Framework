export enum StepType {
  BRAINSTORM = 'brainstorm',
  PLAN = 'plan',
  BUILD = 'build',
  AUDIT = 'audit',
  KAIZEN = 'kaizen',
  SPRINT = 'sprint',
  CLOSEOUT = 'closeout'
}

export interface StepData {
  userInput: string;
  aiOutput: string;
  insights?: string[];
  isCompleted: boolean;
  lastSaved: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  currentStep: StepType;
  steps: Record<StepType, StepData>;
  onboardingStep?: 'WELCOME' | 'KEYS' | 'SECURITY' | 'VIBE' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export const STORAGE_KEY = 'vibe_coder_studio_project';
export const API_KEYS_STORAGE_KEY = 'vibe_coder_api_keys';

export const STEPS: { type: StepType; label: string; description: string; placeholder: string; prompt: string }[] = [
  {
    type: StepType.BRAINSTORM,
    label: 'Brainstorm',
    description: 'Define the core vision and explore messy ideas.',
    placeholder: 'What is the "big idea"? List features, target users, and the "vibe" you want to achieve...',
    prompt: 'Context: Brainstorming phase for a software project. Input: {input}. Task: Refine these core ideas into a cohesive product vision. Suggest 3 unique "vibes" or angles for this software.'
  },
  {
    type: StepType.PLAN,
    label: 'Plan',
    description: 'Map out the architecture and roadmap.',
    placeholder: 'Define the tech stack, key features, and user flow...',
    prompt: 'Context: Planning phase. Based on the vision of {previousOutput}, and user input: {input}. Task: Create a high-level technical roadmap, feature list, and suggested tech stack.'
  },
  {
    type: StepType.BUILD,
    label: 'Build',
    description: 'Execution strategy and core logic.',
    placeholder: 'What are the most critical components to build first?',
    prompt: 'Context: Build phase. Plan: {previousOutput}. User focuses: {input}. Task: Generate a detailed execution guide for building the core logic. Include code structure suggestions and logic flow.'
  },
  {
    type: StepType.AUDIT,
    label: 'Audit',
    description: 'Review code quality and security.',
    placeholder: 'Any known bottlenecks or security concerns to address?',
    prompt: 'Context: Audit phase. Features built: {previousOutput}. Concerns: {input}. Task: Provide a security and performance checklist. Identify potential technical debt and how to mitigate it.'
  },
  {
    type: StepType.KAIZEN,
    label: 'Kaizen',
    description: 'Continuous improvement and polish.',
    placeholder: 'What small details could make this 10x better?',
    prompt: 'Context: Kaizen phase. Current state: {previousOutput}. Improvement ideas: {input}. Task: List 5 small but high-impact refinements (UI/UX or Code) to polish the product.'
  },
  {
    type: StepType.SPRINT,
    label: 'Sprint',
    description: 'Heavy lifting and final feature push.',
    placeholder: 'List the final tasks to complete before launch...',
    prompt: 'Context: Sprint phase. Polished state: {previousOutput}. Final tasks: {input}. Task: Create a high-velocity sprint plan to wrap up all pending features and bugs.'
  },
  {
    type: StepType.CLOSEOUT,
    label: 'Closeout',
    description: 'Documentation, deployment, and retro.',
    placeholder: 'Reflect on the build. What did we learn?',
    prompt: 'Context: Closeout phase. Sprint results: {previousOutput}. Reflections: {input}. Task: Draft a README, deployment guide, and a brief project post-mortem summary.'
  }
];
