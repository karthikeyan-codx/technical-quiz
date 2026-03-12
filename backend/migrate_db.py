import os
import sys

# Add current directory to path
sys.path.append(os.getcwd())

from app import database, models
from sqlalchemy import text

def reset_database():
    engine = database.engine
    with engine.connect() as conn:
        try:
            # We need to drop players and answers because answers depends on players
            conn.execute(text("DROP TABLE IF EXISTS answers"))
            conn.execute(text("DROP TABLE IF EXISTS players"))
            conn.commit()
            print("Dropped old tables.")
        except Exception as e:
            print(f"Error dropping tables: {e}")

    # Recreate all tables (this will skip existing ones like rooms/questions)
    models.Base.metadata.create_all(bind=engine)
    print("Database tables recreated successfully with 'college_name'.")

if __name__ == "__main__":
    reset_database()
