import { K_Template } from "../core/template.js";
import { K_Validator, U_ValidatorInternal } from "./validator.js";

export class K_Nullable<T> extends K_Validator<T | null> {
  private element: U_ValidatorInternal<T>;

  constructor(input: K_Validator<T> | K_Template<K_Nullable<T>>) {
    super();

    if (input instanceof K_Template) {
      this.element = input.template.element;
      this.copyChecks(input.template);
      return;
    }

    this.element = input as U_ValidatorInternal<T>;

    this.addCheck((data, container) => {
      if (data === null) {
        return container.markForApproval();
      }
      this.element.runSyncChecks(data, container);
    });

    this.addAsyncCheck(async (data, container) => {
      if (data !== null) {
        await this.element.runAsyncChecks(data, container);
      }
    });
  }
}
