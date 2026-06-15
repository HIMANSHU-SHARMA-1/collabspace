# 🏗️ CollabSpace Backend Architecture

## Overview

CollabSpace follows a layered backend architecture based on the MERN stack.

The backend is responsible for:

* User Authentication
* Project Management
* Team Formation
* Join Request Processing
* Real-Time Communication
* Notifications
* AI-Powered Recommendations

---

# Architecture Flow

```text
Client (React Frontend)
            │
            ▼
         Routes
            │
            ▼
      Controllers
            │
            ▼
        Services
            │
            ▼
         Models
            │
            ▼
        MongoDB
```

---

# Request Lifecycle

Example:

```http
POST /api/joinRequest/approve/:id
```

Flow:

```text
Frontend
    │
    ▼
joinRequestRoutes.js
    │
    ▼
approveRequest()
    │
    ▼
Request Model
    │
    ▼
Project Model
    │
    ▼
Notification Model
    │
    ▼
Response Sent
```

---

# Authentication Flow

```text
Register User
     │
     ▼
Hash Password (bcrypt)
     │
     ▼
Store User
```

```text
Login User
     │
     ▼
Compare Password
     │
     ▼
Generate JWT
     │
     ▼
Return Token
```

```text
Protected Route
     │
     ▼
Auth Middleware
     │
     ▼
Verify JWT
     │
     ▼
Attach User To Request
     │
     ▼
Controller Access
```

---

# Project Management Flow

```text
Create Project
      │
      ▼
Project Controller
      │
      ▼
Project Model
      │
      ▼
MongoDB
```

---

# Join Request Flow

```text
User Sends Request
         │
         ▼
Request Stored
         │
         ▼
Leader Views Requests
         │
         ▼
Approve / Reject
         │
         ▼
Update Request Status
         │
         ▼
Create Notification
         │
         ▼
Response Returned
```

---

# Notification Flow

```text
Join Request Processed
          │
          ▼
Notification Created
          │
          ▼
Stored In MongoDB
          │
          ▼
User Fetches Notifications
          │
          ▼
Mark As Read
```

---

# Real-Time Chat Flow

```text
User Joins Project Room
          │
          ▼
Socket.io Connection
          │
          ▼
Join Project Room
          │
          ▼
Send Message
          │
          ▼
Store Message
          │
          ▼
Broadcast Message
          │
          ▼
All Room Members Receive Message
```

---

# AI Recommendation Flow

```text
Authenticated User
          │
          ▼
Fetch User Skills
          │
          ▼
Fetch Available Projects
          │
          ▼
Generate Prompt
          │
          ▼
Gemini Service
          │
          ▼
AI Recommendation Response
          │
          ▼
JSON Parsing
          │
          ▼
Frontend Response
```

---

# Folder Structure

```text
server/
│
├── config/
│
├── controllers/
│   ├── authController.js
│   ├── projectController.js
│   ├── joinRequestController.js
│   ├── notificationController.js
│   ├── messageController.js
│   └── aiController.js
│
├── middleware/
│   └── auth.js
│
├── models/
│   ├── User.js
│   ├── Project.js
│   ├── Request.js
│   ├── Message.js
│   └── Notification.js
│
├── routes/
│
├── services/
│   ├── aiServices.js
│   └── geminiService.js
│
├── index.js
│
└── package.json
```

---

# Design Principles

* RESTful API Design
* JWT Authentication
* Modular Controllers
* Separation of Concerns
* Service Layer Pattern
* Real-Time Communication
* AI Integration Layer
* MongoDB Document Modeling

```
```
