type Join<K, P> = K extends string | number ? (P extends string | number ? `${K}.${P}` : never) : never;

export type NestedKeyOf<T> = {
  [K in keyof T & (string | number)]: T[K] extends Record<string, any> ? K | Join<K, NestedKeyOf<T[K]>> : K;
}[keyof T & (string | number)];

export type GetNestedValue<T, K> = K extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? GetNestedValue<T[Key], Rest>
    : never
  : K extends keyof T
    ? T[K]
    : never;
