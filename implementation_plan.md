# Attendance & Student Management Enhancements

## Goal
- Capture attendance from today onward only.
- Assign the existing 100 pre‑generated tokens to students, and automatically generate new tokens when the student count exceeds 100.
- Provide admin UI to adjust Codex points with "+" / "‑" buttons and display each student's current points.

## User Review Required
> **[!IMPORTANT]**
> 1. Create a new Supabase table `students` (if not already) and `attendance` (date‑based).  
> 2. Add RPCs `upsert_student`, `generate_token_batch`, `upsert_attendance`, `adjust_codex_points`.  
> 3. UI changes: Section dropdown, Student Management tab, Export button (xlsx).  
> 4. Export format is .xlsx with a sheet per date (as previously agreed).

## Open Questions
> **[!WARNING]**
> - Should the token generation batch size be 100 (as we have 100 existing tokens) or another number?
> - When adding a new student manually, should the token field be visible for overriding, or always auto‑generated?

## Proposed Changes
### Front‑end
- **OnboardingModal.tsx** – replace the free‑text Section field with a `<select>` containing: Orange, Pink, Red, Purple, Blue, Green, Yellow.
- **AdminDashboard.tsx** – add a new **Student Management** tab containing three components:
  1. `StudentForm` – fields: Name, Token (auto‑generated unless overridden), Class (6‑9), Section (dropdown), Assigned Grade, Codex Points.
  2. `AttendanceLogEditor` – date picker + list of students with present toggle. Calls `upsert_attendance` RPC which stores data in the `attendance` table.
  3. `CodexPointsEditor` – shows a table of students with "+" / "‑" buttons to adjust points; calls `adjust_codex_points` RPC.
- **Export Attendance** button in Admin Dashboard that triggers `exportAttendance()` – fetches attendance data via RPC `fetch_attendance_by_range(startDate, endDate)` and builds an .xlsx file using the `xlsx` library.
- Update `CampContext.tsx` with async helpers: `addOrUpdateStudent`, `markAttendance`, `adjustCodexPoints`, `exportAttendance`.

### Backend (Supabase via MCP `execute_sql`)
1. **students** table (if not existing):
```sql
create table if not exists students (
  id uuid primary key default uuid_generate_v4(),
  token text unique,
  student_name text,
  class text,
  section text,
  assigned_grade text,
  codex_points integer default 0
);
```
2. **attendance** table:
```sql
create table if not exists attendance (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references students(id),
  date date,
  status boolean,
  unique(student_id, date)
);
```
3. **RPCs**
   - `upsert_student(token text, name text, class text, section text, grade text, points int)` – INSERT … ON CONFLICT(token) DO UPDATE.
   - `generate_token_batch(start_int int, count int)` – returns an array of newly generated numeric tokens (e.g., `start_int+1` … `start_int+count`).
   - `upsert_attendance(student_token text, date date, present boolean)` – resolves `student_id` then INSERT/UPDATE into `attendance`.
   - `adjust_codex_points(student_token text, delta int)` – UPDATE students SET codex_points = codex_points + delta WHERE token = student_token.
   - `fetch_attendance_by_range(start_date date, end_date date)` – returns rows with student name, token, date, status.
   - `fetch_all_students()` – for dropdowns.
4. **Initial token import** – run a script that upserts the 100 tokens from `students_login_codes.csv` (already done) and sets `assigned_grade` to `Class 6` for all.

### Data Flow
- When a new student is added via the form, if the token field is empty the frontend calls `generate_token_batch(1,1)` to get a fresh token, then calls `upsert_student`.
- Attendance toggles call `upsert_attendance` which writes directly to the DB, guaranteeing persistence across reloads.
- Codex point adjustments call `adjust_codex_points` with `+1` or `‑1`.
- Export button fetches data for the range `[today, today + N]` (N = number of days you want) and builds the workbook.

## Verification Plan
1. Run the SQL migrations via Supabase MCP (`execute_sql`).
2. `npm run dev` – confirm UI shows new dropdowns, Student Management tab, and Export button.
3. Add a new student without specifying a token → verify a new token appears in the DB.
4. Mark attendance for a student → refresh page → confirm status persists.
5. Adjust Codex points → verify the displayed total updates and DB reflects the change.
6. Click Export → download `attendance.xlsx` and open it – each sheet should correspond to a date with rows for every student showing Present/Absent.
7. Check that attendance records are only created for dates >= today (no historic rows).

---
**Next Steps**
- Await user confirmation on the open questions and overall plan before executing migrations and code changes.
