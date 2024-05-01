import { Klander, FlatType } from "../types.js";

export class KlanderObject<T extends ObjectSchema> implements Klander.Element<Inferred<T>> {
  private elements: IndexedElement[];

  constructor(objectSchema: T) {
    const elements: IndexedElement[] = [];
    KlanderObject.indexElements([], elements, objectSchema);
    this.elements = elements;
  }

  public static getNestedValue(locationFragments: string[], object: unknown) {
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
      console.log({ index, key, value });
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
      if (KlanderObject.isElement(element)) {
        const location = [...locationFragments, key];
        elements.push({
          locationFragments: location,
          location: location.join("."),
          validator: element,
        });
      } else {
        KlanderObject.indexElements([...locationFragments, key], elements, element);
      }
    }
  }

  private static isElement(
    value: ObjectSchema | Klander.Element<unknown>
  ): value is Klander.Element<unknown> {
    return typeof value.validate === "function";
  }

  public validate(value: unknown): Klander.ValidationResult<Inferred<T>> {
    return {} as any;
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
