import { ROOT_SYMBOL } from "../consts.js";
import { K_Template } from "../core/template.js";
import { K_Validator } from "./validator.js";

export class K_String<T extends string = string> extends K_Validator<T> {
  constructor(message?: string);
  constructor(template?: K_Template<K_String<T>>);
  constructor(messageOrTemplate?: K_Template<K_String<T>> | string) {
    super();

    if (messageOrTemplate instanceof K_Template) {
      this.copyChecks(messageOrTemplate.template);
      return;
    }

    this.addCheck((data, container) => {
      if (typeof data !== "string") {
        container.addNewError(ROOT_SYMBOL, messageOrTemplate ?? "Value must be a string");
      }
    });
  }

  /**
   * Enforces a minimum length for the string.
   */
  public min = (min: number, message?: string) => {
    return this.clone().addCheck((data, container) => {
      if (typeof data === "string" && data.length < min) {
        container.addNewError(
          ROOT_SYMBOL,
          message ?? `Value must have a minimum of ${min} characters`
        );
      }
    });
  };

  /**
   * Enforces a maximum length for the string.
   */
  public max = (max: number, message?: string) => {
    return this.clone().addCheck((data, container) => {
      if (typeof data === "string" && data.length > max) {
        container.addNewError(
          ROOT_SYMBOL,
          message ?? `Value must not have more than ${max} characters`
        );
      }
    });
  };

  /**
   * Enforces a regex pattern for the string.
   */
  public pattern = (pattern: RegExp, message?: string) => {
    return this.clone().addCheck((data, container) => {
      if (typeof data === "string" && !pattern.test(data)) {
        container.addNewError(ROOT_SYMBOL, message ?? `Value must match pattern ${pattern.source}`);
      }
    });
  };

  /**
   * Ensures that the string is one of the given values.
   */
  public enum = <T extends string>(values: [T, ...T[]], message?: string) => {
    return this.clone().addCheck((data, container) => {
      if (typeof data === "string" && !(values as string[]).includes(data)) {
        container.addNewError(
          ROOT_SYMBOL,
          message ?? `Value must be one of the allowed enum values: ${values.toLocaleString()}`
        );
      }
    }) as unknown as K_String<T>;
  };
}
