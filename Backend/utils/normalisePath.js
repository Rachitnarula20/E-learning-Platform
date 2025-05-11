/**
 * Convert any Windows-style back‑slashes to forward slashes
 * so URLs work correctly on the web.
 *
 * @param {string} p  original path (e.g. "uploads\\foo.png")
 * @returns {string}  normalised path (e.g. "uploads/foo.png")
 */
export const normalisePath = (p = "") => p.replace(/\\/g, "/");
