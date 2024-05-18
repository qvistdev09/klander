import { ROOT_SYMBOL } from "../consts.js";
import { K_Validator } from "./validator.js";

export class K_Boolean<T extends boolean = boolean> extends K_Validator<T> {
  constructor() {
    super();
    this.addValidator((data, container) => {
      if (typeof data !== "boolean") {
        container.addNewError(ROOT_SYMBOL, "Value must be a boolean");
      }
    });
  }

  /**
   * Validates that the boolean is exactly true or false.
   */
  public mustBe<T extends true | false>(value: T) {
    this.addValidator((data, container) => {
      if (typeof data === "boolean" && data !== value) {
        container.addNewError(ROOT_SYMBOL, `Value must be: ${value}`);
      }
    });
    return this as unknown as K_Boolean<T>;
  }
}
