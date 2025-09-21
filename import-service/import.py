import os
import datetime
from typing import List, Dict
from google.oauth2 import service_account
from googleapiclient.discovery import build
import glob
from ics import Calendar

# Google Calendar imports

# Apple Calendar imports (using ics files)

class CalendarImporter:
    def __init__(self, google_credentials_json: str, apple_ics_folder: str):
        self.google_credentials_json = google_credentials_json
        self.apple_ics_folder = apple_ics_folder

    def import_google_calendar(self, calendar_id: str) -> List[Dict]:
        creds = service_account.Credentials.from_service_account_file(
            self.google_credentials_json,
            scopes=['https://www.googleapis.com/auth/calendar.readonly']
        )
        service = build('calendar', 'v3', credentials=creds)
        now = datetime.datetime.now(datetime.timezone.utc).isoformat() + 'Z'
        events_result = service.events().list(
            calendarId=calendar_id, timeMin=now,
            maxResults=100, singleEvents=True,
            orderBy='startTime').execute()
        events = events_result.get('items', [])
        return events

    def import_apple_calendar(self) -> List[Dict]:
        events = []
        for ics_file in glob.glob(os.path.join(self.apple_ics_folder, '*.ics')):
            with open(ics_file, 'r') as f:
                c = Calendar(f.read())
                for event in c.events:
                    events.append({
                        'name': event.name,
                        'begin': event.begin,
                        'end': event.end,
                        'description': event.description
                    })
        return events

if __name__ == "__main__":
    pass
# Example usage:
    importer = CalendarImporter('path/to/google-credentials.json', '/path/to/apple/ics/')
    google_events = importer.import_google_calendar('primary')
    apple_events = importer.import_apple_calendar()