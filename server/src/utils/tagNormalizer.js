/**
 * Canonical dictionary for case-insensitive tech stack tag normalization and deduplication on server.
 */
const CANONICAL_TAG_MAP = {
  'tailwind': 'Tailwind CSS',
  'tailwind css': 'Tailwind CSS',
  'tailwindcss': 'Tailwind CSS',
  'react': 'React.js',
  'react.js': 'React.js',
  'reactjs': 'React.js',
  'node': 'Node.js',
  'node.js': 'Node.js',
  'nodejs': 'Node.js',
  'express': 'Express.js',
  'express.js': 'Express.js',
  'expressjs': 'Express.js',
  'mongodb': 'MongoDB',
  'mongo': 'MongoDB',
  'redux': 'Redux Toolkit',
  'redux toolkit': 'Redux Toolkit',
  'javascript': 'JavaScript',
  'js': 'JavaScript',
  'javascript (es6+)': 'JavaScript',
  'c': 'C',
  'c language': 'C',
  'c programming': 'C',
  'c/c++': 'C',
  'mysql': 'MySQL',
  'vue': 'Vue.js',
  'vue.js': 'Vue.js',
  'vuejs': 'Vue.js',
  'chart.js': 'Chart.js',
  'chartjs': 'Chart.js',
  'stripe': 'Stripe',
  'redis': 'Redis',
  'docker': 'Docker',
  'dnd kit': 'DnD Kit',
  'valgrind': 'Valgrind',
  'makefile': 'Makefile',
  'posix api': 'POSIX API',
  'gdb': 'GDB',
  'git': 'Git & GitHub',
  'github': 'Git & GitHub',
  'git & github': 'Git & GitHub',
  'typescript': 'TypeScript',
  'ts': 'TypeScript',
};

/**
 * Normalize an individual tag string into its canonical casing.
 */
const normalizeTag = (tag) => {
  if (!tag || typeof tag !== 'string') return '';
  const trimmed = tag.trim();
  const lower = trimmed.toLowerCase();
  return CANONICAL_TAG_MAP[lower] || trimmed;
};

/**
 * Deduplicate and normalize an array of tags case-insensitively.
 */
const normalizeTags = (tags) => {
  if (!Array.isArray(tags)) return [];
  const seen = new Set();
  const normalizedList = [];

  for (const tag of tags) {
    const canonical = normalizeTag(tag);
    if (!canonical) continue;
    const lower = canonical.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      normalizedList.push(canonical);
    }
  }

  return normalizedList;
};

module.exports = {
  CANONICAL_TAG_MAP,
  normalizeTag,
  normalizeTags,
};
