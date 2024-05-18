import { mergeResultIntoContainer } from "../utils.js";
import { K_Validator } from "./validator.js";

export class K_Nullable<T> extends K_Validator<T | null> {
  constructor(private element: K_Validator<T>) {
    super();

    this.addNestedElement(element);

    this.addValidator((data, container) => {
      if (data === null) {
        return container.markForApproval();
      }
      mergeResultIntoContainer(container, this.element.validate(data));
    });
  }
}
