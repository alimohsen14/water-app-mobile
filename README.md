# Water Meter App

An end-user mobile app for tracking household water consumption. It gives you a clear, at-a-glance view of how much water you're using and warns you before small problems become costly ones.

## Features

- **Current reading** — see your meter's latest reading at any time.
- **Daily & monthly usage** — track consumption trends day by day and month by month.
- **Meter status** — monitor your water meter's battery and valve status.
- **Alerts** — get notified about unusual usage, potential leaks, and meter issues.

## Tech Stack

- **React Native** — cross-platform mobile UI.
- **Expo SDK 57** — managed native tooling and build pipeline.
- **TypeScript** — end-to-end type safety.
- **Expo Router** — file-based navigation.

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the development server (dev client)
pnpm start

# Run on a device/simulator
pnpm ios
pnpm android
```

## Scripts

| Script | Description |
| --- | --- |
| `pnpm start` | Start the Expo dev server with the dev client. |
| `pnpm ios` | Build and run the app on iOS. |
| `pnpm android` | Build and run the app on Android. |
| `pnpm web` | Run the app in the browser. |
| `pnpm compile` | Type-check the project with TypeScript. |
| `pnpm lint` | Lint and auto-fix with ESLint. |
| `pnpm lint:check` | Lint without auto-fixing. |
| `pnpm test` | Run the test suite with Jest. |
