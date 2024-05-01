export namespace Klander {
  export type Element<T> = {
    validate: (value: unknown) => ValidationResult<T>;
  };

  export type ValidationError = {
    location: string;
    message: string;
  };

  export type ValidationResult<T> =
    | { valid: true; data: T; errors: [] }
    | { valid: false; data: null; errors: ValidationError[] };
}

export type FlatType<T> = T extends object ? { [K in keyof T]: FlatType<T[K]> } : T;
