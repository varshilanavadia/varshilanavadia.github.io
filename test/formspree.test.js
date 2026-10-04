// How the Contact form reads Formspree's replies, src/scripts/formspree.ts, held to the two
// replies the form really gave on 4 Oct 2026 (to a message, and to a post with no fields) and,
// for the rest, to the shapes Formspree's own client reads (@formspree/core 4.0.0), which
// have not been seen from the form itself. Loaded here as it is written; Node strips the
// types. Run with `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { outcome } from '../src/scripts/formspree.ts';

test('a message Formspree took is sent', () => {
  // What the form itself answered to a real message.
  assert.deepEqual(outcome(200, { next: '/thanks', ok: true }), { kind: 'sent' });
  // Either sign will do: its own client reads `next` alone.
  assert.deepEqual(outcome(200, { next: '/thanks?language=en' }), { kind: 'sent' });
  assert.deepEqual(outcome(200, { ok: true }), { kind: 'sent' });
});

test('an answer Formspree turns down is refused, by field and by its code', () => {
  const body = { error: 'Validation errors', errors: [{ code: 'TYPE_EMAIL', field: 'email', message: 'should be an email' }] };
  assert.deepEqual(outcome(422, body), { kind: 'refused', fields: [{ field: 'email', code: 'TYPE_EMAIL' }] });
});

test('a refusal with no code still names its field', () => {
  assert.deepEqual(outcome(422, { errors: [{ field: 'message', message: 'is too long' }] }), {
    kind: 'refused',
    fields: [{ field: 'message', code: 'UNSPECIFIED' }],
  });
});

test('a refusal of the form as a whole is a failure, not a field’s', () => {
  // What the form itself answered to a post with no fields.
  const empty = { error: 'Bad form post request', errors: [{ code: 'BAD_FORM_POST_REQUEST', message: 'Bad form post request' }] };
  assert.deepEqual(outcome(400, empty), { kind: 'failed' });
  assert.deepEqual(outcome(403, { errors: [{ code: 'BLOCKED', message: 'Blocked' }] }), { kind: 'failed' });
  assert.deepEqual(outcome(404, { error: 'Form not found' }), { kind: 'failed' });
});

test('the rate limit is its own answer, whatever the body says', () => {
  assert.deepEqual(outcome(429, { error: 'Too many requests' }), { kind: 'busy' });
  assert.deepEqual(outcome(429, null), { kind: 'busy' });
});

test('a reply that cannot be read is never taken for sent', () => {
  for (const body of [null, undefined, '', 'OK', 42, [], {}, { next: 7 }, { ok: 'true' }]) {
    assert.deepEqual(outcome(200, body), { kind: 'failed' }, JSON.stringify(body));
  }
  // Nor is a success-shaped body under a status that is not one.
  assert.deepEqual(outcome(500, { next: '/thanks', ok: true }), { kind: 'failed' });
  assert.deepEqual(outcome(302, { next: '/thanks' }), { kind: 'failed' });
});
