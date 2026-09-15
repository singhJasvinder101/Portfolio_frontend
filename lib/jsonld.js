// Escapes "<" so user-entered content (post titles, excerpts) can't break out
// of the <script> tag when injected via dangerouslySetInnerHTML.
export function jsonLdScript(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
