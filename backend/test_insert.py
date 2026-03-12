from app import database, models
from sqlalchemy.orm import Session

# Create tables
models.Base.metadata.create_all(bind=database.engine)

db = database.SessionLocal()
try:
    q = models.Question(
        type='Image',
        question='Test Question',
        option1='A', option2='B', option3='C', option4='D', option5='E',
        correct_answer='A'
    )
    db.add(q)
    db.commit()
    print("Manual insert success!")
except Exception as e:
    print(f"Manual insert failed: {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()
