import { test } from "node:test";
import assert from "node:assert/strict";
import { string, oneOf, number, object } from "../index.js";

test("oneOf should reject values that are not one of the inner elements", () => {
  const validator = oneOf(string(), number());
  const result = validator.validate(true);
  assert.equal(result.valid, false);
});

test("oneOf should accept values that are one of the inner elements", () => {
  const validator = oneOf(string(), number());
  const result = validator.validate("test");
  assert.ok(result.valid);
});

test("if the value is not valid against any of the inner elements, the errors should be listed for the element with the least amount of errors", () => {
  const validator = oneOf(
    object({ name: string().enum("John"), age: number() }),
    object({ name: string().enum("John") })
  );

  const result = validator.validate({ name: "Per" });

  if (result.valid) {
    assert.fail();
  }

  assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0].message, "Value must be one of the allowed enum values: John");
});
