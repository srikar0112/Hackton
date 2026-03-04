# BioAdaptive Learning Platform — Technical Documentation

> This file is for internal reference only. Not exposed on the website.

## Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | SQLite (dev) / PostgreSQL (prod via Vercel) |
| ORM | Prisma v5 |
| Auth | NextAuth.js v4 (JWT + Credentials) |
| Charts | Recharts |
| Styling | Vanilla CSS — Custom Design System |

---

## Architecture

### Database Schema (Prisma)
- **User** — Auth fields + chronotype + onboardingDone flag
- **PersonalityProfile** — Quiz result, archetype, raw scores (JSON)
- **UserProfile** — Subjects, goals, learning style, resource preferences
- **Task** — STNU-scheduled tasks with min/max duration bounds
- **HealthMetric** — Sleep duration/quality + stress level per session
- **StudySession** — Actual study record tied to a Task

### API Routes
| Method | Route | Purpose |
|---|---|---|
| POST | `/api/onboarding` | Save full onboarding data (profile + health + personality) |
| GET | `/api/schedule` | DPDS priority-sorted task queue with biostate modifiers |
| GET | `/api/resources` | Filtered resource list by subject/type/query |
| PATCH | `/api/tasks/[id]/complete` | Mark a task as completed |
| GET/POST | `/api/auth/[...nextauth]` | NextAuth credentials handler |

### STNU Scheduling Logic (`/api/schedule/route.ts`)
Priority score = `0.6 × urgency + 0.4 × (complexity × bioMod)`
- **urgency** = (time_to_deadline / estimated_duration) normalized 0–100
- **bioMod** = 1.0 - sleep_penalty(0.2) - stress_penalty(0.15)

### Personality Archetypes
| Type | Traits | Study Strategy |
|---|---|---|
| Explorer | High openness, curious | Diverse resources, concept maps |
| Architect | High conscientiousness | Structured plans, spaced repetition |
| Collaborator | High social, empathetic | Study groups, discussion forums |
| Practitioner | Kinesthetic, hands-on | Labs, practice problems, projects |

---

## Deployment (Vercel)

### Environment Variables
```env
NEXTAUTH_SECRET=<32+ char random string>
NEXTAUTH_URL=https://your-app.vercel.app
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
```

### Steps
1. Push code to GitHub
2. Import repo in Vercel
3. Set the 3 env vars above
4. Deploy — Vercel auto-runs `prisma generate` on build

---

## Role Permissions
| Feature | Admin | Professor | Student | Normal | Technical |
|---|---|---|---|---|---|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| Study Engine | ✅ | ✅ | ✅ | ❌ | ❌ |
| Habit Tracker | ✅ | ✅ | ✅ | ❌ | ❌ |
| Analytics | ✅ | ✅ (class) | ✅ (own) | ❌ | ✅ |
| Admin Panel | ✅ | ❌ | ❌ | ❌ | ❌ |
| Resources | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Compliance
- **GDPR** — User data deletion via Prisma cascade on `User.delete`
- **FERPA** — Student health data isolated by `userId`, Technical role has no access
- **COPPA** — Age gate on onboarding for users under 13
- **Encryption** — AES-256 at rest (Vercel Postgres), TLS 1.3 in transit
