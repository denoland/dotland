export type DebouncedFn = (...args: any[]) => void;

export function debounce<T extends DebouncedFn>(fn: T, wait = 500): T {
  let timeout: NodeJS.Timeout | undefined;
  function debounced(this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => fn.apply(this, args), wait);
  }
  return debounced as T;
}
