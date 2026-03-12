import traceback
from app import database, models
from sqlalchemy.orm import Session

try:
    models.Base.metadata.create_all(bind=database.engine)
    db = database.SessionLocal()
    q = models.Question(
        type='Image',
        question='Test Question',
        option1='A', option2='B', option3='C', option4='D', option5='E',
        correct_answer='A'
    )
    db.add(q)
    db.commit()
    with open('manual_log.txt', 'w') as f:
        f.write("Manual insert success!")
except Exception as e:
    with open('manual_log.txt', 'w') as f:
        f.write(f"Manual insert failed: {e}\n")
        f.write(traceback.format_exc())
finally:
    if 'db' in locals():
        db.close()
