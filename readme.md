# klander

A javascript validation library with a fluent interface and typed validation results.

## Notice

This package is neither feature-extensive nor thoroughly tested. There are more mature options available. It has primarily been made for learning purposes and personal use. It is not recommended for professional usage.

## Installation

`npm install klander`

## Usage examples

### Validating complex objects

```typescript
import { array, boolean, nullable, number, object, oneOf, string } from "klander";

const employee = object({
  name: string(),
  id: number().int(),
  email: string().pattern(/^.+@company.com$/),
  projects: array(object({ projectId: number(), role: string().enum("admin", "member") })),
});

const invalid_data = {
  name: "Max Mustermann",
  id: 2,
  email: "max@company.com",
  projects: [{ projectId: 25, role: null }],
};

const result = employee.validate(invalid_data);

/*
  {
    valid: false,
    errors: [
      K_ValidationError {
        location: 'projects.[0].role',
        message: 'Value must be a string'
      }
    ]
  }
*/
```
