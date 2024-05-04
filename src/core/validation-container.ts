import { K_ValidationResult } from "../types.js";
import { K_ValidationError } from "./validation-error.js";

export class K_ValidationContainer {
  public errors: K_ValidationError[] = [];
  public markedForEarlyApproval: boolean = false;

  public isValid() {
    return this.errors.length === 0;
  }

  public markForApproval() {
    this.markedForEarlyApproval = true;
  }

  public addError(error: K_ValidationError) {
    this.errors.push(error);
  }

  public toValidResponse<T>(data: unknown): K_ValidationResult<T> {
    return { valid: true, data: data as T };
  }

  public toErrorResponse<T>(): K_ValidationResult<T> {
    return { valid: false, errors: this.errors };
  }
}
