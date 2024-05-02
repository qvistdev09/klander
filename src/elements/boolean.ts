import { ROOT_SYMBOL } from "../consts.js";
import { K_Element, K_ValidationError, K_ValidationResult } from "../types.js";

export class K_Boolean<T extends boolean = boolean> implements K_Element<T> {
  private mustBeValue: boolean | null = null;

  public mustBe<T extends true | false>(value: T) {
    this.mustBeValue = value;
    return this as unknown as K_Boolean<T>;
  }

  public validate(value: unknown): K_ValidationResult<T> {
    const errors: K_ValidationError[] = [];

    if (typeof value !== "boolean") {
      errors.push({ location: ROOT_SYMBOL, message: "Value must be a boolean" });
    }

    if (this.mustBeValue !== null && typeof value === "boolean" && value !== this.mustBeValue) {
      errors.push({ location: ROOT_SYMBOL, message: `Value must be: ${this.mustBeValue}` });
    }

    if (errors.length === 0) {
      return { valid: true, data: value as T, errors: [] };
    }

    return { valid: false, data: null, errors };
  }
}
