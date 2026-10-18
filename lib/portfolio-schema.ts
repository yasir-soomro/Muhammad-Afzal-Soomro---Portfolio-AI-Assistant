import rawData from '@/data/portfolio.json';

export interface DeveloperContact {
  email?: string;
  github?: string;
  linkedin?: string;
}

export interface DeveloperProfile {
  name: string;
  title: string;
  summary: string;
  location?: string;
  avatar?: string;
  contact: DeveloperContact;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export type ProjectStatus = 'completed' | 'in_progress' | 'active';

export interface ProjectItem {
  id: string;
  title: string;
  status: ProjectStatus;
  statusLabel: string;
  summary: string;
  technologies: string[];
  highlights?: string[];
  architectureNotes?: string;
  liveUrl?: string;
  repoUrl?: string;
}

export interface FAQItem {
  question: string;
  topic: string;
}

export interface PortfolioData {
  developer: DeveloperProfile;
  skills: SkillCategory[];
  projects: ProjectItem[];
  frequentlyAsked: FAQItem[];
}

export function validatePortfolioData(data: unknown): {
  success: boolean;
  data?: PortfolioData;
  errors?: string[];
} {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { success: false, errors: ['Portfolio data must be an object'] };
  }

  const obj = data as Record<string, unknown>;

  // Validate developer
  if (!obj.developer || typeof obj.developer !== 'object') {
    errors.push('Missing developer profile object');
  } else {
    const dev = obj.developer as Record<string, unknown>;
    if (typeof dev.name !== 'string' || !dev.name.trim()) errors.push('Missing or invalid developer.name');
    if (typeof dev.title !== 'string' || !dev.title.trim()) errors.push('Missing or invalid developer.title');
    if (typeof dev.summary !== 'string' || !dev.summary.trim()) errors.push('Missing or invalid developer.summary');
  }

  // Validate skills
  if (!Array.isArray(obj.skills) || obj.skills.length === 0) {
    errors.push('Missing or empty skills array');
  } else {
    obj.skills.forEach((skill, idx) => {
      if (!skill || typeof skill !== 'object' || typeof skill.category !== 'string' || !Array.isArray(skill.items)) {
        errors.push(`Invalid skill group at index ${idx}`);
      }
    });
  }

  // Validate projects
  if (!Array.isArray(obj.projects) || obj.projects.length === 0) {
    errors.push('Missing or empty projects array');
  } else {
    obj.projects.forEach((proj, idx) => {
      if (!proj || typeof proj !== 'object') {
        errors.push(`Invalid project at index ${idx}`);
        return;
      }
      if (typeof proj.id !== 'string' || !proj.id.trim()) errors.push(`Project at index ${idx} missing id`);
      if (typeof proj.title !== 'string' || !proj.title.trim()) errors.push(`Project at index ${idx} missing title`);
      if (typeof proj.status !== 'string') errors.push(`Project at index ${idx} missing status`);
      if (typeof proj.summary !== 'string') errors.push(`Project at index ${idx} missing summary`);
      if (!Array.isArray(proj.technologies) || proj.technologies.length === 0) {
        errors.push(`Project at index ${idx} missing technologies array`);
      }
    });
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: data as PortfolioData };
}

// Perform validation on the bundled JSON
const validationResult = validatePortfolioData(rawData);
if (!validationResult.success) {
  console.error('[Portfolio Data Error] Validation failed:', validationResult.errors);
  throw new Error(`Invalid portfolio data: ${validationResult.errors?.join(', ')}`);
}

export const portfolioData: PortfolioData = validationResult.data!;
export const validProjectIds: string[] = portfolioData.projects.map((p) => p.id);
