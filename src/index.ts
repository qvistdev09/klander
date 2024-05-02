import { K_Array } from "./elements/array.js";
import { K_Nullable } from "./elements/nullable.js";
import { K_Object, ObjectSchema } from "./elements/object.js";
import { K_OneOf } from "./elements/oneof.js";
import { K_String } from "./elements/string.js";
import { K_Element } from "types.js";

function array<T>(element: K_Element<T>) {
  return new K_Array(element);
}

function nullable<T>(element: K_Element<T>) {
  return new K_Nullable(element);
}

function object<T extends ObjectSchema>(schema: T) {
  return new K_Object(schema);
}

function oneOf<T extends [K_Element<any>, ...K_Element<any>[]]>(...oneOfs: T) {
  return new K_OneOf(oneOfs);
}

function string() {
  return new K_String();
}

export { array, nullable, object, oneOf, string };
