import { ROOT_SYMBOL } from "../consts.js";
import { U_ValidatorInternal } from "../elements/validator.js";
import { K_ValidationError, K_ValidationResult } from "../types.js";

export class K_ValidationContainer {
  public errors: K_ValidationError[] = [];
  public markedForEarlyApproval: boolean = false;
  public validatorReference: U_ValidatorInternal<any> | null = null;

  public setReferencedValidator = (validator: U_ValidatorInternal<any>) => {
    this.validatorReference = validator;
    return this;
  };

  public isValid = () => {
    return this.errors.length === 0;
  };

  public markForApproval = () => {
    this.markedForEarlyApproval = true;
    return this;
  };

  public addExistingError = (error: K_ValidationError) => {
    this.errors.push(error);
    return this;
  };

  public addNewError = (location: string, message: string) => {
    this.errors.push({ location, message });
    return this;
  };

  public toValidResponse = <T>(data: unknown): K_ValidationResult<T> => {
    return { valid: true, data: data as T };
  };

  public toErrorResponse = <T>(): K_ValidationResult<T> => {
    return { valid: false, errors: this.errors };
  };

  public prependArrayIndexToErrors = (index: number) => {
    this.errors.forEach((error) => {
      error.location =
        error.location === ROOT_SYMBOL
          ? `[${index.toString()}]`
          : `[${index.toString()}].${error.location}`;
    });
    return this;
  };

  public contextualizeErrors = (location: string) => {
    this.errors.forEach((error) => {
      error.location = error.location === ROOT_SYMBOL ? location : `${location}.${error.location}`;
    });
    return this;
  };

  public absorbContainer = (target: K_ValidationContainer) => {
    target.errors.forEach((error) => {
      this.addExistingError(error);
    });
    return this;
  };
}
