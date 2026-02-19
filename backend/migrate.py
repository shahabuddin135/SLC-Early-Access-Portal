"""Run once to create any missing tables (keys, download_tokens, etc.)"""
import asyncio
from app.core.database import create_db_and_tables

asyncio.run(create_db_and_tables())
print("Migration complete.")
