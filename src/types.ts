import { K_ValidationContainer } from "./core/validation-container";
import { K_ValidationError } from "./core/validation-error";
import { K_Element } from "./elements/element";

export type K_FailureResult = { valid: false; errors: K_ValidationError[] };

export type K_ValidResult<T> = { valid: true; data: T };

export type K_ValidationResult<T> = K_ValidResult<T> | K_FailureResult;

export type K_ValidationCheck = (data: unknown, container: K_ValidationContainer) => void;

export type FlatType<T> = T extends object ? { [K in keyof T]: FlatType<T[K]> } : T;

export type K_ObjectSchema = { [key: string]: K_Element<unknown> | K_ObjectSchema };
