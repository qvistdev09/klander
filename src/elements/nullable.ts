import { K_Validator, U_ValidatorInternal } from "./validator.js";

export class K_Nullable<T> extends K_Validator<T | null> {
  private element: U_ValidatorInternal<T>;

  constructor(element: K_Validator<T>) {
    super();
    this.element = element as U_ValidatorInternal<T>;

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
