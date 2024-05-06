import { test } from "node:test";
import assert from "node:assert/strict";
import { nullable, boolean } from "../index.js";

test("nullable validator should accept null as values", () => {
  const validator = nullable(boolean());
  const result = validator.validate(null);
  assert.ok(result.valid);
});

test("nullable validator should accept a correct value for the inner validator", () => {
  const validator = nullable(boolean());
  const result = validator.validate(false);
  assert.ok(result.valid);
});
