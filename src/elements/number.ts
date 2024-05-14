import { ROOT_SYMBOL } from "../consts.js";
import { K_Element } from "./element.js";

export class K_Number<T extends number = number> extends K_Element<T> {
  constructor() {
    super();
    this.addValidator((data, container) => {
      if (typeof data !== "number" || Number.isNaN(data)) {
        container.addNewError(ROOT_SYMBOL, "Value must be a number");
      }
    });
  }

  /**
   * Ensures that the number is not lesser than the set minimum value.
   */
  public min(min: number) {
    this.addValidator((data, container) => {
      if (typeof data === "number" && data < min) {
        container.addNewError(ROOT_SYMBOL, `Value must not be lesser than ${min.toString()}`);
      }
    });
    return this;
  }

  /**
   * Ensures that the number is not greater than the set maximum value.
   */
  public max(max: number) {
    this.addValidator((data, container) => {
      if (typeof data === "number" && data > max) {
        container.addNewError(ROOT_SYMBOL, `Value must not be greater than ${max.toString()}`);
      }
    });
    return this;
  }

  /**
   * Ensures that the number is an integer.
   */
  public int() {
    this.addValidator((data, container) => {
      if (typeof data === "number" && !Number.isInteger(data)) {
        container.addNewError(ROOT_SYMBOL, "Value must be an integer");
      }
    });
    return this;
  }

  /**
   * Ensures that the number is one of the given values.
   */
  public enum<T extends number>(...values: [T, ...T[]]) {
    this.addValidator((data, container) => {
      if (typeof data === "number" && !(values as number[]).includes(data)) {
        container.addNewError(
          ROOT_SYMBOL,
          `Value must be one of the allowed enum values: ${values.toLocaleString()}`
        );
      }
    });
    return this as unknown as K_Number<T>;
  }
}
