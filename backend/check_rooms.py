import os
import sys

# Add the current directory to sys.path so we can import from app
sys.path.append(os.getcwd())

from app import models, database

def check_rooms():
    db = database.SessionLocal()
    try:
        rooms = db.query(models.Room).all()
        if not rooms:
            print("No active rooms found.")
        for r in rooms:
            print(f"Room Code: {r.room_code}")
    finally:
        db.close()

if __name__ == "__main__":
    check_rooms()
