import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterProjects,
  getAdjacentProject,
  getCategoryCounts,
  normalizeWebsiteUrl,
  type ProjectSummaryLike,
} from './projectShowcase';
import { PROJECT_CATEGORIES, PROJECTS_DATA } from '../data/siteData';

const EXPECTED_DOMAINS = [
  'constitution.brambedkar.in',
  'music.brambedkar.in',
  'quotes.brambedkar.in',
  'walls.brambedkar.in',
  'kimayafoodproducts.com',
  'sakshamrealestate.in',
  'care32-dentist.com',
  'history.brambedkar.in',
  'news.brambedkar.in',
  'hindi.brambedkar.in',
  'marathi.brambedkar.in',
  'askkinternational.com',
];

test('PROJECTS_DATA contains all 12 requested website domains with clean HTTPS URLs', () => {
  const domains = PROJECTS_DATA.map((item) => item.domain);
  assert.equal(PROJECTS_DATA.length, 12);
  for (const expected of EXPECTED_DOMAINS) {
    assert.ok(domains.includes(expected), `Missing required domain: ${expected}`);
  }
  for (const item of PROJECTS_DATA) {
    assert.equal(normalizeWebsiteUrl(item.domain), item.url);
    assert.ok(item.url.startsWith('https://'), `Expected https url for ${item.domain}`);
  }
});

test('filterProjects filters by category and search query cleanly', () => {
  const sample: ProjectSummaryLike[] = PROJECTS_DATA;
  assert.equal(filterProjects(sample, 'All').length, 12);
  assert.equal(filterProjects(sample, 'Business & Brands').length, 4);
  assert.equal(filterProjects(sample, 'Knowledge & Portals').length, 5);
  assert.equal(filterProjects(sample, 'News & Regional').length, 3);
  assert.equal(filterProjects(sample, 'All', 'kimaya').length, 1);
  assert.equal(filterProjects(sample, 'Business & Brands', 'brambedkar').length, 0);
});

test('getCategoryCounts computes accurate counts across categories', () => {
  const counts = getCategoryCounts(PROJECTS_DATA, PROJECT_CATEGORIES);
  assert.deepEqual(counts, {
    All: 12,
    'Business & Brands': 4,
    'Knowledge & Portals': 5,
    'News & Regional': 3,
  });
});

test('getAdjacentProject wraps smoothly in prev and next directions', () => {
  const first = PROJECTS_DATA[0];
  const last = PROJECTS_DATA[PROJECTS_DATA.length - 1];
  assert.equal(getAdjacentProject(PROJECTS_DATA, first.id, 'prev')?.id, last.id);
  assert.equal(getAdjacentProject(PROJECTS_DATA, last.id, 'next')?.id, first.id);
  assert.equal(getAdjacentProject([], first.id, 'next'), null);
});
