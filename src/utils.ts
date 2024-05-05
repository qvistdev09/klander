import { ROOT_SYMBOL } from "./consts.js";
import { K_IndexedElement } from "./core/indexed-element.js";
import { K_ValidationContainer } from "./core/validation-container.js";
import { K_ValidationError } from "./core/validation-error.js";
import { K_Element } from "./elements/element.js";
import { K_ObjectSchema, K_ValidationResult } from "./types.js";

export function prependArrayIndex(error: K_ValidationError, index: number) {
  error.location =
    error.location === ROOT_SYMBOL
      ? `[${index.toString()}]`
      : `[${index.toString()}].${error.location}`;
}

export function prependArrayIndexToResult(result: K_ValidationResult<unknown>, index: number) {
  if (!result.valid) {
    for (const error of result.errors) {
      prependArrayIndex(error, index);
    }
  }
}

export function contextualizeErrorLocation(error: K_ValidationError, location: string) {
  error.location = error.location === ROOT_SYMBOL ? location : `${location}.${error.location}`;
}

export function contextualizeResultErrors(result: K_ValidationResult<unknown>, location: string) {
  if (!result.valid) {
    for (const error of result.errors) {
      contextualizeErrorLocation(error, location);
    }
  }
}

export function mergeResultIntoContainer(
  container: K_ValidationContainer,
  result: K_ValidationResult<unknown>
) {
  if (!result.valid) {
    for (const error of result.errors) {
      container.addError(error);
    }
  }
}

export function indexElements(
  object: K_ObjectSchema,
  elements: K_IndexedElement[] = [],
  locationFragments: string[] = []
) {
  for (const key in object) {
    const element = object[key];
    if (isElement(element)) {
      const location = [...locationFragments, key];
      elements.push(new K_IndexedElement(location, element));
    } else {
      indexElements(element, elements, [...locationFragments, key]);
    }
  }
  return elements;
}

function isElement(value: K_ObjectSchema | K_Element<unknown>): value is K_Element<unknown> {
  return typeof value.validate === "function";
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
