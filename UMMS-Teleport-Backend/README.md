# UMMS Teleport Backend

Backend service for the UMMS Inpatient / Teleport application. It manages
patients and their contacts, Jitsi meeting invitations and JWTs, meeting
history, EMR images, DigitalOcean Spaces uploads, and real-time meeting events.

## Tech stack

- Node.js and TypeScript
- Express 5
- PostgreSQL with Prisma
- Jitsi Meet JWT authentication
- WebSockets
- DigitalOcean Spaces (S3-compatible storage)

## Prerequisites

- Node.js 20.19 or newer
- npm
- PostgreSQL

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and configure at least the database:

   ```env
   PORT=4000
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
   DB_SSL=true
   ```

   The application also uses the following variables when their related
   integrations are enabled:

   ```env
   JITSI_BASE_URL=https://meet.example.com
   JITSI_APP_ID=your-jitsi-app-id
   JITSI_APP_SECRET=your-jitsi-app-secret
   INVITATION_EXPIRY_HOURS=24

   DO_SPACES_ENDPOINT=https://region.digitaloceanspaces.com
   DO_SPACES_REGION=region
   DO_SPACES_BUCKET=bucket-name
   DO_SPACES_KEY=your-key
   DO_SPACES_SECRET=your-secret

   TURBOSMS_USERNAME=your-username
   TURBOSMS_PASSWORD=your-password
   TURBOSMS_PARTNER_ID=your-partner-id
   TURBOSMS_SENDER=your-sender

   EMR_URL=https://emr.example.com
   ```

3. Apply database migrations and generate the Prisma client:

   ```bash
   npm run db:migrate:deploy
   npm run db:generate
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

The API runs at `http://localhost:4000` by default.

## Available scripts

| Command                     | Description                                                              |
| --------------------------- | ------------------------------------------------------------------------ |
| `npm run dev`               | Start the API in watch mode                                              |
| `npm run build`             | Compile TypeScript into `dist/`                                          |
| `npm run start`             | Run the compiled API                                                     |
| `npm run swagger`           | Start the standalone Swagger server (`PORT` defaults to 4001 when unset) |
| `npm run db:generate`       | Generate the Prisma client                                               |
| `npm run db:migrate`        | Create/apply migrations in development                                   |
| `npm run db:migrate:deploy` | Apply existing migrations in deployment environments                     |
| `npm run db:push`           | Push the schema without creating a migration                             |
| `npm run db:studio`         | Open Prisma Studio                                                       |

## API documentation

Swagger UI is served by the main API at:

```text
http://localhost:4000/api-docs
```

The raw OpenAPI document is available at
`http://localhost:4000/api-docs.json`. To run documentation separately on port
4001—even when `.env` defines the API port—use:

```bash
PORT=4001 npm run swagger
```

Then open `http://localhost:4001/api-docs`.

## Main endpoints

### System

- `GET /health`

### Patients

- `POST /api/patients`
- `GET /api/patients`
- `GET /api/patients/:id`
- `PATCH /api/patients/:id`
- `GET /api/patients/:id/meetings`

The patient-detail endpoint does not embed the complete meeting history. It
returns a bounded summary instead:

```json
{
  "latestMeeting": {
    "id": "meeting-id",
    "roomId": "room-id",
    "patientId": "patient-id",
    "createdAt": "2026-08-12T10:00:00.000Z"
  },
  "meetingCount": 42
}
```

Use the dedicated endpoint for meeting history. Results are newest first and
use cursor pagination:

```http
GET /api/patients/:id/meetings?limit=20
GET /api/patients/:id/meetings?limit=20&cursor=<nextCursor>
```

`limit` defaults to 20 and must be between 1 and 100. The response format is:

```json
{
  "items": [],
  "nextCursor": null,
  "hasMore": false
}
```

Pass the returned `nextCursor` to retrieve the next page. Invalid cursors and
invalid limits return HTTP 400. Meeting room IDs are unique, so retrying the
same room creation does not add duplicate meeting records.

### Invitations

- `POST /api/invitations/create`
- `POST /api/invitations/accept`
- `GET /api/invitations/status?inviteBatchId=:id`
- `GET /api/invitations/active?patientId=:id`
- `GET /api/invitations/invite/:inviteId`
- `POST /api/invitations/send-sms`
- `POST /api/invitations/waiting-room-reminder`
- `POST /api/invitations/nudge-guests`
- `POST /api/invitations/leave`
- `POST /api/invitations/conclude`

### Providers and contacts

- `POST /api/providers`
- `GET /api/providers`
- `GET /api/providers/:id`
- `PATCH /api/providers/:id`
- `POST /api/family-friends`
- `GET /api/family-friends`
- `GET /api/family-friends/:id`
- `PATCH /api/family-friends/:id`

### EMR and file storage

- `POST /api/emr/upload-image`
- `GET /api/emr/images`
- `POST /api/spaces/upload`
- `GET /api/spaces/files`

Refer to Swagger for request schemas and complete response details.

## Project structure

```text
prisma/
├── migrations/       # Versioned database migrations
└── schema.prisma     # Prisma data model
src/
├── config/           # Database, Prisma, and Swagger configuration
├── controllers/      # HTTP request handlers
├── generated/        # Generated Prisma client
├── helper/           # JWT and shared helpers
├── routes/           # Express routers
├── services/         # Business logic and persistence
├── types/            # TypeScript interfaces
├── index.ts          # Application entry point
└── websocket.ts      # Real-time meeting events
```

## Deployment notes

Apply committed migrations before starting a newly deployed application:

```bash
npm ci
npm run db:migrate:deploy
npm run build
npm start
```

Never commit `.env` or production credentials.

## License

ISC
