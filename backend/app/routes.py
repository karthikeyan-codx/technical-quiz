from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
from sqlalchemy.orm import Session
from . import models, database
from .database import get_db
import pandas as pd
import random
import string
import qrcode
from io import BytesIO
import base64

router = APIRouter(prefix="/api")

def generate_room_code():
    return ''.join(random.choices(string.digits, k=5))

@router.post("/host/login")
async def host_login(request: Request, password: str = Form(...), db: Session = Depends(get_db)):
    print(f"Login attempt with password: {password}") # Debug print
    if password.strip() == "admin@tq2026":
        try:
            # Clear existing rooms to ensure a fresh session
            db.query(models.Room).delete()
            db.commit()
            
            room_code = generate_room_code()
            new_room = models.Room(room_code=room_code, admin_id="session_admin")
            db.add(new_room)
            db.commit()
            db.refresh(new_room)
            
            # Generate QR Code using the actual server IP/hostname
            base_url = str(request.base_url).replace(":8000", ":5173") # Point to frontend port
            join_url = f"{base_url}join?room={room_code}"
            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr.add_data(join_url)
            qr.make(fit=True)
            img = qr.make_image(fill_color="black", back_color="white")
            
            buffered = BytesIO()
            img.save(buffered, format="PNG")
            qr_base64 = base64.b64encode(buffered.getvalue()).decode()
            
            print(f"Room created: {room_code}")
            return {
                "room_code": room_code,
                "qr_code": f"data:image/png;base64,{qr_base64}",
                "join_url": join_url
            }
        except Exception as e:
            print(f"Database error: {e}")
            raise HTTPException(status_code=500, detail="Database engine failure during initialization")
    else:
        print("Invalid password provided")
        raise HTTPException(status_code=401, detail="Unauthorized: Protocol Access Key Mismatch")

@router.post("/join")
async def join_quiz(name: str = Form(...), college_name: str = Form(...), room_code: str = Form(...), db: Session = Depends(get_db)):
    room = db.query(models.Room).filter(models.Room.room_code == room_code).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    new_player = models.Player(
        name=name, 
        college_name=college_name, 
        room_code=room_code,
        status="Waiting"
    )
    db.add(new_player)
    db.commit()
    db.refresh(new_player)
    
    return {"player_id": new_player.id, "name": new_player.name, "room_code": room_code}

@router.post("/admin/upload-questions")
async def upload_questions(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        df = pd.read_excel(file.file)
        # Expected columns: type, question, option1...option5, correct_answer, image1, image2, image3
        for _, row in df.iterrows():
            question = models.Question(
                type=row.get('type'),
                question=row.get('question'),
                option1=str(row.get('option1')),
                option2=str(row.get('option2')),
                option3=str(row.get('option3')),
                option4=str(row.get('option4')),
                option5=str(row.get('option5')),
                correct_answer=str(row.get('correct_answer')),
                image1=row.get('image1') if not pd.isna(row.get('image1')) else None,
                image2=row.get('image2') if not pd.isna(row.get('image2')) else None,
                image3=row.get('image3') if not pd.isna(row.get('image3')) else None
            )
            db.add(question)
        db.commit()
        return {"message": f"Successfully uploaded {len(df)} questions"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/admin/players/{room_code}")
async def get_players(room_code: str, db: Session = Depends(get_db)):
    players = db.query(models.Player).filter(models.Player.room_code == room_code).all()
    return players

@router.post("/admin/approve/{player_id}")
async def approve_player(player_id: int, db: Session = Depends(get_db)):
    player = db.query(models.Player).filter(models.Player.id == player_id).first()
    if player:
        player.approved = True
        db.commit()
        return {"message": "Player approved"}
    raise HTTPException(status_code=404, detail="Player not found")

@router.post("/admin/eliminate/{player_id}")
async def eliminate_player(player_id: int, reason: dict = None, db: Session = Depends(get_db)):
    player = db.query(models.Player).filter(models.Player.id == player_id).first()
    if player:
        player.status = "Eliminated"
        db.commit()
        return {"message": "Player eliminated"}
    raise HTTPException(status_code=404, detail="Player not found")

@router.get("/admin/leaderboard/{room_code}")
async def get_leaderboard(room_code: str, db: Session = Depends(get_db)):
    players = db.query(models.Player)\
        .filter(models.Player.room_code == room_code)\
        .order_by(models.Player.score.desc(), models.Player.time_taken.asc())\
        .all()
    return players

@router.get("/quiz/questions/{room_code}")
async def get_quiz_questions(room_code: str, db: Session = Depends(get_db)):
    # In a real app, you might want to ensure the room exists and quiz is started
    # We'll fetch 20 of each type
    img_qs = db.query(models.Question).filter(models.Question.type == "Image").all()
    theory_qs = db.query(models.Question).filter(models.Question.type == "Theory").all()
    code_qs = db.query(models.Question).filter(models.Question.type == "Code").all()
    
    random.shuffle(img_qs)
    random.shuffle(theory_qs)
    random.shuffle(code_qs)
    
    selected = img_qs[:20] + theory_qs[:20] + code_qs[:20]
    
    # Structure for frontend
    questions = []
    for q in selected:
        questions.append({
            "id": q.id,
            "type": q.type,
            "question": q.question,
            "options": [q.option1, q.option2, q.option3, q.option4, q.option5],
            "correct": q.correct_answer,
            "images": [q.image1, q.image2, q.image3] if q.type == "Image" else []
        })
    return questions

@router.post("/quiz/submit")
async def submit_quiz(
    player_id: int = Form(...), 
    score: int = Form(...), 
    time_taken: float = Form(...), 
    db: Session = Depends(get_db)
):
    player = db.query(models.Player).filter(models.Player.id == player_id).first()
    if player:
        player.score = score
        player.time_taken = time_taken
        player.status = "Finished"
        db.commit()
        return {"message": "Results submitted"}
    raise HTTPException(status_code=404, detail="Player not found")
