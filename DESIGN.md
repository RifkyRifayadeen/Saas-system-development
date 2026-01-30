# SaaS System Design Document: TaskFlow

## 1. Product Overview

### Product Name
**TaskFlow**

### Description
TaskFlow is a cloud-based project management and collaboration platform designed to help teams organize, track, and manage their work efficiently. It provides valid APIs for third-party integrations, robust user management, and subscription-based access to premium features.

### Problem Statement
Modern remote and hybrid teams struggle with fragmented communication and lack of visibility into project status. Existing tools are either too complex or lack essential API extensibility. TaskFlow bridges this gap by offering a streamlined, API-first approach to project management.

### Target Users
-   **Freelancers & Small Agencies** (Basic Tier)
-   **Startups & SMEs** (Pro Tier)
-   **Enterprise Teams** (Enterprise Tier)

### Business Model
**Subscription-based SaaS (Freemium)**
-   **Free Tier**: Limited projects, basic users.
-   **Pro Tier ($10/user/mo)**: Unlimited projects, advanced analytics, priority support.
-   **Enterprise Tier (Custom)**: SSO, audit logs, dedicated support, SLA.

---

## 2. Core Functional Modules

1.  **User Management**: Registration, profile updates, password management.
2.  **Authentication & Authorization**: Secure login, JWT handling, RBAC (Admin, Editor, Viewer).
3.  **Subscription & Billing**: Plan selection, payment processing (Stripe/PayPal integration), invoice generation, subscription status tracking.
4.  **Dashboard & Analytics**: Real-time overview of tasks, project velocity, user activity.
5.  **Data Management (Resources)**: core logic for creating, reading, updating, and deleting Projects and Tasks (the "Resources").
6.  **Admin Management**: System-wide user oversight, ban/unban users, view system health.

---

## 3. REST API Design

The API is designed to be pragmatic and RESTful, using standard HTTP verbs and status codes. The base URL for all API endpoints is `/api/v1`.

### A. Authentication APIs

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register a new user account. | No |
| `POST` | `/api/v1/auth/login` | Authenticate user and receive access/refresh tokens. | No |
| `POST` | `/api/v1/auth/logout` | Invalidate current session/tokens. | Yes |
| `POST` | `/api/v1/auth/refresh-token` | Obtain a new access token using a refresh token. | No |

**Example: POST /api/v1/auth/login**
*Request:*
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```
*Response (200 OK):*
```json
{
  "accessToken": "eyJhbG...",
  "refreshToken": "d7e8f...",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}
```

### B. User Management APIs

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/users/{id}` | Get public profile details of a user. | Yes |
| `PUT` | `/api/v1/users/{id}` | Update logged-in user's profile information. | Yes (Self) |
| `DELETE` | `/api/v1/users/{id}` | Deactivate/Delete user account. | Yes (Self/Admin) |

### C. Subscription & Billing APIs

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/subscriptions/plans` | List available subscription plans. | No |
| `POST` | `/api/v1/subscriptions/subscribe`| Initiate a subscription (inputs: planId, paymentToken).| Yes |
| `GET` | `/api/v1/subscriptions/status` | Get current subscription details and validity. | Yes |

### D. Dashboard APIs

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/dashboard/metrics` | Retrieve summary stats (e.g., total projects, completion rate). | Yes |

### E. Data Management APIs (Resources = Projects)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/resources` | Create a new project/resource. | Yes |
| `GET` | `/api/v1/resources` | List all projects with pagination & filtering. | Yes |
| `GET` | `/api/v1/resources/{id}` | Get specific project details. | Yes |
| `PUT` | `/api/v1/resources/{id}` | Update a project. | Yes |
| `DELETE` | `/api/v1/resources/{id}` | Delete a project. | Yes |

**Example: POST /api/v1/resources**
*Request:*
```json
{
  "name": "Website Redesign",
  "description": "Overhaul of the marketing site.",
  "status": "planned",
  "priority": "high"
}
```
*Response (201 Created):*
```json
{
  "id": "res_12345",
  "name": "Website Redesign",
  "description": "Overhaul of the marketing site.",
  "status": "planned",
  "priority": "high",
  "createdAt": "2023-10-27T10:00:00Z",
  "ownerId": "usr_999"
}
```

### F. Admin APIs

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/admin/users` | List all system users (filtered). | Yes (Admin) |
| `PUT` | `/api/v1/admin/users/{id}/status`| Change user status (e.g., active, suspended). | Yes (Admin) |

---

## 4. REST API Best Practices Implementation

-   **Versioning**: All endpoints are prefixed with `/api/v1` to allow for future breaking changes without disrupting existing clients.
-   **Statelessness**: No session data is stored on the server side; authentication relies entirely on JWTs sent in the `Authorization` header.
-   **Standard Methods**: strictly using `GET` for retrieval, `POST` for creation, `PUT`/`PATCH` for updates, and `DELETE` for removal.
-   **Status Codes**:
    -   `200 OK`: Successful synchronous request.
    -   `201 Created`: Resource successfully created.
    -   `400 Bad Request`: Validation failure.
    -   `401 Unauthorized`: Missing or invalid token.
    -   `403 Forbidden`: Valid token but insufficient permissions.
    -   `404 Not Found`: Resource does not exist.
    -   `500 Internal Server Error`: Generic server failure.
-   **Output Format**: All responses are strictly JSON. Dates are ISO 8601 strings.
-   **Pagination**: Endpoints returning lists support `?page=1&limit=20` query parameters.
-   **Validation**: Validation errors return a structured error response:
    ```json
    {
      "error": "Validation Error",
      "fields": {
        "email": "Invalid email format"
      }
    }
    ```

---

## 5. System Architecture

### Frontend
-   **Framework**: React.js (Single Page Application) or Next.js.
-   **State Management**: React Query (for API data) + Zustand/Redux (for UI state).
-   **Styling**: Tailwind CSS for rapid, scalable UI development.

### Backend
-   **Framework**: Node.js with Express.js (or NestJS for better structure).
-   **Language**: TypeScript for type safety.
-   **API Documentation**: Swagger/OpenAPI auto-generated from code.

### Database
-   **Primary DB**: PostgreSQL (Relational data: Users, Subscriptions, Resources).
-   **Caching**: Redis (Cache frequent dashboard queries, Rate Limiting counters).

### API Gateway & Infrastructure
-   **Gateway**: Nginx or AWS API Gateway (Handling SSL termination, routing).
-   **Cloud Provider**: AWS (EC2/ECS for app, RDS for Postgres, ElastiCache for Redis).
-   **Load Balancer**: Distributes traffic across multiple backend instances.

---

## 6. Security Design

1.  **Authentication**:
    -   **JWT (JSON Web Tokens)**: Access tokens (short-lived, 15m) and Refresh tokens (long-lived, 7d, stored in HTTPOnly cookies or secure storage).
2.  **Authorization (RBAC)**:
    -   Middleware checks `role` claim in JWT before allowing access to Admin/Editor routes.
3.  **Data Protection**:
    -   **HTTPS/TLS 1.2+**: Mandatory for all communications.
    -   **Password Hashing**: Bcrypt with a work factor (salt rounds) of at least 10 or Argon2.
4.  **Rate Limiting**:
    -   Implemented via Redis to prevent abuse (e.g., 100 requests per minute per IP).
5.  **Input Sanitation**:
    -   All inputs validated (Zod/Joi) and sanitized to prevent SQL Injection and XSS.

---

## 7. Database Design (Schema Overview)

### Users Table
-   `id` (UUID, Primary Key)
-   `email` (VARCHAR, Unique, Indexed)
-   `password_hash` (VARCHAR)
-   `full_name` (VARCHAR)
-   `created_at` (TIMESTAMP)

### Roles Table
-   `id` (INT, PK)
-   `name` (VARCHAR) - e.g., 'admin', 'user'

### User_Roles Table
-   `user_id` (FK -> Users.id)
-   `role_id` (FK -> Roles.id)

### Plans Table
-   `id` (UUID, PK)
-   `name` (VARCHAR)
-   `price_monthly` (DECIMAL)
-   `features` (JSONB)

### Subscriptions Table
-   `id` (UUID, PK)
-   `user_id` (FK -> Users.id)
-   `plan_id` (FK -> Plans.id)
-   `status` (ENUM: 'active', 'canceled', 'past_due')
-   `current_period_end` (TIMESTAMP)

### Resources (Projects) Table
-   `id` (UUID, PK)
-   `owner_id` (FK -> Users.id)
-   `name` (VARCHAR)
-   `description` (TEXT)
-   `status` (VARCHAR)
-   `is_public` (BOOLEAN)
-   `created_at` (TIMESTAMP)

### Audit_Logs Table
-   `id` (UUID, PK)
-   `user_id` (FK -> Users.id)
-   `action` (VARCHAR)
-   `resource_affected` (VARCHAR)
-   `timestamp` (TIMESTAMP)

---

## 8. Deployment & DevOps

### Dockerization
-   **Backend**: `Dockerfile` utilizing multi-stage builds (Build -> Production) to keep image size small.
-   **Frontend**: Nginx serving the static build.
-   **Compose**: `docker-compose.yml` for local development (orchestrates App, DB, Redis).

### CI/CD Pipeline (GitHub Actions / GitLab CI)
1.  **Build Stage**: Compile TypeScript, build Docker images.
2.  **Test Stage**: Run unit tests (Jest) and integration tests.
3.  **Deploy Stage**: Push images to Container Registry (ECR/Docker Hub) and update ECS service / Kubernetes cluster.

### Environment Separation
-   **Development**: Local `docker-compose`.
-   **Staging**: Replica of production with obfuscated data for QA.
-   **Production**: High-availability setup with auto-scaling.
