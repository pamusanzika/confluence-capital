/**
 * Converts a blog post title into a URL-safe slug.
 * Example: "My Blog Post Title!" → "my-blog-post-title"
 */
export function slugify(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')   // remove special chars
    .replace(/\s+/g, '-')            // spaces → hyphens
    .replace(/-+/g, '-');            // collapse duplicate hyphens
}
