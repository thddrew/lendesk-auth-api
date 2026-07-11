# Implementing an auth service

This is a demo of a Basic Authentication API service built on Hono.js.

### Running the API

Start a local redis instance and update the `env` file with the endpoint (or use a cloud redis instance)

```bun
// we can use redis-server for local instance
redis-server
```

Start the API

```bun
bun install
bun dev
```

### Architecture

Why Hono.js?

- I like that its built on Web Standards API and can be deployed to multiple runtimes with zero to minimal changes
- I like that there is type-safety built-in and its not hard to add further type-safety, eg. route query params, route paths in the hono client, RPC
- Type-safe testing client makes for good DX

Redis as our key-value storage for users.

- I kept the Redis class API lean and only exposed core methods. The client instance is private to avoid unintended actions on it (maybe make a `protected` client getter if we need to)

`bcrypt` for password hashing

### Features

- `POST /auth/sign-up` - register new users with a username and password. Unique username is required and password has reasonable complexity requirements.
- `GET /auth/authenticate` - authenticate a user's Basic Authentication credentials
- `GET /v1` - intended to be for protected routes
- `GET /healthcheck` - public healthcheck route

### Error Handling

All errors are caught and formatted by Hono's `onError` handler and return a status code + JSON: `{ error: string, type: InternalError | AuthError }` .

Success returns 200, authentication failures return 401, and other codes appropriately.

The default Error class is extended so that we can differentiate the types of errors for debugging eg. AuthError, InternalError (database). The InternalError class has a generic user message to avoid exposing internal traces but we log the actual error to our logging service.

### Testing

Vitest and Hono makes testing pretty simple especially with its type-safe test client (with the caveat being you have to chain the routes directly on the Hono instance).

```bun
// Start vitest in watch mode
bun run test
```

Unit tests are colocated with their target functions and integration tests are in `tests/integration`.

We use a separate logical database in redis for our tests (defined in `.env`).

### Post implementation thoughts

- I don't particularly like having the name `v1` for only the protected routes. It should be the top level route so that if our auth implementation changes, we can keep backwards compat. (Did not get to this change)
- Not all tests were created, just an example of a unit and integration test
- I'd like to add rate limiting to ensure our resources don't get flooded
- migrate to HSET if user object becomes more complex and we need to avoid full read/writes

### How I used AI for this project

I treated this as a bit of coding test for myself so I handwrote 99% of the code, but that's not to say I did not use AI at all. This time it was more of an assistant doing things such as:

- used to validate my high level ideas and ask about risks eg. designing architecture of Redis class
- asking for deep implementation details (this is fun but often times leads me down a rabbit hole)
- writing regex...
- completing some of the test cases after I've scaffolded and created some as examples
- code reviews
- make and push to my git repo

This README was not made by AI.
