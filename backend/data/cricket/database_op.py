import json
import os
from pymongo import MongoClient

if os.getenv("RENDER_STATUS") != "TRUE":
    from dotenv import load_dotenv
    load_dotenv()

connection_string = os.getenv('MONGODB_URI')

client = MongoClient(connection_string)
db = client['franchise_leagues']

matches_collection = db['matches']

result = matches_collection.update_many(
    {"Location": "Oakland Coliseum, Oakland"},
    {"$set": {"Location": "Oakland Coliseum"}})

print(f"# Matches Updated: {result.modified_count}")

client.close()