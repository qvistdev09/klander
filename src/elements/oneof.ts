import { Klander } from "../types.js";

export class KOneOf<T extends [Klander.Element<any>, ...Klander.Element<any>[]]>
  implements Klander.Element<MapInnerElementTypes<T>[number]>
{
  constructor(private oneOfs: T) {}

  public validate(value: unknown): Klander.ValidationResult<MapInnerElementTypes<T>[number]> {

    const errorSets: Klander.ValidationResult<any>[] = [];
    
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

type MapInnerElementTypes<T extends [Klander.Element<any>, ...Klander.Element<any>[]]> = {
  [Key in keyof T]: T[Key] extends Klander.Element<infer TS> ? TS : never;
};
