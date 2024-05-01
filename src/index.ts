import { KArray } from "./elements/array.js";
import { KNullable } from "./elements/nullable.js";
import { KObject, ObjectSchema } from "./elements/object.js";
import { KOneOf } from "./elements/oneof.js";
import { KString } from "./elements/string.js";
import { Klander } from "./types.js";

function array<T>(element: Klander.Element<T>) {
  return new KArray(element);
}

function nullable<T>(element: Klander.Element<T>) {
  return new KNullable(element);
}

function object<T extends ObjectSchema>(schema: T) {
  return new KObject(schema);
}

function oneOf<T extends [Klander.Element<any>, ...Klander.Element<any>[]]>(...oneOfs: T) {
  return new KOneOf(oneOfs);
}

function string() {
  return new KString();
}

export { array, nullable, object, oneOf, string };
