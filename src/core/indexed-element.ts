import { U_ValidatorInternal } from "../elements/validator";

export class K_IndexedElement {
  public location: string;

  constructor(public locationFragments: string[], public validator: U_ValidatorInternal<unknown>) {
    this.location = locationFragments.join(".");
  }
}
