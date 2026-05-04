import asyncio
import json
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List
from pydantic import BaseModel

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from TikTokLive import TikTokLiveClient

app = FastAPI()

# Initialize the database
init_db()

# For a production site, replace '*' with the specific domains that should be allowed.
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

CACHE_TTL_SECONDS = 60
live_cache: Dict[str, Dict[str, object]] = {}

# Simple rate limiting
rate_limit: Dict[str, List[datetime]] = {}
RATE_LIMIT_REQUESTS = 10
RATE_LIMIT_WINDOW = 60  # seconds

def is_rate_limited(client_ip: str) -> bool:
    now = datetime.utcnow()
    if client_ip not in rate_limit:
        rate_limit[client_ip] = []
    # Remove old requests
    rate_limit[client_ip] = [t for t in rate_limit[client_ip] if (now - t).seconds < RATE_LIMIT_WINDOW]
    if len(rate_limit[client_ip]) >= RATE_LIMIT_REQUESTS:
        return True
    rate_limit[client_ip].append(now)
    return False

class Application(BaseModel):
    name: str
    email: str
    tiktok: str
    message: str

class CreatorHeartRequest(BaseModel):
    creatorName: str
    weekNumber: int


def normalize_handle(handle: str) -> str:
    return handle.strip().lstrip("@").lower()

HEART_COUNTS_DB = Path(__file__).parent / "creator_heart_counts.db"

def init_db():
    conn = sqlite3.connect(HEART_COUNTS_DB)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS heart_counts (
            key TEXT PRIMARY KEY,
            count INTEGER NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

async def fetch_live_status(handle: str) -> bool:
    client = TikTokLiveClient(unique_id=handle)
    return await client.is_live()


@app.get("/api/tiktok-live-status")
async def tiktok_live_status(user: List[str] = Query(..., description="TikTok usernames without @")):
    handles = [normalize_handle(u) for u in user if u]
    if not handles:
        raise HTTPException(status_code=400, detail="At least one TikTok username must be provided.")

    statuses = {}
    pending_handles: List[str] = []
    pending_tasks = []

    for handle in handles:
        cached = live_cache.get(handle)
        if cached and cached["expires_at"] > datetime.utcnow():
            statuses[handle] = cached["live"]
        else:
            pending_handles.append(handle)
            pending_tasks.append(fetch_live_status(handle))

    if pending_tasks:
        results = await asyncio.gather(*pending_tasks, return_exceptions=True)
        for handle, result in zip(pending_handles, results):
            live = False
            if isinstance(result, Exception):
                live = False
            else:
                live = bool(result)
            statuses[handle] = live
            live_cache[handle] = {
                "live": live,
                "expires_at": datetime.utcnow() + timedelta(seconds=CACHE_TTL_SECONDS),
            }

    return {"results": [{"user": handle, "live": statuses.get(handle, False)} for handle in handles]}

def load_heart_counts() -> Dict[str, int]:
    init_db()
    conn = sqlite3.connect(HEART_COUNTS_DB)
    cursor = conn.cursor()
    cursor.execute('SELECT key, count FROM heart_counts')
    rows = cursor.fetchall()
    conn.close()
    return {row[0]: row[1] for row in rows}

def save_heart_counts(counts: Dict[str, int]) -> None:
    init_db()
    conn = sqlite3.connect(HEART_COUNTS_DB)
    cursor = conn.cursor()
    for key, count in counts.items():
        cursor.execute('INSERT OR REPLACE INTO heart_counts (key, count) VALUES (?, ?)', (key, count))
    conn.commit()
    conn.close()

@app.get("/api/creator-hearts")
async def get_creator_hearts(creatorName: str = Query(...), weekNumber: int = Query(...)):
    if not creatorName:
        raise HTTPException(status_code=400, detail="creatorName is required.")

    counts = load_heart_counts()
    key = f"{normalize_handle(creatorName)}::{weekNumber}"
    return {"count": counts.get(key, 0)}

@app.post("/api/creator-hearts")
async def post_creator_hearts(payload: CreatorHeartRequest, request: Request):
    if not payload.creatorName:
        raise HTTPException(status_code=400, detail="creatorName is required.")

    if is_rate_limited(request.client.host):
        raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")

    counts = load_heart_counts()
    key = f"{normalize_handle(payload.creatorName)}::{payload.weekNumber}"
    counts[key] = counts.get(key, 0) + 1
    save_heart_counts(counts)
    return {"count": counts[key]}

@app.post("/submit-application")
async def submit_application(app: Application, request: Request):
    client_ip = request.client.host
    if is_rate_limited(client_ip):
        raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")

    # Here you would save to database or send email
    # For now, just log it
    print(f"New application: {app.name}, {app.email}, {app.tiktok}, {app.message}")
    return {"message": "Application submitted successfully!"}
