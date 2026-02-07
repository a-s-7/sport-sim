import json
import os
from pymongo import MongoClient
from pymongo.errors import BulkWriteError

def main():
    if os.getenv("RENDER_STATUS") != "TRUE":
        from dotenv import load_dotenv
        load_dotenv()

    connection_string = os.getenv('MONGODB_URI')

    if not connection_string:
        raise ValueError("MONGODB_URI not found in environment variables")

    client = MongoClient(connection_string)
    db = client['events']

    venues_collection = db['venues']
    venues_collection.create_index("stadium", unique=True)

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    file_path = os.path.join(base_dir, "sources", "events", "venues.json")

    with open(file_path, 'r') as file:
        json_info = json.load(file)

    try:
        result = venues_collection.insert_many(json_info["venues"], ordered=False)
        print("Inserted venues IDs:", result.inserted_ids)
    except BulkWriteError as e:
        write_errors = e.details.get('writeErrors', [])

        failed_stadiums = []

        for err in write_errors:
            venue = json_info["venues"][err['index']]
            failed_stadiums.append(venue['stadium'])

        inserted_count = len(json_info["venues"]) - len(failed_stadiums)
        print(f"Inserted {inserted_count} venues")
        print("Skipped duplicates:", failed_stadiums)

if __name__ == "__main__":
    main()