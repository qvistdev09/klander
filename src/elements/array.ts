import { ROOT_SYMBOL } from "../consts.js";
import { K_ValidationError } from "../core/validation-error.js";
import { mergeResultIntoContainer, prependArrayIndexToResult } from "../utils.js";
import { K_Element } from "./element.js";

export class K_Array<T> extends K_Element<T[]> {
  constructor(private element: K_Element<T>) {
    super();

    this.addNestedElement(element);

    this.addValidator((data, container) => {
      if (!Array.isArray(data)) {
        container.addError(new K_ValidationError(ROOT_SYMBOL, "Value must be an array"));
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
   * Adds a requirement to ensure that the array has at least a minimum number of elements.
   */
  public minItems(min: number, message?: string) {
    this.addValidator((data, container) => {
      if (Array.isArray(data) && data.length < min) {
        container.addError(
          new K_ValidationError(
            ROOT_SYMBOL,
            message ?? `Array must not have less than ${min} elements`
          )
        );
      }
    });
    return this;
  }

  /**
   * Adds a requirement to ensure that the array has at most a maximum number of elements.
   */
  public maxItems(max: number, message?: string) {
    this.addValidator((data, container) => {
      if (Array.isArray(data) && data.length > max) {
        container.addError(
          new K_ValidationError(
            ROOT_SYMBOL,
            message ?? `Array must not have more than ${max} elements`
          )
        );
      }
    });
    return this;
  }
}
