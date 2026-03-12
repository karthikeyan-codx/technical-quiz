from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
from typing import List, Dict

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, room_code: str, websocket: WebSocket):
        await websocket.accept()
        if room_code not in self.active_connections:
            self.active_connections[room_code] = []
        self.active_connections[room_code].append(websocket)

    def disconnect(self, room_code: str, websocket: WebSocket):
        if room_code in self.active_connections:
            self.active_connections[room_code].remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, room_code: str, message: dict):
        if room_code in self.active_connections:
            for connection in self.active_connections[room_code]:
                await connection.send_json(message)

manager = ConnectionManager()

@router.websocket("/ws/{room_code}")
async def websocket_endpoint(websocket: WebSocket, room_code: str):
    await manager.connect(room_code, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle admin commands
            if message.get("type") == "START_QUIZ":
                await manager.broadcast(room_code, {"type": "QUIZ_STARTED"})
            elif message.get("type") == "PAUSE_QUIZ":
                await manager.broadcast(room_code, {"type": "QUIZ_PAUSED"})
            elif message.get("type") == "RESUME_QUIZ":
                await manager.broadcast(room_code, {"type": "QUIZ_RESUMED"})
            elif message.get("type") == "NEXT_QUESTION":
                await manager.broadcast(room_code, {
                    "type": "NEW_QUESTION", 
                    "question_index": message.get("index")
                })
            elif message.get("type") == "PLAYER_JOINED":
                await manager.broadcast(room_code, {"type": "REFRESH_PLAYERS"})
            elif message.get("type") == "ELIMINATE_PLAYER":
                await manager.broadcast(room_code, {
                    "type": "PLAYER_ELIMINATED", 
                    "player_id": message.get("player_id"),
                    "reason": message.get("reason")
                })

    except WebSocketDisconnect:
        manager.disconnect(room_code, websocket)
