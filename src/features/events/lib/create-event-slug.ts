import slugify from "slugify";

export function createEventSlug(name: string) {
    const random = Math.random().toString(36).slice(2, 8);

    return slugify(`${name}-${random}`, {
        lower: true,
        strict: true,
        trim: true,
    });
}