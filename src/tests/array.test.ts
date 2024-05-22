import { test } from "node:test";
import assert from "node:assert/strict";
import { string, array } from "../index.js";

test("array validator should accept array with correct inner element", () => {
  const validator = array(string());

  assert.equal(validator.validate(["test"]).valid, true);
});

test("array validator should refuse array with incorrect inner element", () => {
  const validator = array(string());

  assert.equal(validator.validate([2]).valid, false);
});

test("array validator should refuse arrays with too few elements when minItems check is used", () => {
  const validator = array(string()).minItems(2);

  assert.equal(validator.validate(["test"]).valid, false);
});

test("array validator should refuse arrays with too many elements when maxItems check is used", () => {
  const validator = array(string()).maxItems(1);

  assert.equal(validator.validate(["test", "test"]).valid, false);
});

test("array validator should mark non-arrays as invalid", () => {
  const validator = array(string());

  assert.equal(validator.validate(undefined).valid, false);
  assert.equal(validator.validate({}).valid, false);
  assert.equal(validator.validate(function () {}).valid, false);
  assert.equal(validator.validate(2).valid, false);
  assert.equal(validator.validate("2").valid, false);
  assert.equal(validator.validate(new Set()).valid, false);
});

test("array: immutability checks", () => {
  const withoutMin = array(string());
  const withMin = withoutMin.minItems(2);

  const result = withoutMin.validate(["test"]);

  assert.ok(result.valid);

  assert.notEqual(withoutMin, withMin);
});
