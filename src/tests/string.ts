import { test } from "node:test";
import assert from "node:assert/strict";
import { string } from "../index.js";

test("string validator should accept strings", () => {
  const validator = string();
  const result = validator.validate("test");
  assert.ok(result.valid);
});

test("string validator should reject non-strings", () => {
  const validator = string();
  const result = validator.validate(25);
  assert.equal(result.valid, false);
});

test("min check should reject strings that are too short", () => {
  const validator = string().min(5);
  const result = validator.validate("te");
  assert.equal(result.valid, false);
});

test("max check should reject strings that are too long", () => {
  const validator = string().max(3);
  const result = validator.validate("1234");
  assert.equal(result.valid, false);
});

test("pattern check should reject strings that do not conform to pattern", () => {
  const validator = string().pattern(/hello/);
  const result = validator.validate("something");
  assert.equal(result.valid, false);
});

test("enum check should reject strings that are not part of the enum", () => {
  const validator = string().enum("apple", "pear");
  const result = validator.validate("orange");
  assert.equal(result.valid, false);
});
