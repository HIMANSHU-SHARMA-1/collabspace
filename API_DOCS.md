# 📚 CollabSpace API Documentation

## Base URL

```http
http://localhost:5000
```

---

# Authentication APIs

## Register User

```http
POST /api/auth/register
```

### Description

Register a new user account.

### Authentication

Not Required

---

## Login User

```http
POST /api/auth/login
```

### Description

Authenticate user and return JWT token.

### Authentication

Not Required

---

# Project APIs

## Create Project

```http
POST /api/project/create
```

### Description

Create a new project.

### Authentication

Required

---

## Get All Projects

```http
GET /api/project/getAll
```

### Description

Retrieve all projects.

### Authentication

Not Required

---

## Get Project By ID

```http
GET /api/project/by/:id
```

### Description

Retrieve a specific project.

### Authentication

Not Required

---

## Update Project

```http
PUT /api/project/update/:id
```

### Description

Update an existing project.

### Authentication

Required

---

## Delete Project

```http
DELETE /api/project/delete/:id
```

### Description

Delete a project.

### Authentication

Required

---

# Join Request APIs

## Send Join Request

```http
POST /api/joinRequest/send
```

### Description

Send a request to join a project.

### Authentication

Required

---

## Approve Join Request

```http
PUT /api/joinRequest/approve/:id
```

### Description

Approve a join request.

### Authentication

Required

---

## Reject Join Request

```http
PUT /api/joinRequest/reject/:id
```

### Description

Reject a join request.

### Authentication

Required

---

## Get Project Requests

```http
GET /api/joinRequest/all/:projectId
```

### Description

Retrieve all requests for a project.

### Authentication

Required

---

# Notification APIs

## Get Notifications

```http
GET /api/notifications/getAll
```

### Description

Retrieve all notifications for the authenticated user.

### Authentication

Required

---

## Mark Notification As Read

```http
PUT /api/notifications/read/:id
```

### Description

Mark a notification as read.

### Authentication

Required

---

# Chat APIs

## Get Project Messages

```http
GET /api/message/project/:id
```

### Description

Retrieve all messages of a project chat.

### Authentication

Required

---

# AI APIs

## Test AI Connection

```http
GET /api/openAi/test
```

### Description

Verify Gemini AI connectivity.

### Authentication

Not Required

---

## Get Project Recommendations

```http
GET /api/openAi/recommend-projects
```

### Description

Get AI-powered project recommendations based on user skills.

### Authentication

Required

---

# Authentication Header

```http
Authorization: Bearer <JWT_TOKEN>
```
