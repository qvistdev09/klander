import { ROOT_SYMBOL } from "../consts.js";
import { Klander } from "../types.js";

export class String implements Klander.Element<string> {
  private minLength: null | number = null;
  private maxLength: null | number = null;
  private regex: null | RegExp = null;

  constructor() {}

  public min(min: number) {
    this.minLength = min;
    return this;
  }

  public max(max: number) {
    this.maxLength = max;
    return this;
  }

  public pattern(pattern: RegExp) {
    this.regex = pattern;
    return this;
  }

  public validate(value: unknown): Klander.ValidationResult<string> {
    const errors: Klander.ValidationError[] = [];

    if (typeof value !== "string") {
      errors.push({ location: ROOT_SYMBOL, message: "Value is not a string" });
    }

    if (this.minLength !== null && typeof value === "string" && value.length < this.minLength) {
      errors.push({
        location: ROOT_SYMBOL,
        message: `Value must have a minimum of ${this.minLength} characters`,
      });
    }

    if (this.maxLength !== null && typeof value === "string" && value.length > this.maxLength) {
      errors.push({
        location: ROOT_SYMBOL,
        message: `Value must not have more than ${this.maxLength} characters`,
      });
    }

    if (this.regex !== null && typeof value === "string" && !this.regex.test(value)) {
      errors.push({
        location: ROOT_SYMBOL,
        message: `Value must match pattern ${this.regex.source}`,
      });
    }

    if (errors.length === 0) {
      return { valid: true, data: "hello", errors: [] };
    }

    return {
      valid: false,
      data: null,
      errors,
    };
  }
}
