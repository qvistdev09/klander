import { ROOT_SYMBOL } from "../consts.js";
import { K_Element, K_ValidationResult, FlatType } from "../types.js";

export class K_Object<T extends ObjectSchema> implements K_Element<Inferred<T>> {
  private elements: IndexedElement[];

  constructor(objectSchema: T) {
    const elements: IndexedElement[] = [];
    K_Object.indexElements([], elements, objectSchema);
    this.elements = elements;
  }

  private static getNestedValue(locationFragments: string[], object: unknown) {
    if (
      object === undefined ||
      object === null ||
      locationFragments.length === 0 ||
      typeof object !== "object"
    ) {
      return undefined;
    }

    let value = object;

    for (const [index, key] of locationFragments.entries()) {
      value = (value as any)[key];

      if (index === locationFragments.length - 1) {
        break;
      }

      if (typeof value === "object" && value !== null) {
        continue;
      }

      return undefined;
    }

    return value;
  }

  private static indexElements(
    locationFragments: string[],
    elements: IndexedElement[],
    object: ObjectSchema
  ) {
    for (const key in object) {
      const element = object[key];
      if (K_Object.isElement(element)) {
        const location = [...locationFragments, key];
        elements.push({
          locationFragments: location,
          location: location.join("."),
          validator: element,
        });
      } else {
        K_Object.indexElements([...locationFragments, key], elements, element);
      }
    }
  }

  private static isElement(value: ObjectSchema | K_Element<unknown>): value is K_Element<unknown> {
    return typeof value.validate === "function";
  }

  public validate(value: unknown): K_ValidationResult<Inferred<T>> {
    const results = this.elements.map((element) => {
      const result = element.validator.validate(
        K_Object.getNestedValue(element.locationFragments, value)
      );

      result.errors.forEach((error) => {
        error.location =
          error.location === ROOT_SYMBOL
            ? element.location
            : `${element.location}.${error.location}`;
      });

      return result;
    });

    if (results.every((result) => result.valid)) {
      return { valid: true, data: value as Inferred<T>, errors: [] };
    }

    return { valid: false, data: null, errors: results.map((result) => result.errors).flat() };
  }
}

type IndexedElement = {
  location: string;
  validator: K_Element<unknown>;
  locationFragments: string[];
};

export type ObjectSchema = { [key: string]: K_Element<unknown> | ObjectSchema };

type Inferred<T extends ObjectSchema> = FlatType<{
  [Property in keyof T]: T[Property] extends K_Element<infer TS>
    ? TS
    : T[Property] extends ObjectSchema
    ? Inferred<T[Property]>
    : never;
}>;
