export const nearestUp: (value: number, array: number[]) => number | undefined = (value, array) => {
  const sorted = array.sort((a, b) => a - b);
  for (const item of sorted) {
    if (item - value >= 0) return item;
  }
};
