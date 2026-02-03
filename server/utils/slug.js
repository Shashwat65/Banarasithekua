const slugify = (value) => {
  if (!value) return '';
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

const generateUniqueSlug = async (Model, base, id) => {
  let baseSlug = slugify(base);
  if (!baseSlug) baseSlug = `item-${Date.now()}`;

  const buildQuery = (slug) => ({
    slug,
    ...(id ? { _id: { $ne: id } } : {}),
  });

  let existing = await Model.findOne(buildQuery(baseSlug));
  if (!existing) return baseSlug;

  let counter = 2;
  while (existing) {
    const candidate = `${baseSlug}-${counter}`;
    existing = await Model.findOne(buildQuery(candidate));
    if (!existing) return candidate;
    counter += 1;
  }

  return baseSlug;
};

module.exports = { slugify, generateUniqueSlug };
