// src/libs/common/utils/parseBoolean.util.ts

/**
 * Converts a string to boolean.
 * Accepts "true"/"false" (case-insensitive) or boolean values.
 * Throws an error if the input cannot be converted.
 */
export function parseBoolean(value: string | boolean): boolean {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    const lowerValue = value.trim().toLowerCase()
    if (lowerValue === 'true') return true
    if (lowerValue === 'false') return false
  }

  throw new Error(`Can't cast "${value}" to boolean.`)
}

// Example usage
// console.log(parseBoolean('true'))  // true
// console.log(parseBoolean('FALSE')) // false
// console.log(parseBoolean(true))    // true
