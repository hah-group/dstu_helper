export const delay: (ms: number) => Promise<void> = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
};
