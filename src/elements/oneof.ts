import { K_FailureResult } from "../types.js";
import { mergeResultIntoContainer } from "../utils.js";
import { K_Validator } from "./validator.js";

export class K_OneOf<T extends [K_Validator<any>, ...K_Validator<any>[]]> extends K_Validator<
  MapInnerElementTypes<T>[number]
> {
  constructor(private oneOfs: T) {
    super();

    for (const oneOf of oneOfs) {
      this.addNestedElement(oneOf);
    }

    this.addValidator((data, container) => {
      const errorSets: K_FailureResult[] = [];
      for (const oneOf of this.oneOfs) {
        const result = oneOf.validate(data);
        if (result.valid) {
          return container.markForApproval();
        }
        errorSets.push(result);
      }
      errorSets.sort((a, b) => a.errors.length - b.errors.length);
      mergeResultIntoContainer(container, errorSets[0]);
    });
  }
}

type MapInnerElementTypes<T extends [K_Validator<any>, ...K_Validator<any>[]]> = {
  [Key in keyof T]: T[Key] extends K_Validator<infer TS> ? TS : never;
};
