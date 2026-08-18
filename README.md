# Oxford Secondary School Coding Summer Camp — Attendance Portal

A minimalist, high-density web application and real-time attendance management system for the **Oxford Secondary School Coding Summer Camp in Butwal, Nepal (Summer 2026 Cohort)**.

---

## 🎨 Design Tokens & Theme

- **Design Aesthetic**: Clean Minimalism Developer Dashboard
- **Primary Background**: `#121212` (Deep Slate Black)
- **Secondary Surface**: `#1E1E1E` (Soft Charcoal for cards, panels, modals)
- **Primary Typography**: `#F5F5F7` (Crisp Off-White)
- **Muted Metadata / Subtitles**: `#8E8E93` (Muted Gray)
- **Borders & Dividers**: `#3A3A3C` (Subtle Structural Contrast)
- **Action Highlight (Blue)**: `#0A84FF` (Primary CTAs, Badges)
- **Status Green**: `#30D158` (Present Indicator, Verified Seals)
- **Iconography**: Lucide React vectors & SVG hexagonal circuit badges

---

## 🚀 Key Application Features

1. **Dual-Tab Authentication Gateway**:
   - **Student Access**: Single-use cryptographic token (`OXF-2026-XXXX`) login with zero latency.
   - **Admin Portal**: Instructor control login (`admin` / `HenryCabil@26`).
2. **First-Time Student Onboarding Flow**:
   - Detects fresh unactivated tokens (`OXF-2026-NEW99`, `OXF-2026-GUEST`, etc.).
   - Full student registration modal with pre-filled school details, class selection, and emergency parent contact.
   - Automatically grants **+50 welcome CODEX reward points**.
3. **Student Workspace**:
   - **Daily Attendance Tab**: Prominent "I AM PRESENT" button with active pulse animations, transforming into a verified green status pill upon check-in. Complete historical attendance logs.
   - **CODEX Digital Rewards Protocol**: Hexagonal circuit badge visualizer, perk milestone shop (stickers, distinction certificates, 1-on-1 mentorship, Raspberry Pi Pico kits), and point ledger.
   - **Student Profile**: Cohort credentials, academic track gauge, and inline detail editor.
4. **Admin Command Desk**:
   - **Live Metrics Bar**: Total Registered Students, Present Today, Absent Today, Cohort Attendance Rate %.
   - **Real-Time Attendance Register**: Filter by Class/Grade, Search by name/token/phone, instant manual status override toggles, and CSV export.
   - **Access Token Manager**: Cryptographic token generator and revocation controls.

---

## ⚡ Supabase Backend Architecture

- **Project ID**: `tnaczmynxmhqjrzuuyto`
- **Region**: `ap-southeast-1` (Asia Pacific - Singapore)
- **API URL**: `https://tnaczmynxmhqjrzuuyto.supabase.co`

### Database Tables
- `tokens`: Single-use camp access tokens and student mapping.
- `students`: Student profile registry, academic track, and CODEX point balances.
- `attendance_records`: Daily presence logs with timestamp and verification source (`SELF` / `ADMIN`).
- `codex_transactions`: Immutable point transaction ledger.
- `codex_perks`: Reward roadmap and milestone perks catalog.

### PostgreSQL RPC Functions
- `mark_attendance_self(p_student_id, p_date, p_check_in_time)`: Atomic check-in and +10 CODEX point award.
- `complete_student_onboarding(...)`: Atomic registration, token activation, welcome points grant, and day 1 attendance initialization.

---

## 🛠️ Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env`:
   ```env
   VITE_SUPABASE_URL="https://tnaczmynxmhqjrzuuyto.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
