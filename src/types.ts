export type K_Element<T> = {
  validate: (value: unknown) => K_ValidationResult<T>;
};

export type K_ValidationError = {
  location: string;
  message: string;
};

export type K_ValidationResult<T> =
  | { valid: true; data: T; errors: [] }
  | { valid: false; data: null; errors: K_ValidationError[] };

export type FlatType<T> = T extends object ? { [K in keyof T]: FlatType<T[K]> } : T;
