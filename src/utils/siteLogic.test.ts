import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildFaqJsonLd,
  buildWhatsAppUrl,
  extractHashTargetId,
  filterByCategory,
  getNextIndex,
  getPageSeo,
  getPrevIndex,
  parseRegionalLanguage,
  resolveScrollBehavior,
  toggleAccordionId,
  validateLeadForm,
  validateNewsletterEmail,
} from './siteLogic';

test('validateNewsletterEmail rejects empty and invalid emails, accepts valid ones', () => {
  assert.equal(validateNewsletterEmail(''), 'Please enter your email address.');
  assert.equal(validateNewsletterEmail('not-an-email'), 'Please enter a valid email address.');
  assert.equal(validateNewsletterEmail('triratnahitech@gmail.com'), null);
});

test('validateLeadForm enforces all required fields including consent', () => {
  const emptyResult = validateLeadForm({
    name: '',
    email: 'bad',
    message: 'hi',
    consent: false,
  });
  assert.equal(emptyResult.isValid, false);
  assert.ok(emptyResult.errors.name);
  assert.ok(emptyResult.errors.email);
  assert.ok(emptyResult.errors.message);
  assert.ok(emptyResult.errors.consent);

  const validResult = validateLeadForm({
    name: 'Aarav Kulkarni',
    email: 'aarav@example.com',
    message: 'We need a responsive business website and local SEO support.',
    consent: true,
  });
  assert.equal(validResult.isValid, true);
  assert.deepEqual(validResult.errors, {});
});

test('filterByCategory returns all items for All and filters specific categories', () => {
  const sample = [
    { id: '1', category: 'Real Estate' },
    { id: '2', category: 'Food' },
    { id: '3', category: 'Real Estate' },
  ];
  assert.equal(filterByCategory(sample, 'All').length, 3);
  assert.equal(filterByCategory(sample, 'Real Estate').length, 2);
  assert.equal(filterByCategory(sample, 'News').length, 0);
});

test('carousel index helpers wrap cleanly in both directions', () => {
  assert.equal(getNextIndex(0, 3), 1);
  assert.equal(getNextIndex(2, 3), 0);
  assert.equal(getPrevIndex(0, 3), 2);
  assert.equal(getPrevIndex(2, 3), 1);
  assert.equal(getNextIndex(0, 0), 0);
});

test('getPageSeo returns exact Home title and description', () => {
  const home = getPageSeo('/');
  assert.equal(home.title, 'Digital Marketing & Web Development in Pune | Triratna Hi-Tech');
  assert.match(home.description, /6\+ years of experience/);
  assert.match(getPageSeo('/contact').title, /Let's Talk/);
});

test('buildWhatsAppUrl formats formatted phone numbers and optional greeting', () => {
  assert.equal(
    buildWhatsAppUrl('(+91) 8169598429'),
    'https://wa.me/918169598429',
  );
  assert.equal(
    buildWhatsAppUrl('+918169598429', '   '),
    'https://wa.me/918169598429',
  );
  assert.equal(
    buildWhatsAppUrl('(+91) 8169598429', 'Hello Triratna Hi-Tech!'),
    'https://wa.me/918169598429?text=Hello%20Triratna%20Hi-Tech!',
  );
});

test('toggleAccordionId opens closed items, switches active items, and collapses active item on repeat click', () => {
  assert.equal(toggleAccordionId(null, 'faq-1'), 'faq-1');
  assert.equal(toggleAccordionId('faq-1', 'faq-2'), 'faq-2');
  assert.equal(toggleAccordionId('faq-2', 'faq-2'), null);
  assert.equal(toggleAccordionId('faq-1', ''), null);
});

test('parseRegionalLanguage normalizes query values safely to en, mr, or hi', () => {
  assert.equal(parseRegionalLanguage('mr'), 'mr');
  assert.equal(parseRegionalLanguage('MARATHI'), 'mr');
  assert.equal(parseRegionalLanguage('hi'), 'hi');
  assert.equal(parseRegionalLanguage('hindi'), 'hi');
  assert.equal(parseRegionalLanguage('en'), 'en');
  assert.equal(parseRegionalLanguage('fr'), 'en');
  assert.equal(parseRegionalLanguage(null), 'en');
});

test('extractHashTargetId and resolveScrollBehavior handle hash IDs and motion preference', () => {
  assert.equal(extractHashTargetId('#team'), 'team');
  assert.equal(extractHashTargetId('  #career-form '), 'career-form');
  assert.equal(extractHashTargetId('#'), null);
  assert.equal(extractHashTargetId(''), null);
  assert.equal(resolveScrollBehavior(false), 'smooth');
  assert.equal(resolveScrollBehavior(true), 'auto');
});

test('buildFaqJsonLd generates valid Schema.org FAQPage structured data', () => {
  const schema = buildFaqJsonLd([
    {
      question: 'How do your SEO services improve local rankings for Pune businesses?',
      answer: 'We optimize technical SEO, on-page structure, and Google Business Profiles.',
    },
  ]);
  assert.equal(schema['@context'], 'https://schema.org');
  assert.equal(schema['@type'], 'FAQPage');
  assert.ok(Array.isArray(schema.mainEntity));
  assert.equal((schema.mainEntity as unknown[]).length, 1);
});

