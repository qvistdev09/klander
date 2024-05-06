import { test } from "node:test";
import assert from "node:assert/strict";
import { number } from "../index.js";

test("number validator should accept number", () => {
  const validator = number();
  const result = validator.validate(25);
  assert.ok(result.valid);
});

test("number validator should reject non-number", () => {
  const validator = number();
  const result = validator.validate("25");
  assert.equal(result.valid, false);
});

test("min check should reject numbers that are too small", () => {
  const validator = number().min(5);
  const result = validator.validate(2);
  assert.equal(result.valid, false);
});

test("max check should reject numbers that are too big", () => {
  const validator = number().max(5);
  const result = validator.validate(7);
  assert.equal(result.valid, false);
});

test("int check should reject numbers with decimals", () => {
  const validator = number().int();
  const result = validator.validate(7.21);
  assert.equal(result.valid, false);
});

test("enum check should reject numbers that are not part of the enum", () => {
  const validator = number().enum(2, 5);
  const result = validator.validate(3);
  assert.equal(result.valid, false);
});
