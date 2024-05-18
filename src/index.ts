import { K_Array } from "./elements/array.js";
import { K_Boolean } from "./elements/boolean.js";
import { K_Nullable } from "./elements/nullable.js";
import { K_Object } from "./elements/object.js";
import { K_OneOf } from "./elements/oneof.js";
import { K_String } from "./elements/string.js";
import { K_Validator } from "./elements/validator.js";
import { K_ObjectSchema } from "./types.js";
import { K_Number } from "./elements/number.js";

/**
 * Creates an array validator which validates array elements against the inner validator.
 */
function array<T>(element: K_Validator<T>) {
  return new K_Array(element);
}

/**
 * Creates a boolean validator with additional validation methods.
 */
function boolean() {
  return new K_Boolean();
}

/**
 * Wraps an existing validator to allow value to be null.
 */
function nullable<T>(element: K_Validator<T>) {
  return new K_Nullable(element);
}

/**
 * Creates a number validator with additional validation methods.
 */
function number() {
  return new K_Number();
}

/**
 * Creates an object validator which validates values against the given schema structure.
 */
function object<T extends K_ObjectSchema>(schema: T) {
  return new K_Object(schema);
}

/**
 * Creates a validator which ensures that a value matches one of the provided validators.
 */
function oneOf<T extends [K_Validator<any>, ...K_Validator<any>[]]>(...oneOfs: T) {
  return new K_OneOf(oneOfs);
}

/**
 * Creates a string validator with additional validation methods.
 */
function string() {
  return new K_String();
}

export { array, boolean, nullable, number, object, oneOf, string };
