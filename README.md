# Shiksha+ Backend (v1)

Production-ready, enterprise-grade RESTful API built for **Shiksha+** platform using Node.js, Express, TypeScript, PostgreSQL, and Prisma ORM.

Designed to scale to **100,000+ active users** with feature-based modular architecture, strict type safety, containerized deployment, and OWASP security standards.

---

## 🚀 Tech Stack

- **Runtime & Language**: Node.js (v20 LTS), TypeScript 5.7+
- **Framework**: Express.js
- **Database & ORM**: PostgreSQL 16, Prisma ORM
- **Validation**: Zod
- **Documentation**: Swagger / OpenAPI 3.1
- **Authentication**: Firebase Authentication (ID Token bridge), Custom JWT (Access + Refresh Tokens), cookie-parser
- **Storage & Services**: Cloudinary (Media assets), Firebase Admin SDK (Notifications)
- **Logging & Monitoring**: Pino Logger, pino-http
- **Security & Utilities**: Helmet, CORS, Compression, Express Rate Limit, Multer, UUID
- **DevOps & Tooling**: Docker, Docker Compose, ESLint 9 (Flat config), Prettier, Nodemon, tsx

---

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed on your host system:

- **Node.js**: `^20.0.0` or higher
- **npm**: `^10.0.0` or higher
- **Docker Desktop**: Version 24+ and Docker Compose v2+
- **PostgreSQL**: Version 16 (optional if using Docker Compose)

---

## 🛠️ Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/shiksha-plus/shiksha-api.git
   cd shiksha-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

---

## ⚙️ Environment Setup

Copy the sample environment file and configure local credentials:

```bash
cp .env.example .env
```

Key environment variables to update in `.env`:

| Variable             | Description                                   | Default / Example                                              |
| :------------------- | :-------------------------------------------- | :------------------------------------------------------------- |
| `NODE_ENV`           | Application environment                       | `development`                                                  |
| `PORT`               | Server listening port                         | `5000`                                                         |
| `DATABASE_URL`       | PostgreSQL connection string                  | `postgresql://shiksha_user:password@localhost:5432/shiksha_db` |
| `JWT_ACCESS_SECRET`  | Secret key for signing access tokens          | Min 32 character string                                        |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh tokens         | Min 32 character string                                        |
| `GOOGLE_CLIENT_ID`   | OAuth 2.0 Client ID from Google Cloud         | `*.apps.googleusercontent.com`                                 |
| `CLOUDINARY_*`       | Cloudinary API credentials                    | Cloud Name, API Key & Secret                                   |
| `LOG_LEVEL`          | Pino logging level (`info`, `debug`, `error`) | `info`                                                         |

---

## 💻 Development Workflow

1. **Start Database & Infrastructure via Docker**:

   ```bash
   docker-compose up postgres -d
   ```

2. **Run Prisma Migrations & Generate Client**:

   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   ```

3. **Start Live-Reload Development Server**:
   ```bash
   npm run dev
   ```

The API will be available at: `http://localhost:5000/api/v1`

---

## 🏗️ Build & Production Deployment

1. **Build TypeScript Assets**:

   ```bash
   npm run build
   ```

2. **Start Production Node Server**:

   ```bash
   npm run start
   ```

3. **Run Production Container Build**:
   ```bash
   docker-compose up --build -d
   ```

---

## 📜 Available NPM Scripts

| Script                    | Command                      | Description                                        |
| :------------------------ | :--------------------------- | :------------------------------------------------- |
| `npm run dev`             | `nodemon`                    | Starts dev server with live hot-reloading          |
| `npm run build`           | `tsc -p tsconfig.build.json` | Compiles TypeScript code into `./dist`             |
| `npm run start`           | `node dist/server.js`        | Executes compiled production JavaScript bundle     |
| `npm run lint`            | `eslint .`                   | Runs ESLint check across codebase                  |
| `npm run lint:fix`        | `eslint . --fix`             | Automatically fixes code linting errors            |
| `npm run format`          | `prettier --write .`         | Formats code repository using Prettier             |
| `npm run prisma:generate` | `prisma generate`            | Generates TypeScript client bindings for Prisma    |
| `npm run prisma:migrate`  | `prisma migrate dev`         | Executes database migrations in dev                |
| `npm run prisma:deploy`   | `prisma migrate deploy`      | Applies pending migrations in production           |
| `npm run prisma:studio`   | `prisma studio`              | Opens Prisma Studio web UI for database management |
| `npm run seed`            | `tsx prisma/seed.ts`         | Runs database seeding script                       |

---

## 📂 Project Folder Structure

```
shiksha-api/
├── .github/              # GitHub Actions workflows & CI/CD
├── prisma/               # Schema models, migrations & seeders
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── scripts/              # Infrastructure & administrative scripts
│   ├── backup.ts
│   ├── build.ts
│   ├── clean.ts
│   └── seed.ts
├── src/                  # Application source code
│   ├── app.ts            # Express application setup
│   ├── server.ts         # Server entrypoint & lifecycle
│   ├── config/           # Environment & third-party configs
│   ├── core/             # Framework utilities, response helpers, errors
│   ├── common/           # Shared validators, helpers & utilities
│   ├── middleware/       # Global Express middleware
│   ├── routes/           # Global routing definitions
│   ├── integrations/     # Firebase, Cloudinary, Google OAuth
│   ├── types/            # Custom TypeScript declarations
│   └── modules/          # Feature-based domain modules
│       ├── auth/
│       ├── users/
│       ├── exams/
│       └── ...
├── tests/                # Automated integration & unit tests
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── eslint.config.js
├── nodemon.json
├── openapi.yaml
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── README.md
```

---

## 🔒 Security Best Practices

- **Non-Root Docker Execution**: Containers run under unprivileged `node` user accounts.
- **OWASP Headers**: Secured via `helmet` HTTP header protections.
- **Rate Limiting**: Rate limit protection against brute-force attacks via `express-rate-limit`.
- **Environment Isolation**: Credentials and keys are strictly injected via `.env` and never hardcoded in source control.

---

## 📄 License

Internal Proprietary Project - All Rights Reserved © Shiksha+
