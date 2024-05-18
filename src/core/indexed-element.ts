import { K_Validator } from "../elements/validator";

export class K_IndexedElement {
  constructor(public locationFragments: string[], public validator: K_Validator<unknown>) {}

  public get location() {
    return this.locationFragments.join(".");
  }
}
