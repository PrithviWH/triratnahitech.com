import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BLUEPRINT_CONSTRAINTS,
  BOOTSTRAP_ADMIN_EMAIL,
  buildCareerApplicationDraft,
  buildEnquiryDraft,
  buildNewsletterDraft,
  isBootstrapAdminEmail,
  isFirestoreQuotaError,
  isValidDocId,
  normalizeSourcePath,
} from './firestorePayloads';

test('buildEnquiryDraft trims, normalizes, and clamps fields within blueprint bounds', () => {
  const longMessage = 'A'.repeat(2500);
  const draft = buildEnquiryDraft({
    name: '   Priya Deshmukh   ',
    email: '  Priya@Example.COM  ',
    message: longMessage,
    consent: true,
    sourcePath: '/contact',
  });

  assert.equal(draft.name, 'Priya Deshmukh');
  assert.equal(draft.email, 'priya@example.com');
  assert.equal(draft.message.length, BLUEPRINT_CONSTRAINTS.MESSAGE_MAX);
  assert.equal(draft.consent, true);
  assert.equal(draft.status, 'new');
  assert.equal(draft.sourcePath, '/contact');
});

test('buildEnquiryDraft rejects missing consent, short name, bad email, and short message', () => {
  assert.throws(
    () =>
      buildEnquiryDraft({
        name: 'Aarav',
        email: 'aarav@example.com',
        message: 'We need local SEO services in Pune.',
        consent: false,
      }),
    /consent/i,
  );
  assert.throws(
    () =>
      buildEnquiryDraft({
        name: 'A',
        email: 'aarav@example.com',
        message: 'We need local SEO services in Pune.',
        consent: true,
      }),
    /name/i,
  );
  assert.throws(
    () =>
      buildEnquiryDraft({
        name: 'Aarav',
        email: 'bad-email',
        message: 'We need local SEO services in Pune.',
        consent: true,
      }),
    /email/i,
  );
  assert.throws(
    () =>
      buildEnquiryDraft({
        name: 'Aarav',
        email: 'aarav@example.com',
        message: 'Too short',
        consent: true,
      }),
    /10 characters/i,
  );
});

test('buildCareerApplicationDraft builds valid new application draft', () => {
  const draft = buildCareerApplicationDraft({
    name: 'Rohan Joshi',
    email: 'ROHAN@STUDIO.IN',
    message: 'Frontend engineer with 3 years experience in React and TypeScript.',
    consent: true,
    sourcePath: '/careers',
  });

  assert.equal(draft.email, 'rohan@studio.in');
  assert.equal(draft.status, 'new');
  assert.equal(draft.sourcePath, '/careers');
});

test('buildNewsletterDraft enforces valid email and subscribed status', () => {
  const draft = buildNewsletterDraft({
    email: '  Founder@PuneBusiness.IN ',
    sourcePath: '/services',
  });

  assert.equal(draft.email, 'founder@punebusiness.in');
  assert.equal(draft.status, 'subscribed');
  assert.equal(draft.sourcePath, '/services');

  assert.throws(() => buildNewsletterDraft({ email: 'not-valid' }), /valid email/i);
});

test('isValidDocId enforces Firestore ID regex and max length', () => {
  assert.equal(isValidDocId('enquiry_123-abc'), true);
  assert.equal(isValidDocId(''), false);
  assert.equal(isValidDocId('bad/id'), false);
  assert.equal(isValidDocId('bad$id'), false);
  assert.equal(isValidDocId('x'.repeat(129)), false);
});

test('isBootstrapAdminEmail enforces email_verified == true to prevent email spoofing', () => {
  assert.equal(isBootstrapAdminEmail(BOOTSTRAP_ADMIN_EMAIL, true), true);
  assert.equal(isBootstrapAdminEmail(BOOTSTRAP_ADMIN_EMAIL, false), false);
  assert.equal(isBootstrapAdminEmail(BOOTSTRAP_ADMIN_EMAIL, null), false);
  assert.equal(isBootstrapAdminEmail('other@example.com', true), false);
});

test('normalizeSourcePath clamps path length and ensures leading slash', () => {
  assert.equal(normalizeSourcePath('contact'), '/contact');
  assert.equal(normalizeSourcePath(''), '/');
  assert.equal(normalizeSourcePath('/' + 'a'.repeat(150)).length, 100);
});

test('isFirestoreQuotaError detects quota limit messages', () => {
  assert.equal(isFirestoreQuotaError(new Error('Quota exceeded.')), true);
  assert.equal(
    isFirestoreQuotaError(new Error("Quota exceeded for quota metric 'Free daily read units per project (free tier database)'")),
    true,
  );
  assert.equal(isFirestoreQuotaError(new Error('Network error')), false);
});
