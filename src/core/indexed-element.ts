import { K_Element } from "../elements/element";

export class K_IndexedElement {
  constructor(public locationFragments: string[], public validator: K_Element<unknown>) {}

  public get location() {
    return this.locationFragments.join(".");
  }
}
