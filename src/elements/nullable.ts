import { K_Template } from "../core/template.js";
import { K_Validator, U_ValidatorInternal } from "./validator.js";

export class K_Nullable<T> extends K_Validator<T | null> {
  private element: U_ValidatorInternal<T>;

  constructor(base: K_Validator<T>);
  constructor(template: K_Template<K_Nullable<T>>);
  constructor(baseOrTemplate: K_Validator<T> | K_Template<K_Nullable<T>>) {
    super();

    if (baseOrTemplate instanceof K_Template) {
      this.element = baseOrTemplate.template.element;
      this.copyChecks(baseOrTemplate.template);
      return;
    }

    this.element = baseOrTemplate as U_ValidatorInternal<T>;

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
