# Implementing an auth service

This is a demo of a Basic Authentication API service built on Hono.js.

### Running the API

You can run the API in two ways with the simplest being starting the Docker Compose services.

**Option A — Docker Compose**

```bash
docker compose up --build
```

The API is at `http://localhost:3000`. Redis runs on port `7777` inside Compose (`cache` service). Compose sets `REDIS_URL=redis://cache:7777` for the API container.

**Option B — Local development**

To run locally, you'll need:

- `bun` package manager
- a local redis instance. We'll use `redis-server` here.

Start Redis locally:

```bash
redis-server
```

For the demo, we use a purely in-memory instance so no snapshots and no append-only logs.

```bash
redis-server --save "" --appendonly no
```

Create a `.env` defining your local redis urls

```env
REDIS_URL=redis://localhost:6379
REDIS_URL_TEST=redis://localhost:6379/1
```

Then:

```bash
bun install
bun run dev
```

`REDIS_URL` is used by the running API. `REDIS_URL_TEST` points at Redis logical database `1` so integration tests stay isolated from app data on database `0`.

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

```bash
bun run test
```

Unit tests are colocated with their target functions and integration tests are in `tests/integration`.

We use a separate logical database in redis for our tests (defined in `.env`).

### Retro thoughts

- I don't particularly like having the name `v1` for only the protected routes. It should be the top level route so that if our auth implementation changes, we can keep backwards compat. (Did not get to this change)
- Not all tests were created, just an example of a unit and integration test
- I'd like to add rate limiting to ensure our resources don't get flooded
- migrate to HSET if user object becomes more complex and we need to avoid full read/writes

### How I use AI (and what I did for this assignment)

On my regular day to day, I do use a lot of AI agents to plan, delegate, and review. I treated this as a bit of coding test for myself so I wrote most of the code. This time, I used as AI as more of an assistant for things such as:

- used to validate my high level ideas and ask about risks eg. designing architecture of Redis class, security around how we use passwords
- asking for deep implementation details
- writing regex...
- completing some of the test cases after I've scaffolded and created some as examples
- setting up infra code such as docker
- debugging, code reviews, git management
