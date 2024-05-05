import { K_IndexedElement } from "../core/indexed-element.js";
import { FlatType as U_FlatType, K_ObjectSchema } from "../types.js";
import {
  contextualizeResultErrors,
  getNestedValue,
  indexElements,
  mergeResultIntoContainer,
} from "../utils.js";
import { K_Element } from "./element.js";

export class K_Object<T extends K_ObjectSchema> extends K_Element<U_Inferred<T>> {
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
        contextualizeResultErrors(result, location);
        mergeResultIntoContainer(container, result);
      }
    });
  }
}

type U_Inferred<T extends K_ObjectSchema> = U_FlatType<{
  [Property in keyof T]: T[Property] extends K_Element<infer TS>
    ? TS
    : T[Property] extends K_ObjectSchema
    ? U_Inferred<T[Property]>
    : never;
}>;
