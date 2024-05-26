import { ROOT_SYMBOL } from "../consts.js";
import { K_Template } from "../core/template.js";
import { K_Validator } from "./validator.js";

export class K_Boolean<T extends boolean = boolean> extends K_Validator<T> {
  constructor(template?: K_Template<K_Boolean<T>>) {
    super();
    if (template) {
      this.copyChecks(template.template);
      return;
    }

    this.addCheck((data, container) => {
      if (typeof data !== "boolean") {
        container.addNewError(ROOT_SYMBOL, "Value must be a boolean");
      }
    });
  }

  /**
   * Validates that the boolean is exactly true or false.
   */
  public mustBe = <T extends true | false>(value: T) => {
    return this.clone().addCheck((data, container) => {
      if (typeof data === "boolean" && data !== value) {
        container.addNewError(ROOT_SYMBOL, `Value must be: ${value}`);
      }
    }) as unknown as K_Boolean<T>;
  };
}
