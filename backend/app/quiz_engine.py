from sqlalchemy.orm import Session
from . import models
import random

def get_randomized_questions(db: Session):
    # Fetch 20 of each type
    image_qs = db.query(models.Question).filter(models.Question.type == "Image").all()
    theory_qs = db.query(models.Question).filter(models.Question.type == "Theory").all()
    code_qs = db.query(models.Question).filter(models.Question.type == "Code").all()
    
    # Shuffle and pick 20
    random.shuffle(image_qs)
    random.shuffle(theory_qs)
    random.shuffle(code_qs)
    
    selected_qs = image_qs[:20] + theory_qs[:20] + code_qs[:20]
    
    # Randomize the options for each question
    for q in selected_qs:
        options = [q.option1, q.option2, q.option3, q.option4, q.option5]
        # Keep track of where the correct answer goes if needed, 
        # but here we just send them and let the frontend handle the choice.
        # Actually, it's safer to identify the correct answer by text.
        random.shuffle(options)
        q.shuffled_options = options
        
    return selected_qs

def calculate_score(db: Session, player_id: int):
    answers = db.query(models.Answer).filter(models.Answer.player_id == player_id).all()
    score = 0
    total_time = 0.0
    
    for ans in answers:
        question = db.query(models.Question).filter(models.Question.id == ans.question_id).first()
        if question and ans.selected_option == question.correct_answer:
            score += 1
        total_time += ans.time_taken
        
    player = db.query(models.Player).filter(models.Player.id == player_id).first()
    if player:
        player.score = score
        player.time_taken = total_time
        player.status = "Finished"
        db.commit()
        
    return score, total_time
