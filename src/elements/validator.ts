import { ROOT_SYMBOL } from "../consts.js";
import { K_ValidationContainer } from "../core/validation-container.js";
import { K_AsyncValidationCheck, K_ValidationCheck, K_ValidationResult } from "../types.js";

export abstract class K_Validator<T> {
  protected nestedElements: K_Validator<unknown>[] = [];

  protected checks: K_ValidationCheck[] = [];
  protected asyncChecks: K_AsyncValidationCheck[] = [];

  protected addNestedElement(nested: K_Validator<unknown>) {
    this.nestedElements.push(nested);
  }

  protected getAsyncChecks(): K_AsyncValidationCheck[] {
    return [
      ...this.asyncChecks,
      ...this.nestedElements.map((nested) => nested.getAsyncChecks()).flat(),
    ];
  }

  protected addCheck(validator: K_ValidationCheck) {
    this.checks.push(validator);
  }

  /**
   * Adds a custom validation function which adds an error with the given message if it returns false.
   */
  public custom(test: (data: unknown) => boolean, message: string) {
    this.checks.push((data, container) => {
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
    this.asyncChecks.push(async (data, container) => {
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

    for (const validator of this.checks) {
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

    for (const validator of this.checks) {
      validator(data, container);
      if (container.markedForEarlyApproval) {
        return container.toValidResponse<T>(data);
      }
    }

    await Promise.all(this.getAsyncChecks().map((validator) => validator(data, container)));

    if (container.isValid()) {
      return container.toValidResponse<T>(data);
    }

    return container.toErrorResponse<T>();
  }
}
