import { U_ValidatorInternal } from "../elements/validator";

export class K_IndexedElement {
  constructor(public locationFragments: string[], public validator: U_ValidatorInternal<unknown>) {}

  public get location() {
    return this.locationFragments.join(".");
  }
}
