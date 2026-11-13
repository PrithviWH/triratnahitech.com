import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterByCategory,
  getNextIndex,
  getPageSeo,
  getPrevIndex,
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
