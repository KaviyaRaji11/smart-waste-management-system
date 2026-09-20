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
## 🚀 Live Demo

**Live Application:**  
https://smart-waste-management-system-jazoprur0-kaviya-raji-s-projects.vercel.app

## 🔐 Demo Credentials

Use the following accounts to explore the different role-based features.

| Role | Email | Password |
|------|-------|----------|
| Citizen | demo.citizen@swm-demo.com | 12345678 |
| Staff | demo.staff@swm-demo.com | 12345678 |
| Admin | admin@smartwaste.com | Admin@12345 |

> These accounts are provided specifically for hackathon demonstration purposes.

## 🧪 Recommended Demo Workflow

### 1. Citizen
Login as **Citizen** and:
- Create a waste overflow report
- Upload a waste image
- Add location/address details
- View the submitted report in **My Reports**

### 2. Admin
Login as **Admin** and:
- View submitted waste reports
- Verify reports
- Check report priority
- Assign reports to staff
- View reports on the map
- Monitor bins and analytics

### 3. Staff
Login as **Staff** and:
- View assigned waste collection tasks
- Start the assigned task
- Update the task status
- Mark the waste collection as completed

### 4. Citizen — Final Verification
Login again as **Citizen** and:
- Open **My Reports**
- Check the updated report status
- Verify that the completed report is reflected

## 🔄 Report Status Flow

```text
Pending
   ↓
Verified
   ↓
Assigned
   ↓
In Progress
   ↓
Completed

###Installation

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

####Future Scope
IoT-based smart bin monitoring
Real-time bin fill-level detection
Advanced route optimization
Mobile application
Push notifications
Predictive waste collection analytics
Integration with smart city infrastructure