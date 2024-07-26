import { ROOT_SYMBOL } from "../consts.js";
import { K_Template } from "../core/template.js";
import { K_Validator } from "./validator.js";

export class K_Boolean<T extends boolean = boolean> extends K_Validator<T> {
  constructor(message?: string);
  constructor(templateOrMessage?: K_Template<K_Boolean<T>> | string) {
    super();
    if (templateOrMessage instanceof K_Template) {
      this.copyChecks(templateOrMessage.template);
      return;
    }

    this.addCheck((data, container) => {
      if (typeof data !== "boolean") {
        container.addNewError(ROOT_SYMBOL, templateOrMessage ?? "Value must be a boolean");
      }
    });
  }

  /**
   * Validates that the boolean is exactly true or false.
   */
  public mustBe = <T extends true | false>(value: T, message?: string) => {
    return this.clone().addCheck((data, container) => {
      if (typeof data === "boolean" && data !== value) {
        container.addNewError(ROOT_SYMBOL, message ?? `Value must be: ${value}`);
      }
    }) as unknown as K_Boolean<T>;
  };
}
