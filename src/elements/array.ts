import { ROOT_SYMBOL } from "../consts.js";
import { K_Template } from "../core/template.js";
import { K_Validator, U_ValidatorInternal } from "./validator.js";

export class K_Array<T> extends K_Validator<T[]> {
  private element: U_ValidatorInternal<T>;

  constructor(validator: K_Validator<T>, message?: string);
  constructor(template: K_Template<K_Array<T>>);
  constructor(templateOrValidator: K_Validator<T> | K_Template<K_Array<T>>, message?: string) {
    super();

    if (templateOrValidator instanceof K_Template) {
      this.element = templateOrValidator.template.element;
      this.copyChecks(templateOrValidator.template);
      return;
    }

    this.element = templateOrValidator as U_ValidatorInternal<T>;

    this.addCheck((data, container) => {
      if (!Array.isArray(data)) {
        container.addNewError(ROOT_SYMBOL, message ?? "Value must be an array");
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
  public minItems = (min: number, message?: string) => {
    return this.clone().addCheck((data, container) => {
      if (Array.isArray(data) && data.length < min) {
        container.addNewError(
          ROOT_SYMBOL,
          message ?? `Array must not have less than ${min} elements`
        );
      }
    });
  };

  /**
   * Validates that the array does not have more than the allowed maximum of elements.
   */
  public maxItems = (max: number, message?: string) => {
    return this.clone().addCheck((data, container) => {
      if (Array.isArray(data) && data.length > max) {
        container.addNewError(
          ROOT_SYMBOL,
          message ?? `Array must not have more than ${max} elements`
        );
      }
    });
  };
}
