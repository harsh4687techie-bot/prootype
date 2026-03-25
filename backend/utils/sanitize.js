import sanitizeHtml from 'sanitize-html';

export function sanitizeContactInput(data) {
  return {
    name: sanitizeHtml(data.name, { allowedTags: [], allowedAttributes: {} }).trim(),
    email: sanitizeHtml(data.email, { allowedTags: [], allowedAttributes: {} }).trim(),
    message: sanitizeHtml(data.message, {
      allowedTags: [],
      allowedAttributes: {}
    }).trim()
  };
}
