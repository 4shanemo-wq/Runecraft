import asyncio
from datetime import datetime, timedelta
from typing import Dict, List

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from TikTokLive import TikTokLiveClient

app = FastAPI()

# For a production site, replace '*' with the specific domains that should be allowed.
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET"],
    allow_headers=["*"],
)

CACHE_TTL_SECONDS = 60
live_cache: Dict[str, Dict[str, object]] = {}


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
