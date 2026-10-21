# UMMS Teleport — Telehealth Consultation Platform

Production-ready, HIPAA-oriented telehealth visit platform enabling inpatient patient consultation, provider/specialist invites, family & guest participation, device preview, real-time waiting-room coordination, and secure video visits powered by Jitsi Meet.

---

## 1. Project Overview & Architecture

UMMS Teleport is organized as a unified monorepo:

```text
Jisti Teleport/
├── UMMS-Teleport-Backend/     # Node.js, Express 5, Prisma, PostgreSQL, WebSockets
├── UMMS-Teleport-frontend/    # React 19, TypeScript, Vite, Redux Toolkit, styled-components
├── .gitignore                 # Root gitignore
└── README.md                  # Comprehensive setup & developer guide
```

### Technology Stack
- **Frontend**: React 19, TypeScript 5.9, Vite 7, Redux Toolkit (RTK Query), styled-components, Framer Motion, PrimeReact, Capacitor (iPad/iOS support).
- **Backend**: Node.js 22, Express 5, Prisma 7, PostgreSQL (pg driver with adapter-pg), WebSockets (`ws`), AWS SDK v3 (S3/DigitalOcean Spaces with presigner), JWT.
- **Video Infrastructure**: Jitsi Meet with room tokens and token affiliation.

---

## 2. Prerequisites

- **Node.js**: `v20.19.0` or newer (Tested on Node `v22.15.0`)
- **Package Manager**: `npm` `v10.9.0` or newer
- **Database**: PostgreSQL 14+ (Local instance or cloud-hosted)

---

## 3. Quickstart & Local Setup

### Step 1: Install Dependencies

```bash
# In the backend directory:
cd UMMS-Teleport-Backend
npm install

# In the frontend directory:
cd ../UMMS-Teleport-frontend
npm install
```

---

### Step 2: Configure Environment Variables

#### Backend Configuration:
Copy `.env.example` in `UMMS-Teleport-Backend/`:
```bash
cd UMMS-Teleport-Backend
cp .env.example .env
```
Ensure `DATABASE_URL` is configured for your PostgreSQL instance:
```env
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/umms_teleport?sslmode=disable"
DB_SSL=false
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
JITSI_BASE_URL=https://meet.example.com
JITSI_DOMAIN=meet.example.com
JITSI_APP_ID=your-jitsi-app-id
JITSI_APP_SECRET=your-jitsi-app-secret
DO_SPACES_ACL=private
```

#### Frontend Configuration:
Copy `.env.example` in `UMMS-Teleport-frontend/`:
```bash
cd ../UMMS-Teleport-frontend
cp .env.example .env
```
Configure:
```env
VITE_BACKEND_BASE_URL=http://localhost:4000/api
VITE_WS_URL=ws://localhost:4000
VITE_JITSI_DOMAIN=meet.example.com
```

---

### Step 3: Database Migrations & Seeding

Run database migrations and seed sample data:

```bash
cd UMMS-Teleport-Backend

# Deploy migrations to your database
npm run db:migrate:deploy

# Generate Prisma Client
npm run db:generate

# Populate sample patient, providers, and family members
npm run db:seed
```

The seed script creates:
- **Default Patient**: Ashley Testpatient (CSN: `5080483241`, MRN: `3001330978`, Admitted to Room 302)
- **Providers**: Dr. Sarah Johnson (Chief Medical Officer), Dr. Michael Chen (Cardiology), Emily Davis (Lead Nurse)
- **Family**: Simon Testpatient (Father), Daniel Lawrence (Friend)

---

### Step 4: Run Development Servers

**Terminal 1 (Backend API & WebSocket):**
```bash
cd UMMS-Teleport-Backend
npm run dev
```
*API runs at `http://localhost:4000` with Swagger docs at `http://localhost:4000/api-docs`.*

**Terminal 2 (Frontend Client):**
```bash
cd UMMS-Teleport-frontend
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 4. Key Application Workflows

1. **Patient Band Scan & Identification**:
   - Navigate to `http://localhost:5173/band-scan`.
   - Enter or scan CSN (e.g. `5080483241`).
   - Device associates with patient and opens `http://localhost:5173/patient-identifier-information/5080483241`.
2. **Provider Consultation Console**:
   - Open `http://localhost:5173/provider/5080483241`.
   - View clinical details, manage invited specialists and family members.
   - Initiate Jitsi telehealth consultation room.
3. **Family & Guest Invitations**:
   - From patient screen, select "Connect with Family or Friends".
   - Select family contacts or add new invitees.
   - Backend dispatches invitations and tracks admission in waiting room via WebSocket.
4. **Waiting Room & Video Call**:
   - Guests arrive at `/invite/accept?inviteId=...`.
   - Once provider announces presence (`doctor_joined`), guests proceed to device preview and enter call.
   - Live video, picture-in-picture, screen sharing, and EMR photo capture.

---

## 5. Security & Privacy Architecture

- **Private Medical EMR Images**: DigitalOcean Spaces uploads now default to `DO_SPACES_ACL="private"`. File access generates time-limited presigned URLs (via `@aws-sdk/s3-request-presigner`) to protect HIPAA/patient privacy.
- **CORS & HTTP Security Headers**: Configurable `CORS_ORIGIN` support, `nosniff`, `SAMEORIGIN`, and centralized error sanitization preventing stack trace leakage.
- **Jitsi JWT Claims**: Automated HMAC-SHA256 signature generation with role separation (moderator vs. guest) and dynamic domain derivation.
- **WebSocket Access Control**: Session-scoped waiting room rooms with heartbeat timeout management (`PRESENCE_HEARTBEAT_TIMEOUT_MS = 45s`).

---

## 6. Verification & Automated Testing

### Backend Unit & Integration Tests:
```bash
cd UMMS-Teleport-Backend
npm test
```
*Runs native Node test suite verifying JWT generation, role claims, and Spaces security.*

### Frontend Typecheck & Production Build:
```bash
cd UMMS-Teleport-frontend
npm run build
```
*Validates full TypeScript typing (`tsc -b`), ESLint checks, and builds optimized production assets.*
