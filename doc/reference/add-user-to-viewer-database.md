# Add User to Viewer Database

## Table of Contents

- [Introduction](#introduction)
- [Usage](#usage)
- [Parameters](#parameters)
- [Returns](#returns)
- [Examples](#examples)
- [Error Handling](#error-handling)

## Introduction

The **Add User to Viewer Database** effect adds a Twitch user to the Firebot viewer database if they are not already present. You can identify the user by user ID, username, or both. The effect validates that provided identifiers agree with each other and with Twitch data before creating a new viewer record.

This is useful for programmatically adding viewers to the database, such as when handling first-time chatters or integrating with external systems.

It is safe to use this effect even if you are using my [Kick](https://github.com/TheStaticMage/firebot-mage-kick-integration) or [YouTube](https://github.com/TheStaticMage/firebot-mage-youtube-integration) integrations. However, this effect will only work for Twitch users. If you pass Kick or YouTube user information, it may behave unpredictably or fail.

## Usage

At least one of `userId` or `username` must be provided. Providing both allows stricter validation.

## Parameters

**userId** (optional)

- Type: string
- The Twitch user ID (numeric string, e.g., `"123456789"`)
- If provided alongside `username`, both must resolve to the same Twitch user

**username** (optional)

- Type: string
- The Twitch username, with or without the `@` prefix (e.g., `"someusername"` or `"@someusername"`)
- If provided alongside `userId`, both must resolve to the same Twitch user

## Returns

**Success:**

| Output | Type | Description |
| -------- | ------ | ------------- |
| `success` | boolean | Whether the effect completed without errors |
| `userPreviouslyExisted` | boolean | Whether the user already existed in the viewer database |
| `userWasAdded` | boolean | Whether the user was added as a new record (i.e., they did not previously exist) |
| `errorMessage` | string | Always empty string on success |

**Failure:**

| Output | Type | Description |
| -------- | ------ | ------------- |
| `success` | boolean | Always `false` on failure |
| `userPreviouslyExisted` | boolean | Undefined => `false` |
| `userWasAdded` | boolean | Undefined => `false` |
| `errorMessage` | string | Error description |

## Examples

### Add user by username only

- username: "ExampleTwitchUser"

Returns: `success=true`, `userWasAdded=true`, `userPreviouslyExisted=false` (if new user)

### Add user by user ID only

- userId: "123456789"

Returns: `success=true`, `userWasAdded=true`, `userPreviouslyExisted=false` (if new user)

### Add user with both identifiers for strict validation

- username: "ExampleTwitchUser"
- userId: "123456789"

Both identifiers must resolve to the same Twitch user. If they disagree, the effect fails.

### Check if viewer was newly added

Use the output variables to branch your automation:

- If `userWasAdded=true`: New viewer -- (for example) send a welcome message
- If `userPreviouslyExisted=true`: Existing viewer -- no action needed

- username: "ExampleTwitchUser"

Then in a subsequent effect, check `userWasAdded` to decide whether to send a welcome.

### User already exists in database

- userId: "123456789"

Returns: `success=true`, `userWasAdded=false`, `userPreviouslyExisted=true`

## Error Handling

### Missing required input

If both `userId` and `username` are empty (after whitespace trimming), an error occurs.

Returns: `success=false`, `errorMessage="No user ID or username provided."`

### User ID and username mismatch (existing users)

If both `userId` and `username` are provided but resolve to different existing users:

Returns: `success=false`, `errorMessage="Provided user ID and username matched different existing users."`

### User ID mismatch with existing user

If the provided `userId` does not match the existing user's ID in the database:

Returns: `success=false`, `errorMessage="Provided user ID does not match existing user's ID."`

### Username mismatch with existing user

If the provided `username` does not match the existing user's username in the database:

Returns: `success=false`, `errorMessage="Provided username does not match existing user's username."`

### Twitch user not found

If the user does not exist in the database and cannot be found on Twitch:

Returns: `success=false`, `errorMessage="Could not retrieve Twitch data."`

### Twitch data mismatch

If user data retrieved from Twitch does not match the provided identifiers:

Returns: `success=false`, `errorMessage="Provided user ID does not match Twitch data ID."`

or:

Returns: `success=false`, `errorMessage="Provided user ID and username do not match."`

### Database creation failure

If the viewer database fails to create the new record:

Returns: `success=false`, `errorMessage="Could not add user to the database."`
