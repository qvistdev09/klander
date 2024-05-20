import { test } from "node:test";
import assert from "node:assert/strict";
import { array, number, object, string } from "../index.js";

test("object validator should produce correct paths to nested elements", () => {
  const book = object({ author: { name: string() } });

  const data = { author: { name: 12 } };

  const result = book.validate(data);

  if (result.valid) {
    assert.fail("Result must not be valid");
  }

  assert.equal(result.errors[0].location, "author.name");
});

test("object validator should produce correct paths to array elements", () => {
  const book = object({ meta: { ratings: array(number()) } });
  const data = { meta: { ratings: [2, 5, null] } };

  const result = book.validate(data);

  if (result.valid) {
    assert.fail("Result must not be valid");
  }

  assert.equal(result.errors[0].location, "meta.ratings.[2]");
});

test("object validator should correctly validate well-formed data with nested elements", () => {
  const book = object({ author: { name: string() }, meta: { ratings: array(number()) } });
  const data = { author: { name: "Max Mustermann" }, meta: { ratings: [2, 5, 2] } };

  const result = book.validate(data);

  assert.ok(result.valid);
  assert.deepStrictEqual(result.data, data);
});

test("object validator should values that are not expected objects as invalid", () => {
  const validator = object({ author: { name: string() }, meta: { ratings: array(number()) } });

  assert.equal(validator.validate(undefined).valid, false);
  assert.equal(validator.validate(function () {}).valid, false);
  assert.equal(validator.validate(2).valid, false);
  assert.equal(validator.validate("2").valid, false);
  assert.equal(validator.validate(null).valid, false);
});
