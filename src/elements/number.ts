import { ROOT_SYMBOL } from "../consts";
import { K_ValidationError } from "../core/validation-error";
import { K_Element } from "./element";

export class K_Number<T extends number = number> extends K_Element<T> {
  constructor() {
    super();
    this.addValidator((data, container) => {
      if (typeof data !== "number" || Number.isNaN(data)) {
        container.addError(new K_ValidationError(ROOT_SYMBOL, "Value must be a number"));
      }
    });
  }

  public min(min: number) {
    this.addValidator((data, container) => {
      if (typeof data === "number" && data < min) {
        container.addError(
          new K_ValidationError(ROOT_SYMBOL, `Value must not be lesser than ${min.toString()}`)
        );
      }
    });
    return this;
  }

  public max(max: number) {
    this.addValidator((data, container) => {
      if (typeof data === "number" && data > max) {
        container.addError(
          new K_ValidationError(ROOT_SYMBOL, `Value must not be greater than ${max.toString()}`)
        );
      }
    });
    return this;
  }

  public int() {
    this.addValidator((data, container) => {
      if (typeof data === "number" && !Number.isInteger(data)) {
        container.addError(new K_ValidationError(ROOT_SYMBOL, "Value must be an integer"));
      }
    });
    return this;
  }

  public enum<T extends number>(...values: [T, ...T[]]) {
    this.addValidator((data, container) => {
      if (typeof data === "number" && !(values as number[]).includes(data)) {
        container.addError(
          new K_ValidationError(
            ROOT_SYMBOL,
            `Value must be one of the allowed enum values: ${values.toLocaleString()}`
          )
        );
      }
    });
    return this as unknown as K_Number<T>;
  }
}
