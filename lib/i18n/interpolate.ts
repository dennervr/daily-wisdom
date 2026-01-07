/**
 * String Interpolation Utility
 * 
 * Safely interpolates variables into translated strings.
 * Supports format: "Hello, {name}!" with values: { name: "World" }
 */

export type InterpolationValues = Record<string, string | number | boolean | null | undefined>

/**
 * Interpolate variables into a string template
 * 
 * @param template - String with placeholders like "Hello, {name}!"
 * @param values - Object with values to interpolate
 * @returns Interpolated string
 * 
 * @example
 * interpolate("Hello, {name}!", { name: "World" })
 * // Returns: "Hello, World!"
 * 
 * @example
 * interpolate("You have {count} items", { count: 5 })
 * // Returns: "You have 5 items"
 */
export function interpolate(template: string, values?: InterpolationValues): string {
  if (!values || Object.keys(values).length === 0) {
    return template
  }
  
  return template.replace(/\{([^}]+)\}/g, (match, key) => {
    const trimmedKey = key.trim()
    
    if (trimmedKey in values) {
      const value = values[trimmedKey]
      
      // Handle null and undefined
      if (value === null || value === undefined) {
        return ''
      }
      
      // Convert to string
      return String(value)
    }
    
    // If key not found, return the original placeholder
    return match
  })
}

/**
 * Check if a string contains interpolation placeholders
 */
export function hasInterpolation(str: string): boolean {
  return /\{[^}]+\}/.test(str)
}

/**
 * Extract placeholder keys from a template string
 */
export function extractPlaceholders(template: string): string[] {
  const matches = template.match(/\{([^}]+)\}/g)
  if (!matches) return []
  
  return matches.map(match => match.slice(1, -1).trim())
}
