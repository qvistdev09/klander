import { ROOT_SYMBOL } from "../consts.js";
import { K_ValidationError, K_ValidationResult } from "../types.js";

export class K_ValidationContainer {
  public errors: K_ValidationError[] = [];
  public markedForEarlyApproval: boolean = false;

  public isValid() {
    return this.errors.length === 0;
  }

  public markForApproval() {
    this.markedForEarlyApproval = true;
  }

  public addExistingError(error: K_ValidationError) {
    this.errors.push(error);
  }

  public addNewError(location: string, message: string) {
    this.errors.push({ location, message });
  }

  public toValidResponse<T>(data: unknown): K_ValidationResult<T> {
    return { valid: true, data: data as T };
  }

  public toErrorResponse<T>(): K_ValidationResult<T> {
    return { valid: false, errors: this.errors };
  }

  public prependArrayIndexToErrors(index: number) {
    this.errors.forEach((error) => {
      error.location =
        error.location === ROOT_SYMBOL
          ? `[${index.toString()}]`
          : `[${index.toString()}].${error.location}`;
    });
  }

  public contextualizeErrors(location: string) {
    this.errors.forEach((error) => {
      error.location = error.location === ROOT_SYMBOL ? location : `${location}.${error.location}`;
    });
  }

  public absorbContainer(target: K_ValidationContainer) {
    target.errors.forEach((error) => {
      this.addExistingError(error);
    });
  }
}
