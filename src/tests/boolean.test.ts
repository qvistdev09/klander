import { test } from "node:test";
import assert from "node:assert/strict";
import { boolean } from "../index.js";

test("boolean validator should give a valid result for a boolean input", () => {
  const bool = boolean();
  const result = bool.validate(true);
  assert.ok(result.valid);
});

test("boolean validator should give an invalid result for a non-boolean input", () => {
  const bool = boolean();
  const result = bool.validate(25);
  assert.equal(result.valid, false);
});

test("boolean validator with mustBe-validation should only accept one value", () => {
  const bool = boolean().mustBe(true);

  const result_a = bool.validate(true);
  const result_b = bool.validate(false);

  assert.equal(result_a.valid, true);
  assert.equal(result_b.valid, false);
});
