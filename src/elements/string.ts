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
