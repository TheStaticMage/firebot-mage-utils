# $parseYAML

## Table of Contents

- [Introduction](#introduction)
- [Usage](#usage)
- [Parameters](#parameters)
- [Returns](#returns)
- [Examples](#examples)
- [Error Handling](#error-handling)
- [Related Variables](#related-variables)

## Introduction

The `$parseYAML` replace variable parses YAML-formatted text and outputs the result as a JSON string. Multiple arguments are concatenated with newlines, allowing you to build multi-line YAML structures across multiple arguments. This is useful for parsing structured configuration data, converting YAML to JSON for further processing, or working with YAML-based APIs and data sources.

## Usage

```text
$parseYAML[yamlText]
$parseYAML[yamlText1, yamlText2, ...]
```

## Parameters

**yamlText** (required, variadic)

- Type: string
- One or more YAML-formatted strings
- Multiple arguments are concatenated with newline characters (`\n`)
- Leading and trailing whitespace is trimmed before parsing
- Empty arguments (all whitespace) are treated as missing input

## Returns

A JSON string representing the parsed YAML structure.

**Success:**

- Valid YAML is converted to equivalent JSON
- YAML types map to JSON types as follows:
  - YAML strings → JSON strings
  - YAML integers/floats → JSON numbers
  - YAML booleans (`true`, `false`) → JSON booleans
  - YAML `null` → JSON null
  - YAML arrays → JSON arrays
  - YAML objects → JSON objects

**Error:**

- Invalid YAML returns a JSON object with a single key: `parse-yaml-error`
- The value is the error message string from the YAML parser
- Empty/missing input returns: `{"parse-yaml-error":"No arguments provided"}`

## Examples

### Simple key-value pairs

```text
$parseYAML[key: value]
```

Returns: `{"key":"value"}`

```text
$parseYAML[name: TheStaticMage]
```

Returns: `{"name":"TheStaticMage"}`

### Number values

```text
$parseYAML[count: 42]
```

Returns: `{"count":42}`

```text
$parseYAML[price: 19.99]
```

Returns: `{"price":19.99}`

### Boolean values

```text
$parseYAML[active: true]
```

Returns: `{"active":true}`

```text
$parseYAML[deleted: false]
```

Returns: `{"deleted":false}`

### Null values

```text
$parseYAML[optional: null]
```

Returns: `{"optional":null}`

```text
$parseYAML[key:]
```

Returns: `{"key":null}` (colon without value defaults to null)

### Multiple arguments (concatenated)

```text
$parseYAML[name: test, role: admin]
```

Returns: `{"name":"test","role":"admin"}`

```text
$parseYAML[key1: val1, key2: val2, active: true]
```

Returns: `{"key1":"val1","key2":"val2","active":true}`

### Arrays

```text
$parseYAML[items: [a, b, c]]
```

Returns: `{"items":["a","b","c"]}`

```text
$parseYAML[numbers: [1, 2, 3]]
```

Returns: `{"numbers":[1,2,3]}`

### Nested objects

```text
$parseYAML[user: {name: test, role: admin}]
```

Returns: `{"user":{"name":"test","role":"admin"}}`

### Mixed structures

```text
$parseYAML[name: test, tags: [a, b], meta: {count: 5}]
```

Returns: `{"name":"test","tags":["a","b"],"meta":{"count":5}}`

### Multi-line YAML in single argument

```text
$parseYAML[key1: val1
key2: val2]
```

Returns: `{"key1":"val1","key2":"val2"}`

### Complex nested structures

```text
$parseYAML[person: {name: TheStaticMage, roles: [admin, moderator], settings: {theme: dark}}]
```

Returns: `{"person":{"name":"TheStaticMage","roles":["admin","moderator"],"settings":{"theme":"dark"}}}`

### Indented YAML

```text
$parseYAML[parent:
  child: value
  count: 5]
```

Returns: `{"parent":{"child":"value","count":5}}`

## Error Handling

### Empty or missing arguments

```text
$parseYAML[]
```

Returns: `{"parse-yaml-error":"No arguments provided"}`

```text
$parseYAML[   ]
```

Returns: `{"parse-yaml-error":"No arguments provided"}` (whitespace-only input)

### Invalid YAML syntax

```text
$parseYAML[key: [unclosed]
```

Returns: `{"parse-yaml-error":"<error message from js-yaml>"}`

```text
$parseYAML[invalid: yaml: content: here]
```

Returns: `{"parse-yaml-error":"<error message from js-yaml>"}`

### Error sentinel format

All errors return a JSON object with exactly one key:

```json
{
  "parse-yaml-error": "<error message>"
}
```

You can check for errors by parsing the output and checking for this key:

```text
$parseYAML[invalid yaml]
```

Returns: `{"parse-yaml-error":"bad indentation of a sequence entry at line 1, column 10..."}`

## Related Variables

- **`$ensureArray`**: Ensures input is an array, useful for post-processing parsed arrays
- **`$flattenArray`**: Flattens nested arrays, useful for simplifying parsed array structures
