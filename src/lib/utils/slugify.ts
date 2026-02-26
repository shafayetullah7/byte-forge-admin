/**
 * Generates a URL-friendly slug from a string.
 * - Converts to lowercase
 * - Normalizes diacritics (e.g., é -> e)
 * - Replaces spaces and underscores with hyphens
 * - Removes non-alphanumeric characters (except hyphens)
 * - Trims leading and trailing hyphens
 * - Collapses multiple consecutive hyphens
 */
export function slugify(text: string): string {
    if (!text) return "";

    return text
        // Convert to string and normalize to base letters (decompose accents)
        .toString()
        .normalize('NFD')
        // Remove diacritics
        .replace(/[\u0300-\u036f]/g, '')
        // Convert to lowercase
        .toLowerCase()
        // Replace spaces and underscores with hyphens
        .replace(/[\s_]+/g, '-')
        // Remove all non-alphanumeric chars (keep hyphens)
        .replace(/[^a-z0-9-]/g, '')
        // Collapse multiple hyphens into one
        .replace(/-+/g, '-')
        // Trim leading/trailing hyphens
        .replace(/^-+|-+$/g, '');
}
