import json
import boto3
import requests

from datetime import datetime, timedelta, timezone

# AWS configuration
BUCKET_NAME = "peru-seismic-monitor-unique-suffix"
S3_KEY = "data/earthquakes-peru.geojson"

s3 = boto3.client("s3")

# USGS Earthquake Catalog
API_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query"

def lambda_handler(event, context):

    print("Fetching earthquake data from USGS...")

    params = {
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

    response = requests.get(
        API_URL,
        params=params,
        timeout=45
    )

    response.raise_for_status()

    data = response.json()

    print(f"Total earthquakes: {len(data['features'])}")

    # Upload GeoJSON directly to S3
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=S3_KEY,
        Body=json.dumps(data, ensure_ascii=False).encode("utf-8"),
        ContentType="application/geo+json"
    )

    print("Successfully uploaded earthquake data to S3!")

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Earthquake data updated successfully",
            "total_earthquakes": len(data["features"])
        })
    }

