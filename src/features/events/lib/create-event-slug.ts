import slugify from "slugify";

export function createEventSlug(name: string, honoreeName: string) {
    const random = Math.random().toString(36).slice(2, 8);

    return slugify(`${name}-${honoreeName}-${random}`, {
        lower: true,
        strict: true,
        trim: true,
    });
}