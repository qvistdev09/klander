import { ROOT_SYMBOL } from "../consts.js";
import { K_Element, K_ValidationError, K_ValidationResult } from "../types.js";

export class K_String<T extends string = string> implements K_Element<T> {
  private minLength: null | number = null;
  private maxLength: null | number = null;
  private regex: null | RegExp = null;
  private enumValues: string[] | null = null;

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

  public enum<T extends string>(...values: [T, ...T[]]) {
    this.enumValues = values;
    return this as unknown as K_String<T>;
  }

  public validate(value: unknown): K_ValidationResult<T> {
    const errors: K_ValidationError[] = [];

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

    if (this.enumValues !== null && typeof value === "string" && !this.enumValues.includes(value)) {
      errors.push({
        location: ROOT_SYMBOL,
        message: `Value must be one of the allowed enum values: ${this.enumValues.toLocaleString()}`,
      });
    }

    if (errors.length === 0) {
      return { valid: true, data: value as T, errors: [] };
    }

    return {
      valid: false,
      data: null,
      errors,
    };
  }
}
