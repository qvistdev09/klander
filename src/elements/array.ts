import { ROOT_SYMBOL } from "../consts.js";
import { K_ValidationError } from "../core/validation-error.js";
import { prependArrayIndex } from "../utils.js";
import { K_Element } from "./element.js";

export class K_Array<T> extends K_Element<T[]> {
  constructor(private element: K_Element<T>) {
    super();

    this.addValidator((data, container) => {
      if (!Array.isArray(data)) {
        container.addError(new K_ValidationError(ROOT_SYMBOL, "Value must be an array"));
      } else {
        for (const [index, arrayElement] of data.entries()) {
          const result = this.element.validate(arrayElement);
          if (!result.valid) {
            for (const error of result.errors) {
              prependArrayIndex(error, index);
              container.addError(error);
            }
          }
        }
      }
    });
  }
}
