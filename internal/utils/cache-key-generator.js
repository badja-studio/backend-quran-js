/**
 * Generate consistent cache keys for requests
 *
 * Convention: quran:{module}:{entity}:{identifier}:{metadata}:v1
 *
 * Examples:
 * - quran:dashboard:overview:v1
 * - quran:master:provinces:all:v1
 * - quran:master:cities:province:12:v1
 * - quran:participants:page:1:limit:10:status:SUDAH:v1
 * - quran:participants:profile:user:123:v1
 */

/**
 * Generate cache key from Express request
 * @param {Object} req - Express request object
 * @param {Object} options - Additional options
 * @param {boolean} options.userSpecific - Include user ID in key
 * @param {string} options.prefix - Custom prefix (default: 'quran')
 * @returns {string} Cache key
 */
function generateCacheKey(req, options = {}) {
  const parts = [options.prefix || 'quran'];

  // Add module/endpoint path
  // Remove /api/ prefix and convert slashes to colons
  const path = req.path
    .replace(/^\/api\//, '')
    .replace(/\//g, ':')
    .replace(/^:/, ''); // Remove leading colon if any

  parts.push(path);

  // Add user context (if authenticated and user-specific)
  if (req.user && options.userSpecific) {
    parts.push(`user:${req.user.id}`);
  }

  // Add query params (sorted for consistency)
  if (Object.keys(req.query).length > 0) {
    const sortedParams = Object.keys(req.query)
      .sort()
      .map(key => `${key}:${req.query[key]}`)
      .join(':');
    parts.push(sortedParams);
  }

  // Add version
  parts.push('v1');

  return parts.join(':');
}

/**
 * Generate simple cache key from components
 * @param {Array<string>} components - Key components
 * @returns {string} Cache key
 */
function generateSimpleKey(...components) {
  return ['quran', ...components, 'v1'].join(':');
}

/**
 * Generate dashboard cache key
 * @param {string} endpoint - Dashboard endpoint name
 * @returns {string} Cache key
 */
function generateDashboardKey(endpoint) {
  return `quran:dashboard:${endpoint}:v1`;
}

/**
 * Generate master data cache key
 * @param {string} entity - Entity name (provinces, cities, districts, villages)
 * @param {Object} params - Optional parameters (provinceId, cityId, etc.)
 * @returns {string} Cache key
 */
function generateMasterDataKey(entity, params = {}) {
  const parts = ['quran', 'master', entity];

  if (params.provinceId) {
    parts.push(`province:${params.provinceId}`);
  }
  if (params.cityId) {
    parts.push(`city:${params.cityId}`);
  }
  if (params.districtId) {
    parts.push(`district:${params.districtId}`);
  }

  parts.push('v1');
  return parts.join(':');
}

/**
 * Generate export result cache key
 * @param {string} jobId - BullMQ job ID
 * @returns {string} Cache key
 */
function generateExportResultKey(jobId) {
  return `quran:export:result:${jobId}`;
}

module.exports = {
  generateCacheKey,
  generateSimpleKey,
  generateDashboardKey,
  generateMasterDataKey,
  generateExportResultKey
};
