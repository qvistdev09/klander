import { ROOT_SYMBOL } from "../consts.js";
import { K_Element, K_ValidationError, K_ValidationResult } from "../types.js";

export class K_Array<T> implements K_Element<T[]> {
  constructor(private element: K_Element<T>) {}

  public validate(value: unknown): K_ValidationResult<T[]> {
    if (!Array.isArray(value)) {
      return {
        valid: false,
        data: null,
        errors: [{ message: "Value is not an array", location: ROOT_SYMBOL }],
      };
    }

    const errors: K_ValidationError[] = [];

    value.forEach((arrayElement, index) => {
      const result = this.element.validate(arrayElement);
      if (!result.valid) {
        result.errors.forEach((error) => {
          error.location =
            error.location === ROOT_SYMBOL
              ? `[${index.toString()}]`
              : `[${index.toString()}].${error.location}`;
          errors.push(error);
        });
      }
    });

    if (errors.length === 0) {
      return { valid: true, data: value, errors: [] };
    }

    return { valid: false, data: null, errors };
  }
}
