# Attendance Management Portal

Full-stack CRUD app for the Database 2 Lab finals.
Frontend: HTML/CSS/JS (`public/`). Backend: Vercel Serverless Functions (`api/`). Database: MongoDB Atlas (`LabAttendanceDB`).

## API
| Method | Route | Purpose |
|---|---|---|
| GET | /api/records | Read all records |
| POST | /api/records | Create a record |
| PUT | /api/records/:id | Update a record |
| DELETE | /api/records/:id | Delete a record |

Record shape: `{ subject_name, section, student_name, attendance_dates: ["YYYY-MM-DD", ...] }`

## Environment variables (set in Vercel, never in code)
`MONGODB_URI`, `MONGODB_DB` (default LabAttendanceDB_PALER), `MONGODB_COLLECTION` (default LabAttendanceDB)
