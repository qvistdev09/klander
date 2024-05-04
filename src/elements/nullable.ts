import { mergeResultIntoContainer } from "../utils.js";
import { K_Element } from "./element.js";

export class K_Nullable<T> extends K_Element<T | null> {
  constructor(private element: K_Element<T>) {
    super();
    this.addValidator((data, container) => {
      if (data === null) {
        return container.markForApproval();
      }
      mergeResultIntoContainer(container, this.element.validate(data));
    });
  }
}
