import asyncio
import os
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


def normalize_handle(handle: str) -> str:
    return handle.strip().lstrip("@").lower()

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

@app.post("/submit-application")
async def submit_application(app: Application, request: Request):
    client_ip = request.client.host
    if is_rate_limited(client_ip):
        raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")

    # Here you would save to database or send email
    # For now, just log it
    print(f"New application: {app.name}, {app.email}, {app.tiktok}, {app.message}")
    return {"message": "Application submitted successfully!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
