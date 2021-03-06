/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

/**
 * Ensure value is not `undefined`
 */
export function existsStrict (value: any) {
  return value !== undefined && value !== null
}

/**
 * Ensure that value exists. Empty string, null and undefined
 * fails the exists check.
 */
export function exists (value: any) {
  return !!value || value === false || value === 0
}

/**
 * Ensure value is a valid Object. Returns false for `Array` and `null`
 */
export function isObject (value: any) {
  return value !== null && typeof (value) === 'object' && !Array.isArray(value)
}
