import { K_Element, K_ValidationResult } from "../types.js";

export class K_OneOf<T extends [K_Element<any>, ...K_Element<any>[]]>
  implements K_Element<MapInnerElementTypes<T>[number]>
{
  constructor(private oneOfs: T) {}

  public validate(value: unknown): K_ValidationResult<MapInnerElementTypes<T>[number]> {
    const errorSets: K_ValidationResult<any>[] = [];

    for (const oneOf of this.oneOfs) {
      const result = oneOf.validate(value);
      if (result.valid) {
        return result;
      }
      errorSets.push(result);
    }

    errorSets.sort((a, b) => a.errors.length - b.errors.length);

    return errorSets[0];
  }
}

type MapInnerElementTypes<T extends [K_Element<any>, ...K_Element<any>[]]> = {
  [Key in keyof T]: T[Key] extends K_Element<infer TS> ? TS : never;
};
