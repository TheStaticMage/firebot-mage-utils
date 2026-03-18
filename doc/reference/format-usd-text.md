# $formatUSDText

## Table of Contents

- [Introduction](#introduction)
- [Usage](#usage)
- [Parameters](#parameters)
- [Returns](#returns)
- [Supported Range](#supported-range)
- [Examples](#examples)
- [Related Variables](#related-variables)

## Introduction

The `$formatUSDText` replace variable converts a dollar amount to English words optimized for text-to-speech (TTS) systems. This is useful for reading currency amounts aloud naturally, with proper hyphenation, singular/plural forms, and optional cent handling. It supports optional division before converting and handles amounts up to ±10 trillion.

## Usage

```text
$formatUSDText[amount]
$formatUSDText[amount, divisor]
```

## Parameters

**amount** (required)

- Type: number or string
- The amount to convert to words
- String inputs are cleaned of non-numeric characters (except digits, minus sign, and decimal point)
- Invalid values are treated as 0

**divisor** (optional, default: 1)

- Type: number or string
- Divides the amount before converting to words
- String inputs are cleaned of non-numeric characters (except digits, minus sign, and decimal point)
- Invalid values or zero are treated as 1

## Returns

A string containing the English word representation of the dollar amount, formatted for natural text-to-speech reading.

**Characteristics:**

- Numbers 21-99 use hyphens (e.g., "twenty-one", "ninety-nine")
- Singular "dollar" or "cent" for 1, plural for all other amounts
- When dollars are zero and cents are present, only cents are output (no "zero dollars and")
- Zero cents are omitted from output
- Cents are preceded with "and" when dollars are present
- Negative amounts are prefixed with "negative"
- Scale words (thousand, million, billion, trillion) are properly spaced

## Supported Range

The supported range is **-10 trillion to 10 trillion inclusive**:

- **Minimum:** -10,000,000,000,000.00 (negative ten trillion)
- **Maximum:** 10,000,000,000,000.00 (ten trillion)

Amounts outside this range return an empty string.

This range is limited by JavaScript's number precision and ensures accurate conversion without floating-point rounding errors.

## Examples

### Basic formatting

```text
$formatUSDText[0]
```

Returns: `zero dollars`

```text
$formatUSDText[1]
```

Returns: `one dollar`

```text
$formatUSDText[5]
```

Returns: `five dollars`

### Compound numbers with hyphens

```text
$formatUSDText[21]
```

Returns: `twenty-one dollars`

```text
$formatUSDText[99]
```

Returns: `ninety-nine dollars`

### Hundreds

```text
$formatUSDText[100]
```

Returns: `one hundred dollars`

```text
$formatUSDText[123]
```

Returns: `one hundred twenty-three dollars`

### Thousands

```text
$formatUSDText[1000]
```

Returns: `one thousand dollars`

```text
$formatUSDText[1234]
```

Returns: `one thousand two hundred thirty-four dollars`

```text
$formatUSDText[420000]
```

Returns: `four hundred twenty thousand dollars`

### Millions

```text
$formatUSDText[1000000]
```

Returns: `one million dollars`

```text
$formatUSDText[1234567]
```

Returns: `one million two hundred thirty-four thousand five hundred sixty-seven dollars`

### Billions

```text
$formatUSDText[1000000000]
```

Returns: `one billion dollars`

```text
$formatUSDText[10000000000]
```

Returns: `ten billion dollars`

### Trillions (maximum scale)

```text
$formatUSDText[1000000000000]
```

Returns: `one trillion dollars`

```text
$formatUSDText[5000000000000]
```

Returns: `five trillion dollars`

```text
$formatUSDText[10000000000000]
```

Returns: `ten trillion dollars`

### Range boundaries

```text
$formatUSDText[10000000000000]
```

Returns: `ten trillion dollars` (maximum)

```text
$formatUSDText[10000000000000.00]
```

Returns: `ten trillion dollars` (maximum with zero cents)

```text
$formatUSDText[-10000000000000]
```

Returns: `negative ten trillion dollars` (minimum)

```text
$formatUSDText[10000000000001]
```

Returns: `` (empty string, exceeds maximum)

```text
$formatUSDText[-10000000000001]
```

Returns: `` (empty string, exceeds minimum)

### Decimal/Cents handling

```text
$formatUSDText[0.01]
```

Returns: `one cent`

```text
$formatUSDText[0.69]
```

Returns: `sixty-nine cents`

```text
$formatUSDText[420.69]
```

Returns: `four hundred twenty dollars and sixty-nine cents`

```text
$formatUSDText[100.00]
```

Returns: `one hundred dollars` (omits zero cents)

### Singular forms

```text
$formatUSDText[1.01]
```

Returns: `one dollar and one cent` (singular for both)

```text
$formatUSDText[2.01]
```

Returns: `two dollars and one cent` (plural dollars, singular cent)

### Negative amounts

```text
$formatUSDText[-5]
```

Returns: `negative five dollars`

```text
$formatUSDText[-200.4]
```

Returns: `negative two hundred dollars and forty cents`

```text
$formatUSDText[-10000000000000]
```

Returns: `negative ten trillion dollars`

### Division

```text
$formatUSDText[100, 2]
```

Returns: `fifty dollars`

```text
$formatUSDText[10000, 100]
```

Returns: `one hundred dollars` (typical bits-to-dollars conversion: 10000 bits ÷ 100 = $100)

```text
$formatUSDText[150, 100]
```

Returns: `one dollar and fifty cents` (150 bits ÷ 100 = $1.50)

### String inputs with special characters

```text
$formatUSDText[$420.69]
```

Returns: `four hundred twenty dollars and sixty-nine cents`

```text
$formatUSDText[1,234.56]
```

Returns: `one thousand two hundred thirty-four dollars and fifty-six cents`

```text
$formatUSDText[-$100.00]
```

Returns: `negative one hundred dollars`

### Real-world scenarios

Convert streamer bits to dollars:

```text
$formatUSDText[5000, 100]
```

Returns: `fifty dollars`

Convert large amounts:

```text
$formatUSDText[123456789.99]
```

Returns: `one hundred twenty-three million four hundred fifty-six thousand seven hundred eighty-nine dollars and ninety-nine cents`

### Invalid inputs

```text
$formatUSDText[abc]
```

Returns: `zero dollars`

```text
$formatUSDText[100, 0]
```

Returns: `one hundred dollars` (zero divisor treated as 1)

```text
$formatUSDText[10000000000001]
```

Returns: `` (empty string, exceeds 10 trillion maximum)

## Related Variables

- **`$formatUSD`**: Formats numbers as USD currency with dollar sign (e.g., `$420.69`)
