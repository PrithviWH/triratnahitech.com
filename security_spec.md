# Firestore Security Specification (`security_spec.md`)

## 1. Data Invariants & Master Source of Truth

- **Default-Deny Baseline**: Every path not explicitly matched under `/databases/{database}/documents` is denied for both read and write via a top-level catch-all rule.
- **PII Isolation**: `enquiries`, `career_applications`, and `newsletter_subscribers` contain Personally Identifiable Information (`name`, `email`, `message`). Public visitors may **only create** new submissions under strict schema, size, regex, initial-status, and server-timestamp invariants. Public or arbitrary signed-in non-admin users are **never** allowed to `get`, `list`, `update`, or `delete` any document in these collections.
- **Verified Admin Authority**:
  - `isAdmin()` requires `request.auth != null`, `request.auth.token.email_verified == true`, and either the bootstrapped owner email (`prithvi.kamble7579@gmail.com`) or an existing trusted document at `/admins/$(request.auth.uid)`.
  - Unverified email tokens (`email_verified != true`) are always rejected even if `email` matches.
- **Role Non-Escalation**: Non-admins cannot create, update, or delete `/admins/{adminId}` documents (preventing self-assigned admin privilege escalation).
- **Schema & Size Determinism**:
  - Document IDs must match `^[a-zA-Z0-9_\-]+$` and `<= 128` chars.
  - Every `create` enforces exact required & allowed keys (`hasAll` + `hasOnly`).
  - Every string enforces explicit `minLength` and `maxLength` bounds matching `firebase-blueprint.json`.
  - Every `create` enforces `status == 'new'` (or `'subscribed'` for newsletter) and `consent == true` (for enquiry/career forms), preventing status shortcutting at creation.
  - Every `create` enforces `createdAt == request.time && updatedAt == request.time`.
  - Every `update` is admin-only, enforces `isValid[Entity](incoming())`, locks immutable fields (`createdAt`, `name`, `email`, `message`, `consent`, `sourcePath`), requires `updatedAt == request.time`, restricts mutable keys via `incoming().diff(existing()).affectedKeys().hasOnly(['status', 'updatedAt'])`, and prevents non-admin updates entirely (while allowing verified admins to triage statuses including reopening `archived` items if needed).

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Ghost/Shadow Field Injection (`enquiries` create)**: Including `{ ..., "isAdmin": true }` or `{ ..., "internalNotes": "bypass" }` -> **DENIED** by `hasOnly(...)`.
2. **Oversized Message Payload (`enquiries` create)**: `message` of 2,500 chars (> `2000` maxLength) -> **DENIED** by `data.message.size() <= 2000`.
3. **Oversized / Poisoned Document ID (`enquiries` create)**: Doc ID `"abc$bad/../../../123"` or 200-char string -> **DENIED** by `isValidId(enquiryId)`.
4. **Status Shortcutting on Create (`enquiries` create)**: Submitting `status: "contacted"` instead of `"new"` -> **DENIED** by `incoming().status == 'new'`.
5. **False Consent Bypass (`career_applications` create)**: Submitting `consent: false` -> **DENIED** by `incoming().consent == true`.
6. **Spoofed Client Timestamp (`newsletter_subscribers` create)**: Submitting a backdated `createdAt` instead of `request.time` -> **DENIED** by `incoming().createdAt == request.time`.
7. **Invalid Email Regex (`newsletter_subscribers` create)**: Submitting `email: "not-an-email"` -> **DENIED** by regex match `^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$`.
8. **Blanket PII Read / List Scraping (`enquiries` get/list)**: Anonymous user or regular signed-in non-admin user attempting `getDocs(collection(db, 'enquiries'))` -> **DENIED** by `allow read: if isAdmin();`.
9. **Email Spoofing Attack (`enquiries` read/update)**: Authenticated user whose `token.email == 'prithvi.kamble7579@gmail.com'` but `token.email_verified == false` -> **DENIED** by `request.auth.token.email_verified == true`.
10. **Self-Assigned Admin Escalation (`admins` create)**: Non-admin signed-in user attempting `setDoc(doc(db, 'admins', uid), { uid, email, role: 'admin', createdAt: serverTimestamp() })` -> **DENIED** by `allow create: if isAdmin() ...`.
11. **Immutable Field Tampering (`career_applications` update)**: Admin attempting to alter `createdAt` or `email` during a status update -> **DENIED** by `affectedKeys().hasOnly(['status', 'updatedAt'])` and `incoming().createdAt == existing().createdAt`.
12. **Type Poisoning on Update (`enquiries` update)**: Admin attempting to update `status` to `12345` or `"arbitrary_invalid_status"` -> **DENIED** by `isValidEnquiry(incoming())` wrapping the `allow update` block.

## 3. Verification Plan

1. Validate `DRAFT_firestore.rules` and final `firestore.rules` with `@firebase/eslint-plugin-security-rules` (`npx eslint firestore.rules`).
2. Write `src/utils/firestorePayloads.ts` enforcing identical bounds and regexes from `firebase-blueprint.json`, plus `src/utils/firestorePayloads.test.ts` covering all 12 dirty-dozen cases and valid payload construction.
3. Perform the Phase 5 Red Team audit comparing every collection path in `firebase-blueprint.json` against `DRAFT_firestore.rules` before writing and deploying `firestore.rules`.
