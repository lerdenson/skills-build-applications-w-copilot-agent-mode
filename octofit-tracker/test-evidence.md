# OctoFit verification evidence

Run date: 2026-11-20

## Automated checks

| Command | Result |
| --- | --- |
| `npm run test:data --prefix octofit-tracker/backend` | Passed: 1 file, 5 tests |
| `npm run test:api --prefix octofit-tracker/backend` | Passed: 1 file, 4 tests |
| `npm test --prefix octofit-tracker/frontend` | Passed: 1 file, 15 tests |
| `npm run build --prefix octofit-tracker/backend` | Passed: TypeScript check |
| `npm run build --prefix octofit-tracker/frontend` | Passed: TypeScript check and Vite production build (31 modules) |

## Live services and user journeys

MongoDB responded successfully to `db.adminCommand({ping:1})`. The seed script completed. The API health check returned `200` with `{"ok":true}`. MongoDB, the API on port 8000, and Vite on port 5173 were already running and remained running.

Each UI route returned `200` from Vite, and its proxied API path returned `200`:

| Journey | UI route | API data |
| --- | --- | --- |
| Activities | `/activities` | Two seeded activities |
| Teams | `/teams` | Octocats and Robocats |
| Leaderboard | `/leaderboard` | Two ranked teams |
| Workout suggestions | `/workouts` | Two suggestions for Mona |

The frontend contract tests verify populated content across all four journeys. They also verify that API failures produce an accessible `role="alert"` on every journey. Live invalid activity requests returned `400` for a missing `userId` and for `minutes: 0.5` (`{"error":"Activity minutes must be at least 1"}`).

The route/proxy checks and component contract tests were run without an interactive browser; no browser screenshot was captured.
