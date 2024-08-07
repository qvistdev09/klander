import { test } from "node:test";
import assert from "node:assert/strict";
import { array, number, object, oneOf, string } from "../index.js";

test("returning a string in a custom async check should result in an error in the validation result", async () => {
  const quantity = number().customAsync(async (quantity) => {
    if (quantity !== 25) {
      return "Quantity must be 25";
    }
  });

  const result = await quantity.validateAsync(10);

  assert.equal(result.valid, false);
  assert.deepStrictEqual(result.errors, [{ location: "#", message: "Quantity must be 25" }]);
});

test("all async checks run in a complex object", async () => {
  const person = object({
    name: string().customAsync(async (name) => {
      if (name !== "Test") {
        return "Name must be 'test'";
      }
    }),
    hobbies: array(
      object({
        description: string().customAsync(async (description) => {
          if (description !== "test") {
            return "Description must be 'test'";
          }
        }),
      })
    ),
  }).customAsync(async (person) => {
    const hobbiesLength = (person as any)?.hobbies?.length ?? null;
    if (!hobbiesLength || typeof hobbiesLength !== "number" || hobbiesLength < 2) {
      return "Hobbies array must have more than 2 elements";
    }
  });

  const validation = await person.validateAsync({
    name: "John",
    hobbies: [{ description: "Hobby" }],
  });

  const expectedErrors = [
    {
      location: "#",
      message: "Hobbies array must have more than 2 elements",
    },
    { location: "name", message: "Name must be 'test'" },
    {
      location: "hobbies.[0].description",
      message: "Description must be 'test'",
    },
  ];

  assert.equal(validation.valid, false);

  for (const expected of expectedErrors) {
    const match = validation.errors.find(
      (error) => error.location === expected.location && error.message === expected.message
    );
    assert.ok(
      match,
      `Did not find the expected error with location '${expected.location}' and message '${expected.message}'`
    );
  }
});

test("when using oneOf, only the async checks in the passing validator should be used", async () => {
  let aHasBeenCalled = false;
  let bHasBeenCalled = false;

  const a = object({ name: string() }).customAsync(async () => {
    aHasBeenCalled = true;
  });

  const b = object({ age: number() }).customAsync(async () => {
    bHasBeenCalled = true;
  });

  const schema = oneOf(a, b);

  await schema.validateAsync({ name: "test" });

  assert.equal(aHasBeenCalled, true);
  assert.equal(bHasBeenCalled, false);
});
