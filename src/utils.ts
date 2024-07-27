import { K_IndexedElement } from "./core/indexed-element.js";
import { K_Validator, U_ValidatorInternal } from "./elements/validator.js";
import { K_ObjectSchema } from "./types.js";

export function indexElements(
  object: K_ObjectSchema,
  elements: K_IndexedElement[] = [],
  locationFragments: string[] = []
) {
  for (const key in object) {
    const element = object[key];
    if (isElement(element)) {
      const location = [...locationFragments, key];
      elements.push(new K_IndexedElement(location, element as U_ValidatorInternal<unknown>));
    } else {
      indexElements(element, elements, [...locationFragments, key]);
    }
  }
  return elements;
}

function isElement(value: K_ObjectSchema | K_Validator<any>): value is K_Validator<any> {
  return value instanceof K_Validator;
}

export function getNestedValue(locationFragments: string[], object: unknown) {
  if (
    object === undefined ||
    object === null ||
    locationFragments.length === 0 ||
    typeof object !== "object"
  ) {
    return undefined;
  }

  let value: unknown = object;

  for (const [index, key] of locationFragments.entries()) {
    value = (value as Record<string, unknown>)[key];

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
