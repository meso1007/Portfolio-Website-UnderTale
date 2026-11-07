// Tracks how many typewriter instances are currently animating so the app can
// turn the first confirm key press into "reveal the text" instead of "act".

let activeTypers = 0;
const skipListeners = new Set<() => void>();

export const beginTyping = (): (() => void) => {
  activeTypers += 1;
  let ended = false;
  return () => {
    if (ended) return;
    ended = true;
    activeTypers = Math.max(0, activeTypers - 1);
  };
};

export const isTyping = (): boolean => activeTypers > 0;

export const onSkipTyping = (listener: () => void): (() => void) => {
  skipListeners.add(listener);
  return () => {
    skipListeners.delete(listener);
  };
};

export const skipTyping = (): void => {
  skipListeners.forEach((listener) => listener());
};
