import { ROOT_SYMBOL } from "../consts.js";
import { K_Template } from "../core/template.js";
import { K_Validator } from "./validator.js";

export class K_Number<T extends number = number> extends K_Validator<T> {
  constructor(template?: K_Template<K_Number<T>>) {
    super();

    if (template) {
      this.copyChecks(template.template);
      return;
    }

    this.addCheck((data, container) => {
      if (typeof data !== "number" || Number.isNaN(data)) {
        container.addNewError(ROOT_SYMBOL, "Value must be a number");
      }
    });
  }

  /**
   * Ensures that the number is not lesser than the set minimum value.
   */
  public min = (min: number) => {
    return this.clone().addCheck((data, container) => {
      if (typeof data === "number" && data < min) {
        container.addNewError(ROOT_SYMBOL, `Value must not be lesser than ${min.toString()}`);
      }
    });
  };

  /**
   * Ensures that the number is not greater than the set maximum value.
   */
  public max = (max: number) => {
    return this.clone().addCheck((data, container) => {
      if (typeof data === "number" && data > max) {
        container.addNewError(ROOT_SYMBOL, `Value must not be greater than ${max.toString()}`);
      }
    });
  };

  /**
   * Ensures that the number is an integer.
   */
  public int = () => {
    return this.clone().addCheck((data, container) => {
      if (typeof data === "number" && !Number.isInteger(data)) {
        container.addNewError(ROOT_SYMBOL, "Value must be an integer");
      }
    });
  };

  /**
   * Ensures that the number is one of the given values.
   */
  public enum = <T extends number>(...values: [T, ...T[]]) => {
    return this.clone().addCheck((data, container) => {
      if (typeof data === "number" && !(values as number[]).includes(data)) {
        container.addNewError(
          ROOT_SYMBOL,
          `Value must be one of the allowed enum values: ${values.toLocaleString()}`
        );
      }
    }) as unknown as K_Number<T>;
  };
}
