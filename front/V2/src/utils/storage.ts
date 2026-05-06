export function setStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStorage<T>(key: string, fallback: T): T {
  const rawValue = localStorage.getItem(key);

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

export function removeStorage(key: string) {
  localStorage.removeItem(key);
}

export function setSessionStorage<T>(key: string, value: T) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function getSessionStorage<T>(key: string, fallback: T): T {
  const rawValue = sessionStorage.getItem(key);

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

export function removeSessionStorage(key: string) {
  sessionStorage.removeItem(key);
}
