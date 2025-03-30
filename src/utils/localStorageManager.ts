
/**
 * Local Storage Manager
 * 
 * Provides functionality to persistently store and retrieve documentation
 * in the browser's localStorage when we can't write to actual files.
 */

const STORAGE_PREFIX = 'cleanmap_docs_';

/**
 * Reads documentation from localStorage
 * @param key The documentation key (typically the file path)
 * @returns The stored content or null if not found
 */
export function readFromStorage(key: string): string | null {
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}${key}`);
  } catch (error) {
    console.error(`Error reading from localStorage for key ${key}:`, error);
    return null;
  }
}

/**
 * Writes documentation to localStorage
 * @param key The documentation key (typically the file path)
 * @param content The content to store
 * @returns True if successful, false otherwise
 */
export function writeToStorage(key: string, content: string): boolean {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, content);
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage for key ${key}:`, error);
    return false;
  }
}

/**
 * Lists all documentation keys in localStorage
 * @returns Array of documentation keys
 */
export function listDocumentationKeys(): string[] {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keys.push(key.substring(STORAGE_PREFIX.length));
      }
    }
    return keys;
  } catch (error) {
    console.error('Error listing documentation keys:', error);
    return [];
  }
}

/**
 * Deletes documentation from localStorage
 * @param key The documentation key to delete
 * @returns True if successful, false otherwise
 */
export function deleteFromStorage(key: string): boolean {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    return true;
  } catch (error) {
    console.error(`Error deleting from localStorage for key ${key}:`, error);
    return false;
  }
}

/**
 * Gets all documentation stored in localStorage
 * @returns Object with all documentation
 */
export function getAllDocumentation(): Record<string, string> {
  const keys = listDocumentationKeys();
  const docs: Record<string, string> = {};
  
  keys.forEach(key => {
    const content = readFromStorage(key);
    if (content) {
      docs[key] = content;
    }
  });
  
  return docs;
}
