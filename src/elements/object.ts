import { ROOT_SYMBOL } from "../consts.js";
import { Klander, FlatType } from "../types.js";

export class KObject<T extends ObjectSchema> implements Klander.Element<Inferred<T>> {
  private elements: IndexedElement[];

  constructor(objectSchema: T) {
    const elements: IndexedElement[] = [];
    KObject.indexElements([], elements, objectSchema);
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
      if (KObject.isElement(element)) {
        const location = [...locationFragments, key];
        elements.push({
          locationFragments: location,
          location: location.join("."),
          validator: element,
        });
      } else {
        KObject.indexElements([...locationFragments, key], elements, element);
      }
    }
  }

  private static isElement(
    value: ObjectSchema | Klander.Element<unknown>
  ): value is Klander.Element<unknown> {
    return typeof value.validate === "function";
  }

  public validate(value: unknown): Klander.ValidationResult<Inferred<T>> {
    const results = this.elements.map((element) => {
      const result = element.validator.validate(
        KObject.getNestedValue(element.locationFragments, value)
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
  validator: Klander.Element<unknown>;
  locationFragments: string[];
};

type ObjectSchema = { [key: string]: Klander.Element<unknown> | ObjectSchema };

type Inferred<T extends ObjectSchema> = FlatType<{
  [Property in keyof T]: T[Property] extends Klander.Element<infer TS>
    ? TS
    : T[Property] extends ObjectSchema
    ? Inferred<T[Property]>
    : never;
}>;
