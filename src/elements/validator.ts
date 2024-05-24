import { ROOT_SYMBOL } from "../consts.js";
import { K_Template } from "../core/template.js";
import { K_ValidationContainer } from "../core/validation-container.js";
import {
  K_AsyncCustomValidationCheck,
  K_CustomValidationCheck,
  K_ValidationCheck,
  K_ValidationResult,
} from "../types.js";

export abstract class K_Validator<T> {
  protected checks: K_ValidationCheck[] = [];
  protected customChecks: K_CustomValidationCheck<T>[] = [];
  protected asyncCustomChecks: K_AsyncCustomValidationCheck<T>[] = [];

  protected clone() {
    return new (this as any).constructor(new K_Template(this)) as typeof this;
  }

  protected addCheck(validator: K_ValidationCheck) {
    this.checks.push(validator);
    return this;
  }

  protected addCustomCheck(validator: K_CustomValidationCheck<T>) {
    this.customChecks.push(validator);
    return this;
  }

  protected addCustomAsync(validator: K_AsyncCustomValidationCheck<T>) {
    this.asyncCustomChecks.push(validator);
    return this;
  }

  protected copyChecks(target: K_Validator<any>) {
    this.checks = [...target.checks];
    this.customChecks = [...target.customChecks];
    this.asyncCustomChecks = [...target.asyncCustomChecks];
    return this;
  }

  protected addAsyncCheck(check: K_AsyncCustomValidationCheck<T>) {
    this.asyncCustomChecks.push(check);
    return this;
  }

  protected runSyncChecks(
    data: unknown,
    container: K_ValidationContainer = new K_ValidationContainer()
  ) {
    this.checks.forEach((check) => check(data, container));
    if (container.isValid()) {
      this.customChecks.forEach((check) => check(data as T, container));
    }
    return container;
  }

  protected async runAsyncChecks(
    data: T,
    container: K_ValidationContainer = new K_ValidationContainer()
  ) {
    await Promise.all(this.asyncCustomChecks.map((check) => check(data, container)));
    return container;
  }

  /**
   * Adds a custom validation check. It should return a string with an error message when invalid, otherwise return void.
   */
  public custom(check: CustomCheck<T>) {
    return this.clone().addCustomCheck((data, container) => {
      const output = check(data);
      if (typeof output === "string") {
        container.addNewError(ROOT_SYMBOL, output);
      }
    });
  }

  /**
   * Adds a custom async validation check. It should return a string with an error message when invalid, otherwise return void.
   */
  public customAsync(check: CustomAsyncCheck<T>) {
    return this.clone().addCustomAsync(async (data, container) => {
      const output = await check(data);
      if (typeof output === "string") {
        container.addNewError(ROOT_SYMBOL, output);
      }
    });
  }

  /**
   * Validates an unknown value and returns a validation result. Async validations are ignored when using this function. To include async checks, {@link validateAsync}.
   */
  public validate(data: unknown): K_ValidationResult<T> {
    const container = this.runSyncChecks(data);

    return container.isValid()
      ? container.toValidResponse<T>(data)
      : container.toErrorResponse<T>();
  }

  /**
   * Validates any value and returns a validation result. Includes async validations.
   */
  public async validateAsync(data: unknown): Promise<K_ValidationResult<T>> {
    const container = this.runSyncChecks(data);

    if (container.isValid()) {
      await this.runAsyncChecks(data as T, container);
    }

    return container.isValid()
      ? container.toValidResponse<T>(data)
      : container.toErrorResponse<T>();
  }
}

type CustomCheck<T> = (data: T) => string | void;

type CustomAsyncCheck<T> = (data: T) => Promise<string | void>;

export type U_ValidatorInternal<T> = K_Validator<T> & {
  runSyncChecks: (data: unknown, container?: K_ValidationContainer) => K_ValidationContainer;
  runAsyncChecks: (data: T, container?: K_ValidationContainer) => Promise<K_ValidationContainer>;
};
