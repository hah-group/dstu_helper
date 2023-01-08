export const NormalizeGroup: (string: string) => string = (string) => {
  string = string.toLowerCase();
  return string.replace(/[^а-яёa-z\d]/gi, '');
};
