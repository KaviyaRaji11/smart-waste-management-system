# Smart Waste Management System

A web-based Smart Waste Management System for real-time waste overflow reporting and optimized collection routing.

## Project Overview

The Smart Waste Management System allows citizens to report overflowing waste bins using photos and location details. Administrators can manage and prioritize reports, assign tasks to staff, and monitor the collection process.

The system also provides route optimization to help collection staff plan an efficient route between reported waste locations.

## Problem Statement

Traditional waste collection systems often depend on fixed schedules and manual inspection. This can result in delayed responses to overflowing waste bins and inefficient collection routes.

There is a need for a system that can:

- Receive waste overflow reports in real time
- Prioritize urgent reports
- Assign reports to collection staff
- Track report status
- Optimize collection routes

## Solution

Our system connects citizens, administrators, and collection staff through a single platform.

Citizens can submit reports with:

- Waste overflow photo
- Description
- Address
- Area
- City
- Landmark
- Latitude and Longitude

Administrators can review reports, update priority, assign tasks, and monitor the collection process.

Staff can view assigned tasks and update their work status.

## Key Features

- Citizen waste overflow reporting
- Photo upload with reports
- GPS-based location information
- Automatic priority scoring
- Report status management
- Admin and staff task assignment
- Staff task tracking
- Route optimization
- Map-based location visualization
- Role-Based Access Control
- Analytics and reporting

## Smart Priority Engine

The system uses a priority scoring mechanism to help identify reports that require faster attention.

Reports can be classified into:

- Low
- Medium
- High

The priority score helps administrators identify and manage urgent waste collection requests.

## Route Optimization

The Route Optimization module helps collection staff determine an efficient order for visiting multiple waste locations.

The system uses:

- Nearest Neighbor heuristic
- Haversine distance calculation

This helps reduce unnecessary travel between collection locations.

## User Roles

### Citizen

- Submit waste overflow reports
- Upload photos
- Provide location details
- View submitted reports
- Cancel eligible pending reports

### Admin

- View all reports
- Manage report status
- Manage priority
- Assign collection tasks
- Monitor system activities

### Staff

- View assigned tasks
- Track collection work
- Update task/report status
- Follow optimized collection routes

## Technology Stack

### Frontend

- React.js
- JavaScript
- Axios
- Leaflet
- Recharts

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JWT
- Role-Based Access Control (RBAC)

### Other Technologies

- Multer for image uploads
- OpenStreetMap / Nominatim for location lookup
- Nearest Neighbor algorithm
- Haversine distance calculation

## System Workflow

Citizen
   ↓
Submit Waste Report
   ↓
Photo + Location + Description
   ↓
Priority Calculation
   ↓
Admin Verification
   ↓
Staff Assignment
   ↓
Route Optimization
   ↓
Waste Collection
   ↓
Status Update
   ↓
Completed
Installation
1. Clone the Repository
git clone https://github.com/KaviyaRaji11/smart-waste-management-system.git
cd smart-waste-management-system
2. Install Backend Dependencies
cd backend
npm install
3. Install Frontend Dependencies
cd ../frontend
npm install
4. Configure Environment Variables

Create a .env file in the backend folder and configure the required environment variables.

5. Start Backend
cd backend
npm start
6. Start Frontend
cd frontend
npm run dev
Future Scope
IoT-based smart bin monitoring
Real-time bin fill-level detection
Advanced route optimization
Mobile application
Push notifications
Predictive waste collection analytics
Integration with smart city infrastructure