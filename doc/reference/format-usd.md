# $formatUSD

## Table of Contents

- [Introduction](#introduction)
- [Usage](#usage)
- [Parameters](#parameters)
- [Returns](#returns)
- [Examples](#examples)
- [Related Variables](#related-variables)

## Introduction

The `$formatUSD` replace variable converts a number to US dollar currency format with proper decimal precision. It supports optional division before formatting and optional thousands separators.

## Usage

```text
$formatUSD[amount]
$formatUSD[amount, divisor]
$formatUSD[amount, divisor, useCommas]
```

## Parameters

**amount** (required)
- Type: number or string
- The amount to format as currency
- String inputs are cleaned of non-numeric characters (except digits, minus sign, and decimal point)
- Invalid values are treated as 0

**divisor** (optional, default: 1)
- Type: number or string
- Divides the amount before formatting
- String inputs are cleaned of non-numeric characters (except digits, minus sign, and decimal point)
- Invalid values or zero are treated as 1

**useCommas** (optional, default: false)
- Type: boolean or string
- When `true` or `"true"`, adds thousands separators (commas)
- All other values result in no thousands separators

## Returns

A string formatted as US dollar currency with exactly two decimal places.

Format without commas: `$X.XX`

Format with commas: `$X,XXX.XX`

Negative values are prefixed with a minus sign: `$-X.XX` or `$-X,XXX.XX`

## Examples

### Basic formatting

```text
$formatUSD[420.69]
```

Returns: `$420.69`

```text
$formatUSD[1234.5]
```

Returns: `$1234.50`

```text
$formatUSD[0.69]
```

Returns: `$0.69`

### Division

```text
$formatUSD[42069, 100]
```

Returns: `$420.69`

```text
$formatUSD[2500, 100]
```

Returns: `$25.00`

### Thousands separators

```text
$formatUSD[1234.5, 1, true]
```

Returns: `$1,234.50`

```text
$formatUSD[1000000, 1, true]
```

Returns: `$1,000,000.00`

```text
$formatUSD[987654321.99, 1, true]
```

Returns: `$987,654,321.99`

### String inputs with special characters

```text
$formatUSD[$1,234.56]
```

Returns: `$1234.56`

```text
$formatUSD[  $50.00  ]
```

Returns: `$50.00`

### Rounding

```text
$formatUSD[123.456]
```

Returns: `$123.46`

```text
$formatUSD[10, 3]
```

Returns: `$3.33`

### Real-world scenarios

Convert bits to dollars (100 bits = $1):

```text
$formatUSD[1000, 100]
```

Returns: `$10.00`

Convert cents to dollars with commas:

```text
$formatUSD[123456, 100, true]
```

Returns: `$1,234.56`

### Invalid inputs

```text
$formatUSD[abc]
```

Returns: `$0.00`

```text
$formatUSD[100, 0]
```

Returns: `$100.00` (zero divisor treated as 1)

## Related Variables

None