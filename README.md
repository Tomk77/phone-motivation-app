# CrossDay

CrossDay is a single-goal motivation tracker inspired by the X-effect. The app keeps data entirely on-device, scheduling daily reminders to keep the chain alive while providing an accessible calendar for quick notes.

## Project structure

- `App.tsx` – entry point setting up providers, navigation, and notification handling.
- `src/navigation` – React Navigation stack and tab configuration.
- `src/screens` – Today, Calendar, Settings, and onboarding flows.
- `src/store` – lightweight Redux Toolkit inspired store implementation, selectors, and async actions.
- `src/repositories` – SQLite and secure store abstractions for durable persistence.
- `src/services` – notifications, haptics, export helper, and logger.
- `src/components` – UI building blocks such as calendar cells, streak cards, and inputs.
- `src/utils` – date utilities, constants, and ID helpers.
- `src/testing` – minimal mocks and a lightweight render utility used by the custom test runner.
- `assets` – generated icons and splash screens.

## Requirements

- Node.js 18+
- npm 9+

## Installation

Dependencies are already vendored for this challenge environment. In a fresh clone run:

```bash
npm install
```

After dependencies are installed the asset generator runs automatically. If you need to refresh the placeholder icon and splash files manually run `npm run generate:assets` to recreate them.

> ℹ️ Due to the restricted environment, a bespoke test runner is provided instead of Jest. It executes the TypeScript test files with a tiny assertion library while honouring the same test structure.

## Running the app

Start the Expo development server:

```bash
npm start
```

- `npm run android` – launch on Android emulator
- `npm run ios` – launch on iOS simulator
- `npm run web` – run in Expo web preview

### First run

1. Complete onboarding by naming the goal, choosing a reminder time, and enabling notifications.
2. The Today tab surfaces streak progress, quick notes, and Late Mark prompts.
3. The Calendar tab shows a monthly grid with editable notes.
4. Settings allow reminder, theme, Late Mark, export, and data reset controls.

## Testing

Execute all unit tests:

```bash
npm test
```

The custom runner lives at `scripts/jest-runner.js` and supports familiar `describe` / `it` semantics, async tests, and the subset of matchers used in this project.

## Seed data & mocks

- Repositories bootstrap clean stores on first load.
- The test suite injects in-memory repositories and notification stubs to simulate Expo modules.

## Future work

- Multiple goals with per-goal reminders
- iCloud or Google Drive backup and restore
- Widgets for quick mark
- Gentle streak save window with limited forgiveness
- Insights with simple charts
- Optional sign in and cloud sync
