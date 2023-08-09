export type InfinityPaginationType<T> = Readonly<{
  data: T[];
  hasNextPage: boolean;
}>;
