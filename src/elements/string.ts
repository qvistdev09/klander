import { ROOT_SYMBOL } from "../consts.js";
import { K_ValidationError } from "../core/validation-error.js";
import { K_Element } from "./element.js";

export class K_String<T extends string = string> extends K_Element<T> {
  constructor() {
    super();
    this.addValidator((data, container) => {
      if (typeof data !== "string") {
        container.addError(new K_ValidationError(ROOT_SYMBOL, "Value must be a string"));
      }
    });
  }

  /**
   * Adds a requirement to enforce a minimum length for the string.
   */
  public min(min: number) {
    this.addValidator((data, container) => {
      if (typeof data === "string" && data.length < min) {
        container.addError(
          new K_ValidationError(ROOT_SYMBOL, `Value must have a minimum of ${min} characters`)
        );
      }
    });
    return this;
  }

  /**
   * Adds a requirement to enforce a maximum length for the string.
   */
  public max(max: number) {
    this.addValidator((data, container) => {
      if (typeof data === "string" && data.length > max) {
        container.addError(
          new K_ValidationError(ROOT_SYMBOL, `Value must not have more than ${max} characters`)
        );
      }
    });
    return this;
  }

  /**
   * Adds a requirement to enforce a specific pattern for the string.
   */
  public pattern(pattern: RegExp) {
    this.addValidator((data, container) => {
      if (typeof data === "string" && !pattern.test(data)) {
        container.addError(
          new K_ValidationError(ROOT_SYMBOL, `Value must match pattern ${pattern.source}`)
        );
      }
    });
    return this;
  }

  /**
   * Adds a requirement to enforce that the string is one of the given values.
   */
  public enum<T extends string>(...values: [T, ...T[]]) {
    this.addValidator((data, container) => {
      if (typeof data === "string" && !(values as string[]).includes(data)) {
        container.addError(
          new K_ValidationError(
            ROOT_SYMBOL,
            `Value must be one of the allowed enum values: ${values.toLocaleString()}`
          )
        );
      }
    });
    return this as unknown as K_String<T>;
  }
}
