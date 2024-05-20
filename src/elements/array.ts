import { ROOT_SYMBOL } from "../consts.js";
import { K_Validator, U_ValidatorInternal } from "./validator.js";

export class K_Array<T> extends K_Validator<T[]> {
  private element: U_ValidatorInternal<T>;

  constructor(element: K_Validator<T>) {
    super();
    this.element = element as U_ValidatorInternal<T>;

    this.addCheck((data, container) => {
      if (!Array.isArray(data)) {
        container.addNewError(ROOT_SYMBOL, "Value must be an array");
      } else {
        data.forEach((arrayElement, index) => {
          const elementValidation = this.element.runSyncChecks(arrayElement);
          elementValidation.prependArrayIndexToErrors(index);
          container.absorbContainer(elementValidation);
        });
      }
    });

    this.addAsyncCheck(async (data, container) => {
      await Promise.all(
        data.map(async (arrayElement, index) => {
          const elementValidation = await this.element.runAsyncChecks(arrayElement);
          elementValidation.prependArrayIndexToErrors(index);
          container.absorbContainer(elementValidation);
        })
      );
    });
  }

  /**
   * Validates that the array has a minimum of elements.
   */
  public minItems(min: number, message?: string) {
    this.addCheck((data, container) => {
      if (Array.isArray(data) && data.length < min) {
        container.addNewError(
          ROOT_SYMBOL,
          message ?? `Array must not have less than ${min} elements`
        );
      }
    });
    return this;
  }

  /**
   * Validates that the array does not have more than the allowed maximum of elements.
   */
  public maxItems(max: number, message?: string) {
    this.addCheck((data, container) => {
      if (Array.isArray(data) && data.length > max) {
        container.addNewError(
          ROOT_SYMBOL,
          message ?? `Array must not have more than ${max} elements`
        );
      }
    });
    return this;
  }
}
