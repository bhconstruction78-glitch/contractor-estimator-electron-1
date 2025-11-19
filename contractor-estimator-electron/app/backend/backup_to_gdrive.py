"""Simple backup script to upload the SQLite DB file to Google Drive.
This script uses googleapiclient and oauth2client libraries. It won't run until you
configure OAuth2 credentials in Google Cloud Console and install dependencies:

pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib

1) Create OAuth credentials (Desktop app) and download credentials.json into backend/.
2) Run this script: python backup_to_gdrive.py
3) On first run a browser window will open to authorize. Tokens are saved to token.json.

Note: For server-to-server backups use a Service Account and set up a Drive folder share.
"""
import os
from pathlib import Path

try:
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaFileUpload
except Exception as e:
    print('Missing Google libraries. Install with pip: google-api-python-client google-auth-httplib2 google-auth-oauthlib')
    raise SystemExit(1)

SCOPES = ['https://www.googleapis.com/auth/drive.file']
BASE = Path(__file__).parent
DB_PATH = BASE / 'db' / 'estimator.db'
CREDS_FILE = BASE / 'credentials.json'
TOKEN_FILE = BASE / 'token.json'

def get_service():
    creds = None
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
    if not creds or not creds.valid:
        flow = InstalledAppFlow.from_client_secrets_file(str(CREDS_FILE), SCOPES)
        creds = flow.run_local_server(port=0)
        with open(TOKEN_FILE, 'w') as f:
            f.write(creds.to_json())
    service = build('drive', 'v3', credentials=creds)
    return service

def upload_backup():
    if not DB_PATH.exists():
        print('DB not found at', DB_PATH)
        return
    service = get_service()
    file_metadata = {'name': 'estimator_backup.db'}
    media = MediaFileUpload(str(DB_PATH), mimetype='application/x-sqlite3')
    file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    print('Uploaded backup file id:', file.get('id'))

if __name__ == '__main__':
    upload_backup()
