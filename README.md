
# 🇵🇪 Peru Seismic Monitor

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


### Architecture Overview

```text
                 USERS
                   |
                   v
             CLOUDFRONT
                   |
                   v
             AMAZON S3
           (React Frontend)
                   |
                   | API Requests
                   v
             BACKEND API
                   |
                   v
              AWS LAMBDA
                (Python)
                   |
                   v
          EARTHQUAKE DATA SOURCE
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
