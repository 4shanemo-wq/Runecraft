import asyncio
from TikTokLive import TikTokLiveClient

async def test():
    try:
        client = TikTokLiveClient(unique_id='runecraft.smp')
        result = await client.is_live()
        print(f'Live status for runecraft.smp: {result}')
    except Exception as e:
        print(f'Error: {e}')

if __name__ == "__main__":
    asyncio.run(test())