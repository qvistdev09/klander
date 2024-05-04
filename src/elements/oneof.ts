import { K_FailureResult } from "../types.js";
import { mergeResultIntoContainer } from "../utils.js";
import { K_Element } from "./element.js";

export class K_OneOf<T extends [K_Element<any>, ...K_Element<any>[]]> extends K_Element<
  MapInnerElementTypes<T>[number]
> {
  constructor(private oneOfs: T) {
    super();
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

type MapInnerElementTypes<T extends [K_Element<any>, ...K_Element<any>[]]> = {
  [Key in keyof T]: T[Key] extends K_Element<infer TS> ? TS : never;
};
