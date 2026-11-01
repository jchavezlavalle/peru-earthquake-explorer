
import json
import requests
import boto3

from datetime import datetime, timedelta, timezone
from pathlib import Path


# USGS Earthquake Catalog
API_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query"

# Peru and surrounding offshore seismic zone
PARAMS = {
    "format": "geojson",
    "starttime": (
        datetime.now(timezone.utc) - timedelta(days=365)
    ).strftime("%Y-%m-%d"),
    "endtime": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
    "minlatitude": -18.5,
    "maxlatitude": 0.5,
    "minlongitude": -81.5,
    "maxlongitude": -68.0,
    "minmagnitude": 2.5,
    "orderby": "time",
    "limit": 20000
}

OUTPUT = Path(
    "frontend/public/data/earthquakes-peru.geojson"
)

BUCKET_NAME = "peru-seismic-monitor-unique-suffix"
S3_KEY = "data/earthquakes-peru.geojson"

s3 = boto3.client("s3", region_name="us-east-1")

def fetch_earthquakes():
    print("Fetching earthquake data from USGS...")

    response = requests.get(
        API_URL,
        params=PARAMS,
        timeout=60
    )

    response.raise_for_status()

    data = response.json()

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False)

    print(f"Total earthquakes: {len(data['features'])}")
    print(f"Dataset saved to: {OUTPUT}")

    print("Uploading earthquake data to S3...")

    s3.upload_file(
        str(OUTPUT),
        BUCKET_NAME,
        S3_KEY,
        ExtraArgs={
            "ContentType": "application/geo+json"
        }
    )

    print("Successfully uploaded earthquake data to S3!")

if __name__ == "__main__":
    fetch_earthquakes()
