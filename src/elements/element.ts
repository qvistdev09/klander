import { ROOT_SYMBOL } from "../consts.js";
import { K_ValidationContainer } from "../core/validation-container.js";
import { K_AsyncValidationCheck, K_ValidationCheck, K_ValidationResult } from "../types.js";

export abstract class K_Element<T> {
  protected nestedElements: K_Element<unknown>[] = [];

  protected validators: K_ValidationCheck[] = [];
  protected asyncValidators: K_AsyncValidationCheck[] = [];

  protected addNestedElement(nested: K_Element<unknown>) {
    this.nestedElements.push(nested);
  }

  protected getAsyncValidators() {
    const asyncValidators: K_AsyncValidationCheck[] = [];
    for (const validator of this.asyncValidators) {
      asyncValidators.push(validator);
    }
    for (const nested of this.nestedElements) {
      for (const nestedValidator of nested.getAsyncValidators()) {
        asyncValidators.push(nestedValidator);
      }
    }
    return asyncValidators;
  }

  protected addValidator(validator: K_ValidationCheck) {
    this.validators.push(validator);
  }

  /**
   * Adds a custom validation function which adds an error with the given message if it returns false.
   */
  public custom(test: (data: unknown) => boolean, message: string) {
    this.validators.push((data, container) => {
      if (!test(data)) {
        container.addNewError(ROOT_SYMBOL, message);
      }
    });
    return this;
  }

  /**
   * Adds a custom async validation function which adds an error with the given message if the promise resolves to false.
   */
  public customAsync(test: (data: unknown) => Promise<boolean>, message: string) {
    this.asyncValidators.push(async (data, container) => {
      const passed = await test(data);
      if (!passed) {
        container.addNewError(ROOT_SYMBOL, message);
      }
    });
    return this;
  }

  /**
   * Validates an unknown value and returns a validation result. Async validations are ignored when using this function. To include async checks, {@link validateAsync}.
   */
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

  /**
   * Validates any value and returns a validation result. Includes async validations.
   */
  public async validateAsync(data: unknown): Promise<K_ValidationResult<T>> {
    const container = new K_ValidationContainer();

    for (const validator of this.validators) {
      validator(data, container);
      if (container.markedForEarlyApproval) {
        return container.toValidResponse<T>(data);
      }
    }

    await Promise.all(this.getAsyncValidators().map((validator) => validator(data, container)));

    if (container.isValid()) {
      return container.toValidResponse<T>(data);
    }

    return container.toErrorResponse<T>();
  }
}
