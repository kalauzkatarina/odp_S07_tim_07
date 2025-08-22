function SaveValueByKey(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.error(`Error while saving to localStorage for key '${key}':`, error)
    return false
  }
}

function ReadValueByKey(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error(`Error while reading from localStorage for key '${key}':`, error)
    return null
  }
}

function DeleteValueByKey(key: string): boolean {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error while deleting from localStorage for key '${key}':`, error)
    return false
  }
}

export { SaveValueByKey, ReadValueByKey, DeleteValueByKey };