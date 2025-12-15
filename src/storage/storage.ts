export function loadFromStorage<T>(key: string, fallback: T): T {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
}

export function saveToStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}
