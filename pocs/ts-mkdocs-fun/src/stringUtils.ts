export function reverse(str: string): string {
  return str.split("").reverse().join("");
}

export function capitalize(str: string): string {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function isPalindrome(str: string): boolean {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === reverse(cleaned);
}

export function wordCount(str: string): number {
  if (str.trim().length === 0) return 0;
  return str.trim().split(/\s+/).length;
}
