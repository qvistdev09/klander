import { K_ValidationContainer } from "./core/validation-container";
import { K_Validator } from "./elements/validator";

export type K_ValidationError = { message: string; location: string };

export type K_FailureResult = { valid: false; errors: K_ValidationError[] };

export type K_ValidResult<T> = { valid: true; data: T };

export type K_ValidationResult<T> = K_ValidResult<T> | K_FailureResult;

export type K_ValidationCheck = (data: unknown, container: K_ValidationContainer) => void;

export type K_CustomValidationCheck<T> = (data: T, container: K_ValidationContainer) => void;

export type K_AsyncCustomValidationCheck<T> = (
  data: T,
  container: K_ValidationContainer
) => Promise<void>;

export type K_AsyncValidationCheck = (
  data: unknown,
  container: K_ValidationContainer
) => Promise<void>;

type U_FlattenException =
  | Date
  | RegExp
  | Function
  | Array<any>
  | Set<any>
  | Map<any, any>
  | WeakMap<any, any>
  | WeakSet<any>;

export type FlatType<T> = T extends U_FlattenException
  ? T
  : T extends object
  ? { [K in keyof T]: FlatType<T[K]> }
  : T;

export type K_ObjectSchema = { [key: string]: K_Validator<any> | K_ObjectSchema };
