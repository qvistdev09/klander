import { K_IndexedElement } from "../core/indexed-element.js";
import { FlatType as U_FlatType, K_ObjectSchema } from "../types.js";
import { getNestedValue, indexElements } from "../utils.js";
import { K_Validator } from "./validator.js";

export class K_Object<T extends K_ObjectSchema> extends K_Validator<U_Inferred<T>> {
  private elements: K_IndexedElement[];

  constructor(objectSchema: T) {
    super();
    this.elements = indexElements(objectSchema);

    this.addCheck((data, container) => {
      this.elements.forEach((element) => {
        const nestedValue = getNestedValue(element.locationFragments, data);
        const elementValidation = element.validator.runSyncChecks(nestedValue);
        elementValidation.contextualizeErrors(element.location);
        container.absorbContainer(elementValidation);
      });
    });

    this.addAsyncCheck(async (data, container) => {
      await Promise.all(
        this.elements.map(async (element) => {
          const nestedValue = getNestedValue(element.locationFragments, data);
          const elementValidation = await element.validator.runAsyncChecks(nestedValue);
          elementValidation.contextualizeErrors(element.location);
          container.absorbContainer(elementValidation);
        })
      );
    });
  }
}

type U_Inferred<T extends K_ObjectSchema> = U_FlatType<{
  [Property in keyof T]: T[Property] extends K_Validator<infer TS>
    ? TS
    : T[Property] extends K_ObjectSchema
    ? U_Inferred<T[Property]>
    : never;
}>;
