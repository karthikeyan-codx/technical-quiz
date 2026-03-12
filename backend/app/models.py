from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from .database import Base

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    room_code = Column(String, unique=True, index=True)
    quiz_started = Column(Boolean, default=False)
    admin_id = Column(String)  # Simple admin session ID or password hash

class Player(Base):
    __tablename__ = "players"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    college_name = Column(String)
    room_code = Column(String, ForeignKey("rooms.room_code"))
    approved = Column(Boolean, default=False)
    score = Column(Integer, default=0)
    time_taken = Column(Float, default=0.0)
    status = Column(String, default="Waiting") # Waiting, Active, Eliminated, Finished

    room = relationship("Room")

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String) # Image, Theory, Code
    question = Column(Text)
    image1 = Column(String, nullable=True)
    image2 = Column(String, nullable=True)
    image3 = Column(String, nullable=True)
    option1 = Column(String)
    option2 = Column(String)
    option3 = Column(String)
    option4 = Column(String)
    option5 = Column(String)
    correct_answer = Column(String)

class Answer(Base):
    __tablename__ = "answers"
    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey("players.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    selected_option = Column(String)
    time_taken = Column(Float)
