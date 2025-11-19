# Contractor Estimator (starter)

This repository is a starter contractor estimator application with:

- Backend: Node.js + Express + SQLite (better-sqlite3)
- Frontend: React (Vite friendly structure)
- Seeded template for 12" pier foundation (items in DB)
- Backup script to upload the SQLite DB to Google Drive (backend/backup_to_gdrive.py)
- User Manual PDF in `docs/User_Manual.pdf`

## Quick start (local)

1. Backend
   - `cd backend`
   - `npm install`
   - `node server.js`
   - Backend will run on `http://localhost:4000`

2. Frontend
   - `cd frontend`
   - `npm install`
   - `npm run dev` (or use `vite` to serve)

## Google Drive backup
See `backend/backup_to_gdrive.py`. You need to create OAuth credentials in Google Cloud Console,
download `credentials.json` into the `backend/` folder and install dependencies:

```
pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib
python backup_to_gdrive.py
```

Alternative: create a Service Account for server-to-server backups and share a Drive folder with it.

## Notes & next steps
- This is a starter app designed to be extended. It includes seeds for Materials, Labor, and Rental Tools.
- You can migrate to Postgres by replacing DB layer with `pg` and updating schema if you want cloud deployment.
- For production, add HTTPS, JWT auth, rate-limiting, and secure storage for credentials.

