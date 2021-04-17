interface LocalStorageItem {
  value: Record<string, unknown>;
  expiry?: number;
}

export function getWithExpiry(key: string): null | LocalStorageItem {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

export function setWithExpiry(
  key: string,
  value: Record<string, unknown>,
  ttl: number,
): void {
  const now = new Date();
  const item = {
    value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}
