import { ROOT_SYMBOL } from "../consts.js";
import { Klander } from "../types.js";

export class KArray<T> implements Klander.Element<T[]> {
  constructor(private element: Klander.Element<T>) {}

  public validate(value: unknown): Klander.ValidationResult<T[]> {
    if (!Array.isArray(value)) {
      return {
        valid: false,
        data: null,
        errors: [{ message: "Value is not an array", location: ROOT_SYMBOL }],
      };
    }

    const errors: Klander.ValidationError[] = [];

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
