import { K_Element, K_ValidationResult } from "../types.js";

export class K_Nullable<T> implements K_Element<T | null> {
  constructor(private element: K_Element<T>) {}

  public validate(value: unknown): K_ValidationResult<T | null> {
    if (value === null) {
      return { valid: true, data: null, errors: [] };
    }
    return this.element.validate(value);
  }
}
