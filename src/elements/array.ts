import { ROOT_SYMBOL } from "../consts.js";
import { mergeResultIntoContainer, prependArrayIndexToResult } from "../utils.js";
import { K_Element } from "./element.js";

export class K_Array<T> extends K_Element<T[]> {
  constructor(private element: K_Element<T>) {
    super();

    this.addNestedElement(element);

    this.addValidator((data, container) => {
      if (!Array.isArray(data)) {
        container.addNewError(ROOT_SYMBOL, "Value must be an array");
      } else {
        for (const [index, arrayElement] of data.entries()) {
          const result = this.element.validate(arrayElement);
          prependArrayIndexToResult(result, index);
          mergeResultIntoContainer(container, result);
        }
      }
    });
  }

  /**
   * Validates that the array has a minimum of elements.
   */
  public minItems(min: number, message?: string) {
    this.addValidator((data, container) => {
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
    this.addValidator((data, container) => {
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
