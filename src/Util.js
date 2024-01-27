/**
 * Checks if value is null or undefined
 * @param {any} value
 * @returns true if null or undefined, false otherwise
 */
export function valueMissing(value) {
  return value === null || value === undefined;
}

export function valuePresent(value) {
  return !valueMissing(value);
}

/**
 * Checks if value is null or undefined, or if empty string or only whitespace. Does NOT check if type is string.
 * @param {any} str
 * @returns true if null, undefined, or empty string or only whitespace, false otherwise
 */
export function stringBlank(str) {
  return valueMissing(str) || ("" + str).trim().length === 0;
}
