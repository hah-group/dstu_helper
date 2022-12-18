export type TextFilter<T> = (input: string) => TextFilterResult<T>;

export type TextFilterResult<T> = {
  result: Partial<T>;
  filtered: string;
};
