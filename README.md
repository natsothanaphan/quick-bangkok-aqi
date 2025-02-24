# Quick Bangkok AQI

## Install packages

1. Frontend.

```bash
npm i
```

2. Backend.

```bash
cd functions
npm i
```

## Backend testing process

1. Start emulators.

```bash
firebase emulators:start --only functions
```

2. Test.

```bash
curl http://localhost:5001/quick-bangkok-aqi/asia-southeast1/app/api/ping
```

## Frontend testing process

1. Start emulators.

```bash
firebase emulators:start --only functions
```

Note: do not start `auth` emulator - use mock user in production.

2. Run dev server.

```bash
npm run dev
```

3. Go to `http://localhost:5173`.

## Deployment process

### Functions

1. Run deploy command.

```bash
firebase deploy --only functions
```

### Hosting

1. Build.

```bash
npm run build
```

2. Run deploy command.

```bash
firebase deploy --only hosting
```
