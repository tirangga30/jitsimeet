# UMMS Teleport Frontend

React frontend for UMMS Teleport. The application supports patient lookup,
provider and guest invitations, device preview, waiting-room coordination, and
Jitsi video visits. It can run in a browser or as an iOS app through Capacitor.

## Tech stack

- React 19 and TypeScript
- Vite
- Redux Toolkit and RTK Query
- styled-components and PrimeReact
- Jitsi React SDK
- Capacitor for iOS

## Prerequisites

- Node.js 20.19 or newer
- npm
- A running UMMS Teleport backend

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file, then configure the backend, WebSocket,
   and Jitsi URLs for your environment:

   ```bash
   cp .env.example .env
   ```

   ```env
   VITE_BACKEND_BASE_URL=http://localhost:4000/api
   VITE_WS_URL=ws://localhost:4000
   VITE_JITSI_DOMAIN=meet.example.com
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

Vite prints the local application URL when the server starts (normally
`http://localhost:5173`).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Run ESLint, type-check, and create a production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix supported lint issues |
| `npm run format` | Format supported project files with Prettier |
| `npm run preview` | Preview the production build locally |
| `npm run ios` | Build, sync, copy, and open the Capacitor iOS project |

## Waiting-room flow

Meeting admission is controlled by provider presence. It is not gated on the
patient or a designated guardian joining first.

1. The provider completes device preview and sends `doctor_joined` through the
   waiting-room WebSocket.
2. The provider can proceed to the video call immediately.
3. Invited guests initially remain in the waiting room.
4. A guest can open device preview and enter the call after receiving
   `doctor_joined`.

All invited participant types use the same flow. The frontend does not wait for
a participant-type-based `meeting_ready` event.

## Application areas

- Patient and device information
- Providers and staff management
- Family and friends management
- Invitation acceptance and waiting room
- Camera and microphone preview
- Jitsi video calls and participant layouts
- Meeting status and presence updates

## Project structure

```text
src/
├── assets/          # Images and icons
├── components/      # Shared UI and video-layout components
├── hooks/           # Device and Jitsi call logic
├── pages/           # Application screens and meeting flows
├── router/          # Application routes
├── store/           # Redux state and API services
├── styles/          # Theme and global styles
├── types/           # Shared TypeScript types
└── utils/           # Shared utilities
```

## Production build

```bash
npm run build
```

The deployable browser output is written to `dist/`. Keep `.env` and production
credentials out of source control.
