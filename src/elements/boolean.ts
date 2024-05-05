import { ROOT_SYMBOL } from "../consts.js";
import { K_ValidationError } from "../core/validation-error.js";
import { K_Element } from "./element.js";

export class K_Boolean<T extends boolean = boolean> extends K_Element<T> {
  constructor() {
    super();
    this.addValidator((data, container) => {
      if (typeof data !== "boolean") {
        container.addError(new K_ValidationError(ROOT_SYMBOL, "Value must be a boolean"));
      }
    });
  }

  /**
   * Adds a requirement that the given value must be exactly true or false.
   */
  public mustBe<T extends true | false>(value: T) {
    this.addValidator((data, container) => {
      if (typeof data === "boolean" && data !== value) {
        container.addError(new K_ValidationError(ROOT_SYMBOL, `Value must be: ${value}`));
      }
    });
    return this as unknown as K_Boolean<T>;
  }
}
