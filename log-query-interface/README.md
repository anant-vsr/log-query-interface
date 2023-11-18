Log Query Interface
Overview
The Log Query Interface is a web application that allows users to insert logs and query logs based on various parameters. This README provides information on running the project, the system design, and features implemented.

Table of Contents
Getting Started
System Design
Features Implemented
Getting Started
To run the project locally, follow these steps:

Clone the repository:
bash
Copy code
git clone https://github.com/your-username/log-query-interface.git
Navigate to the project directory:
bash
Copy code
cd log-query-interface
Install dependencies:
bash
Copy code
npm install
Create a .env file in the project root with the following content:
env
Copy code
PORT=3000
MONGODB_URL=<your-mongodb-connection-string>
SECRET=<your-secret-key-for-jwt>
Replace <your-mongodb-connection-string> with your MongoDB connection string and <your-secret-key-for-jwt> with a secret key for JWT.

Run the application:
bash
Copy code
npm start
The application will be accessible at http://localhost:3000.

System Design
The system is designed as a full-stack web application using the MERN (MongoDB, Express.js, React, Node.js) stack. It includes user authentication, log ingestion, and log retrieval functionalities. MongoDB is used as the database to store logs.

Features Implemented
User Authentication:

Users can register with a username, password, and role.
Users can log in with their credentials, and a JWT token is generated for authentication.
Log Ingestion:

Admin users can insert logs with various parameters such as level, message, resourceId, timestamp, traceId, spanId, commit, and parentResourceId.
Log Retrieval:

Users can query logs based on parameters like level, message, resourceId, timestamp range, traceId, spanId, commit, and parentResourceId.
Full-text search functionality is implemented.
Search by Specific Fields:

Users can search logs by specific fields, including message and resourceId.
