import { ROOT_SYMBOL } from "../consts";
import { K_ValidationContainer } from "../core/validation-container";
import { K_ValidationError } from "../core/validation-error";
import { K_ValidationCheck, K_ValidationResult } from "../types";

export abstract class K_Element<T> {
  protected validators: K_ValidationCheck[] = [];

  protected addValidator(validator: K_ValidationCheck) {
    this.validators.push(validator);
  }

  public custom(test: (data: unknown) => boolean, message: string) {
    this.validators.push((data, container) => {
      if (!test(data)) {
        container.addError(new K_ValidationError(ROOT_SYMBOL, message));
      }
    });
    return this;
  }

  public validate(data: unknown): K_ValidationResult<T> {
    const container = new K_ValidationContainer();

    for (const validator of this.validators) {
      validator(data, container);
      if (container.markedForEarlyApproval) {
        return container.toValidResponse<T>(data);
      }
    }

    if (container.isValid()) {
      return container.toValidResponse<T>(data);
    }

    return container.toErrorResponse<T>();
  }
}
