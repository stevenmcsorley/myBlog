export function countWords(str: string): number {
  return str.trim().split(/\s+/).length;
}
