import { validateLeadForm, validateNewsletterEmail } from './siteLogic';

export const BLUEPRINT_CONSTRAINTS = {
  NAME_MIN: 2,
  NAME_MAX: 100,
  EMAIL_MIN: 5,
  EMAIL_MAX: 160,
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 2000,
  SOURCE_PATH_MIN: 1,
  SOURCE_PATH_MAX: 100,
  DOC_ID_MAX: 128,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  DOC_ID_REGEX: /^[a-zA-Z0-9_-]+$/,
} as const;

export const ENQUIRY_STATUSES = ['new', 'in_review', 'contacted', 'archived'] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const CAREER_STATUSES = ['new', 'shortlisted', 'contacted', 'archived'] as const;
export type CareerStatus = (typeof CAREER_STATUSES)[number];

export const NEWSLETTER_STATUSES = ['subscribed', 'unsubscribed'] as const;
export type NewsletterStatus = (typeof NEWSLETTER_STATUSES)[number];

export const BOOTSTRAP_ADMIN_EMAIL = 'prithvi.kamble7579@gmail.com';

export interface EnquiryDraft {
  name: string;
  email: string;
  message: string;
  consent: true;
  status: 'new';
  sourcePath: string;
}

export interface CareerApplicationDraft {
  name: string;
  email: string;
  message: string;
  consent: true;
  status: 'new';
  sourcePath: string;
}

export interface NewsletterSubscriberDraft {
  email: string;
  status: 'subscribed';
  sourcePath: string;
}

export function clampString(value: string, maxLength: number): string {
  const trimmed = value.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength).trimEnd();
}

export function normalizeSourcePath(path?: string): string {
  const trimmed = (path ?? '/').trim() || '/';
  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return clampString(normalized, BLUEPRINT_CONSTRAINTS.SOURCE_PATH_MAX) || '/';
}

export function isValidDocId(id: string): boolean {
  return (
    typeof id === 'string' &&
    id.length >= 1 &&
    id.length <= BLUEPRINT_CONSTRAINTS.DOC_ID_MAX &&
    BLUEPRINT_CONSTRAINTS.DOC_ID_REGEX.test(id)
  );
}

export function isBootstrapAdminEmail(
  email?: string | null,
  emailVerified?: boolean | null,
): boolean {
  return Boolean(
    emailVerified === true &&
      typeof email === 'string' &&
      email.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL,
  );
}

export function buildEnquiryDraft(input: {
  name: string;
  email: string;
  message: string;
  consent: boolean;
  sourcePath?: string;
}): EnquiryDraft {
  const name = clampString(input.name, BLUEPRINT_CONSTRAINTS.NAME_MAX);
  const email = clampString(input.email, BLUEPRINT_CONSTRAINTS.EMAIL_MAX).toLowerCase();
  const message = clampString(input.message, BLUEPRINT_CONSTRAINTS.MESSAGE_MAX);
  const validation = validateLeadForm({
    name,
    email,
    message,
    consent: input.consent,
  });
  if (!validation.isValid) {
    const firstError = Object.values(validation.errors).find(Boolean) || 'Invalid enquiry data.';
    throw new Error(firstError);
  }
  return {
    name,
    email,
    message,
    consent: true,
    status: 'new',
    sourcePath: normalizeSourcePath(input.sourcePath),
  };
}

export function buildCareerApplicationDraft(input: {
  name: string;
  email: string;
  message: string;
  consent: boolean;
  sourcePath?: string;
}): CareerApplicationDraft {
  const base = buildEnquiryDraft(input);
  return {
    ...base,
  };
}

export function buildNewsletterDraft(input: {
  email: string;
  sourcePath?: string;
}): NewsletterSubscriberDraft {
  const email = clampString(input.email, BLUEPRINT_CONSTRAINTS.EMAIL_MAX).toLowerCase();
  const err = validateNewsletterEmail(email);
  if (err) {
    throw new Error(err);
  }
  return {
    email,
    status: 'subscribed',
    sourcePath: normalizeSourcePath(input.sourcePath),
  };
}

export function isFirestoreQuotaError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes('Quota exceeded') ||
    message.includes('Free daily read units per project')
  );
}
