import { K_Template } from "../core/template.js";
import { K_ValidationContainer } from "../core/validation-container.js";
import { K_Validator, U_ValidatorInternal } from "./validator.js";

export class K_OneOf<T extends [K_Validator<any>, ...K_Validator<any>[]]> extends K_Validator<
  MapInnerElementTypes<T>[number]
> {
  private oneOfs: U_ValidatorInternal<any>[];

  constructor(input: T | K_Template<K_OneOf<T>>) {
    super();

    if (input instanceof K_Template) {
      this.oneOfs = [...input.template.oneOfs];
      this.copyChecks(input.template);
      return;
    }

    this.oneOfs = input as unknown as U_ValidatorInternal<any>[];

    this.addCheck((data, container) => {
      const containers: K_ValidationContainer[] = [];
      for (const oneOf of this.oneOfs) {
        const result = oneOf.runSyncChecks(data);
        if (result.isValid()) {
          container.setReferencedValidator(oneOf);
          return container.markForApproval();
        }
        containers.push(result);
      }
      containers.sort((a, b) => a.errors.length - b.errors.length);
      container.absorbContainer(containers[0]);
    });

    this.addAsyncCheck(async (data, container) => {
      const validOneOf = this.oneOfs.find((oneOf) => oneOf === container.validatorReference);
      if (validOneOf) {
        await validOneOf.runAsyncChecks(data, container);
      }
    });
  }
}

type MapInnerElementTypes<T extends [K_Validator<any>, ...K_Validator<any>[]]> = {
  [Key in keyof T]: T[Key] extends K_Validator<infer TS> ? TS : never;
};
