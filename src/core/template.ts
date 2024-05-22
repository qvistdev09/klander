import { K_Validator } from "../elements/validator.js";

export class K_Template<T extends K_Validator<any>> {
  constructor(public template: T) {}
}
