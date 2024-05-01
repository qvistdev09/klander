import { Klander } from "../types";

export class KNullable<T> implements Klander.Element<T | null> {
  constructor(private element: Klander.Element<T>) {}

  public validate(value: unknown): Klander.ValidationResult<T | null> {
    if (value === null) {
      return { valid: true, data: null, errors: [] };
    }
    return this.element.validate(value);
  }
}
