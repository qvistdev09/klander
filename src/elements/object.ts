import { K_IndexedElement } from "../core/indexed-element.js";
import { FlatType, K_ObjectSchema } from "../types.js";
import {
  contextualizeErrorLocation,
  getNestedValue,
  indexElements,
  mergeResultIntoContainer,
} from "../utils.js";
import { K_Element } from "./element.js";

export class K_Object<T extends K_ObjectSchema> extends K_Element<Inferred<T>> {
  private elements: K_IndexedElement[];

  constructor(objectSchema: T) {
    super();
    this.elements = indexElements(objectSchema);

    for (const element of this.elements) {
      this.addNestedElement(element.validator);
    }

    this.addValidator((data, container) => {
      for (const { validator, locationFragments, location } of this.elements) {
        const nestedValue = getNestedValue(locationFragments, data);
        const result = validator.validate(nestedValue);
        if (!result.valid) {
          for (const error of result.errors) {
            contextualizeErrorLocation(error, location);
          }
          mergeResultIntoContainer(container, result);
        }
      }
    });
  }
}

type Inferred<T extends K_ObjectSchema> = FlatType<{
  [Property in keyof T]: T[Property] extends K_Element<infer TS>
    ? TS
    : T[Property] extends K_ObjectSchema
    ? Inferred<T[Property]>
    : never;
}>;
