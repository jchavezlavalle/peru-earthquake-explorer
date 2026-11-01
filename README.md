
# 🇵🇪 Peru Earthquake Monitor

A web application designed to monitor and visualize the latest earthquakes in Peru, providing users with accessible and up-to-date seismic information through an intuitive interface.

## 🌎 About the Project

Peru is located in the Pacific Ring of Fire, making it one of the countries with significant seismic activity. Access to timely earthquake information is essential for keeping people informed and raising awareness about seismic events.

**Peru Earthquake Monitor** aims to make earthquake information more accessible by providing a centralized platform where users can check the latest seismic events in Peru.

The application combines a modern web interface with a Python-powered backend deployed on AWS, allowing users to access earthquake information through a publicly available website.

## ✨ Features

- **Latest Earthquakes:** Access information about recent earthquakes recorded in Peru.
- **Earthquake Data Integration:** Retrieve earthquake information through the backend API.
- **Interactive Interface:** Explore seismic information through a user-friendly web application.
- **Cloud Deployment:** Publicly accessible frontend hosted on AWS.

## 🏗️ Architecture

The project uses a frontend-backend architecture deployed on Amazon Web Services.

### Frontend
- React
- TypeScript
- Vite

### Backend
- Python
- AWS Lambda

### Cloud Infrastructure
- **Amazon S3:** Stores the built frontend application.
- **Amazon CloudFront:** Distributes the frontend through a public HTTPS endpoint.
- **AWS Lambda:** Executes the Python backend logic.


### 🔐 AWS Security and IAM

AWS Identity and Access Management (IAM) was used to configure access permissions and security policies for the project's cloud infrastructure.

- **IAM Policies:** Defined permissions to control access to AWS resources and services.
- **Service Permissions:** Configured the necessary permissions for services such as Amazon S3, CloudFront, and AWS Lambda to interact securely.
- **Access Control:** Followed the principle of least privilege by granting only the permissions required for each service to operate.

These configurations help maintain a secure and controlled cloud environment while allowing the application components to communicate properly.


## 🌎 Data Collection and Processing

One of the core components of Peru Earthquake Monitor is its automated earthquake data collection pipeline.

The application retrieves seismic event information from the **United States Geological Survey (USGS) Earthquake Catalog API**, using its FDSN Event Web Service.

### 📡 Data Source

The project uses the USGS Earthquake Catalog API:

https://earthquake.usgs.gov/fdsnws/event/1/query

This API provides earthquake information in GeoJSON format, allowing the application to retrieve structured seismic event data, including geographical coordinates, magnitude, depth, and event timestamps.

### 🔎 Geographic and Temporal Filtering

To focus specifically on seismic activity in Peru, the backend applies geographical boundaries to the API request.

The configured geographic bounding box is:

| Parameter | Value |
|---|---|
| Minimum Latitude | -18.5° |
| Maximum Latitude | 0.5° |
| Minimum Longitude | -81.5° |
| Maximum Longitude | -68.0° |

Additional filtering parameters include:

- **Time range:** Earthquakes recorded during the previous 365 days.
- **Minimum magnitude:** 2.5.
- **Maximum results:** 20,000 events.
- **Ordering:** Most recent earthquakes first.

This filtering allows the application to retrieve seismic events within the selected geographical area and time range.

### 🔄 Data Processing Pipeline

The Python backend, deployed through AWS Lambda, performs the following operations:

1. **API Request:** Sends an HTTP request to the USGS Earthquake Catalog API with the configured geographic, temporal, and magnitude filters.
2. **Data Retrieval:** Receives earthquake information in GeoJSON format.
3. **Response Validation:** Checks the HTTP response to ensure the request was successful.
4. **Data Serialization:** Converts the retrieved GeoJSON data into JSON for storage.
5. **Cloud Storage:** Uploads the resulting dataset to Amazon S3 using the `boto3` AWS SDK.
6. **Data Availability:** Makes the updated dataset available for the application to retrieve and visualize.

### 🗺️ GeoJSON Data Format

The application uses **GeoJSON**, a standard format for representing geographical data structures.

Each earthquake is represented as a geographic feature containing properties and a geometry object.

The geometry includes coordinates representing:

- Longitude
- Latitude
- Depth (in kilometers)

The associated properties provide additional seismic information, such as magnitude, event time, location description, and other metadata supplied by USGS.

Using GeoJSON makes it possible to integrate earthquake records with geographical visualization tools and interactive maps.

### ☁️ Data Storage

After retrieval and processing, the complete GeoJSON dataset is stored in Amazon S3.

The configured storage location is:

```text
s3://peru-seismic-monitor-unique-suffix/
└── data/
    └── earthquakes-peru.geojson
```

Amazon S3 serves as the centralized storage location for the collected earthquake dataset.

This approach separates data collection from data visualization, allowing the frontend to consume the stored geographical information independently of the Python processing logic.


## ⏰ Automated Data Updates

To ensure that the earthquake dataset remains updated, the project uses **Amazon EventBridge** to automate the execution of the AWS Lambda function.

EventBridge is configured with an hourly schedule, triggering the Python Lambda function once every hour.

### Update Workflow

1. **Scheduled Trigger:** Amazon EventBridge activates the Lambda function every hour.
2. **Data Collection:** Lambda requests the latest available earthquake records from the USGS API.
3. **Data Processing:** The response is validated and serialized into GeoJSON.
4. **Dataset Replacement:** The updated dataset is uploaded to Amazon S3, replacing the previous version of the GeoJSON file.
5. **Updated Data Availability:** The latest stored dataset becomes available for the frontend to retrieve.

This automated process reduces the need for manual data collection and helps keep the application's earthquake information current.

**Note:** The hourly schedule means the application checks for updated data every hour; it does not guarantee that USGS publishes new earthquake records exactly at that frequency.


### 🔁 Continuous Data Synchronization

The application implements an automated data synchronization pipeline using Amazon EventBridge, AWS Lambda, and Amazon S3.

Amazon EventBridge is configured with an hourly schedule that triggers the Python Lambda function automatically.

Every execution performs the following operations:

1. Retrieves the latest available earthquake records from the USGS Earthquake Catalog API.
2. Applies geographical, temporal, and magnitude filters to focus on seismic activity in Peru.
3. Processes the API response and maintains the data in GeoJSON format.
4. Uploads the updated dataset to Amazon S3, replacing the previously stored file.

The dataset is maintained at:

`data/earthquakes-peru.geojson`

This approach ensures that the application always has a periodically refreshed dataset available for geographical visualization.

By separating data ingestion and storage from the frontend, the application creates an independent and automated data pipeline that can be extended or integrated with additional visualization tools in the future.


### Architecture Overview

```text
                    USERS
                      |
                      v
                 CLOUDFRONT
                      |
                      v
              AMAZON S3 BUCKET
               (React Frontend)
                      |
                      | Reads GeoJSON
                      v
              AMAZON S3 BUCKET
             (Earthquake Dataset)
             earthquakes-peru.geojson


       AUTOMATED DATA COLLECTION PIPELINE
       ===================================

               AMAZON EVENTBRIDGE
                  (Every Hour)
                      |
                      v
                 AWS LAMBDA
                   (Python)
                      |
                      | HTTP Request
                      v
             USGS EARTHQUAKE API
                      |
                      | GeoJSON Response
                      v
                 AWS LAMBDA
             (Process and Serialize)
                      |
                      | Upload / Overwrite
                      v
              AMAZON S3 BUCKET
             (Earthquake Dataset)
             earthquakes-peru.geojson
```

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React | Frontend framework |
| TypeScript | Frontend development |
| Vite | Development and build tooling |
| Python | Backend development |
| AWS Lambda | Serverless backend execution |
| Amazon S3 | Frontend hosting and storage |
| Amazon CloudFront | Content delivery and HTTPS |

## 🚀 Running the Frontend Locally

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
```

Navigate to the frontend directory:

```bash
cd YOUR_FRONTEND_DIRECTORY
```

Install dependencies:

```bash
npm install
```

Configure your environment variables in a `.env` file:

```env
VITE_API_URL=YOUR_BACKEND_API_URL
```

Start the development server:

```bash
npm run dev
```

### Production Build

To generate the production-ready frontend:

```bash
npm run build
```

Vite generates the production files inside the `dist/` directory.

## ☁️ Deployment

The frontend is deployed using Amazon S3 and Amazon CloudFront.

1. Build the React application using `npm run build`.
2. Upload the contents of the `dist/` directory to the frontend S3 bucket.
3. CloudFront distributes the application through a public HTTPS endpoint.
4. The frontend communicates with the Python backend through its API endpoint.

## 🎯 Project Goal

Our goal is to make earthquake information in Peru easier to access through a simple, accessible, and cloud-based platform.

By combining modern web technologies and AWS serverless infrastructure, Peru Earthquake Monitor provides a foundation for making seismic information more visible and accessible to the public.

## 👥 Contributors

Developed as part of a hackathon project.

---

**Peru Earthquake Monitor** 🇵🇪

*Making seismic information more accessible.*
