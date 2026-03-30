const PREFIX = 'lms_cache:';

export const getCachedValue = (key, ttlMs = 60_000) => {
  const raw = sessionStorage.getItem(`${PREFIX}${key}`);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > ttlMs) {
      sessionStorage.removeItem(`${PREFIX}${key}`);
      return null;
    }
    return parsed.value;
  } catch (_err) {
    sessionStorage.removeItem(`${PREFIX}${key}`);
    return null;
  }
};

export const setCachedValue = (key, value) => {
  sessionStorage.setItem(
    `${PREFIX}${key}`,
    JSON.stringify({
      timestamp: Date.now(),
      value,
    })
  );
};
