// What Formspree says back to a form posted with fetch, read into the four things the Contact
// form does about it (src/components/Contact.astro). Kept apart from the page so test/ can
// hold it to the replies Formspree documents.
//
// The request, as Formspree's guides give it (the Cloudflare Turnstile guide's plain-JavaScript
// example, April 2026): the form's fields as FormData, POSTed to https://formspree.io/f/<form id>
// with `Accept: application/json`, which is what makes Formspree answer in JSON rather than
// redirect to its own pages. The reply, as Formspree's own client reads it (@formspree/core
// 4.0.0, which its AJAX guide installs):
//   - sent: an object with `next`, the address of its thank-you page. The form's own reply
//     to a message was `{"next":"/thanks","ok":true}`, status 200;
//   - refused: `errors`, a list of `{ code?, field?, message }`. One with a `field` is about
//     that answer (TYPE_EMAIL, REQUIRED_FIELD_EMPTY, REQUIRED_FIELD_MISSING); one without is
//     about the form (EMPTY, BLOCKED, INACTIVE, FORM_NOT_FOUND). Beside it or alone, `error`,
//     a single string. The form's own reply to a post with no fields was status 400,
//     `{"error":"Bad form post request","errors":[{"code":"BAD_FORM_POST_REQUEST",…}]}`;
//   - too many at once: status 429 (its System Limits page: 20 posts a minute to a form).
// The two replies quoted are from the form itself, 4 Oct 2026; a refusal of one field has
// not been seen from it, and is read as the client's types give it.
export type Outcome =
  | { kind: 'sent' }
  /** Formspree turned down particular answers: which, and its code for why. */
  | { kind: 'refused'; fields: { field: string; code: string }[] }
  /** Its rate limit: wait and try again. */
  | { kind: 'busy' }
  /** Anything else, a reply this does not know included: not sent, as far as can be told. */
  | { kind: 'failed' };

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

export const outcome = (status: number, body: unknown): Outcome => {
  if (status === 429) return { kind: 'busy' };
  if (!isObject(body)) return { kind: 'failed' };
  if (Array.isArray(body.errors)) {
    const fields = body.errors
      .filter((e): e is { field: string; code?: unknown } => isObject(e) && typeof e.field === 'string' && e.field !== '')
      .map((e) => ({ field: e.field, code: typeof e.code === 'string' ? e.code : 'UNSPECIFIED' }));
    return fields.length ? { kind: 'refused', fields } : { kind: 'failed' };
  }
  if (typeof body.error === 'string') return { kind: 'failed' };
  // Sent only on a 2xx that says so: a reply that cannot be read is treated as not sent, so
  // the visitor is asked to try again rather than told a message went that may not have.
  const ok = status >= 200 && status < 300;
  return ok && (typeof body.next === 'string' || body.ok === true) ? { kind: 'sent' } : { kind: 'failed' };
};
