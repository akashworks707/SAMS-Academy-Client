export class StorageService {
  private static readonly PREFIX = 'sams_'

  static setItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(this.PREFIX + key, serialized)
    } catch (error) {
      console.error(`[StorageService] Failed to set ${key}:`, error)
    }
  }

  static getItem<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const item = localStorage.getItem(this.PREFIX + key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`[StorageService] Failed to get ${key}:`, error)
      return defaultValue
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(this.PREFIX + key)
    } catch (error) {
      console.error(`[StorageService] Failed to remove ${key}:`, error)
    }
  }

  static clear(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('[StorageService] Failed to clear storage:', error)
    }
  }
}

// Initialize data from localStorage or dummy data
export function initializeDataFromStorage<T>(
  key: string,
  defaultData: T[]
): T[] {
  const stored = StorageService.getItem<T[]>(key)
  return stored && Array.isArray(stored) ? stored : defaultData
}

// Persist data to localStorage
export function persistToStorage<T>(key: string, data: T[]): void {
  StorageService.setItem(key, data)
}