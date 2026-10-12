# CampusFind REST API Documentation

CampusFind provides a role-based RESTful API built on Express.js and Mongoose (MongoDB). All secured endpoints require a JSON Web Token (JWT) sent via standard `Authorization: Bearer <token>` header.

**Base URL**: `http://localhost:5000/api`

---

## 1. Authentication & Users (`/api/auth`)

### 1.1 Register New Student
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@campus.edu",
    "password": "Password123",
    "collegeId": "24CS099",
    "department": "Computer Science",
    "phone": "+91 98765 43210"
  }
  ```
- **Response** `(201 Created)`:
  ```json
  {
    "success": true,
    "message": "User registered successfully.",
    "token": "eyJhbGciOi...",
    "user": {
      "id": "67...",
      "name": "Jane Doe",
      "email": "jane@campus.edu",
      "role": "student"
    }
  }
  ```

### 1.2 User Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "student@charusat.edu.in",
    "password": "student123"
  }
  ```
- **Response** `(200 OK)`:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": {
      "id": "67...",
      "name": "Neev Patel",
      "email": "student@charusat.edu.in",
      "role": "student",
      "collegeId": "24CS088",
      "department": "Computer Engineering"
    }
  }
  ```

### 1.3 Get Current User Profile
- **Endpoint**: `GET /api/auth/me`
- **Access**: Private (Any authenticated role)
- **Response** `(200 OK)`: User profile object without password hash.

---

## 2. Lost Items (`/api/lost-items`)

### 2.1 Report a Lost Item (Student)
- **Endpoint**: `POST /api/lost-items`
- **Access**: Private (Role: `student`)
- **Request Body**:
  ```json
  {
    "itemName": "Blue HP Laptop Backpack",
    "category": "Bags & Backpacks",
    "description": "Lost near Central Library on 2nd floor",
    "locationLost": "Central Library",
    "dateLost": "2026-10-10",
    "approximateTime": "14:30",
    "color": "Navy Blue",
    "brand": "HP",
    "images": ["/uploads/backpack.jpg"]
  }
  ```
- **Response** `(201 Created)`:
  ```json
  {
    "success": true,
    "message": "Lost report registered successfully.",
    "item": { "_id": "...", "itemName": "..." },
    "matches": [
      {
        "foundItem": { "_id": "...", "internalItemName": "Navy Backpack" },
        "matchScore": 85,
        "matchReasons": ["Exact category match", "High keyword similarity"]
      }
    ]
  }
  ```

### 2.2 Get My Reported Lost Items
- **Endpoint**: `GET /api/lost-items/my`
- **Access**: Private (Role: `student`)

### 2.3 Find Possible Matches for a Lost Item
- **Endpoint**: `GET /api/lost-items/:id/matches`
- **Access**: Private (Report Owner or Staff/Admin)
- **Response** `(200 OK)`: List of potential found item matches scored 0–100%.

---

## 3. Found Items (`/api/found-items`)

### 3.1 Register Found Item (Staff)
- **Endpoint**: `POST /api/found-items`
- **Access**: Private (Role: `staff`, `faculty`, `admin`)
- **Request Body**:
  ```json
  {
    "internalItemName": "Space Gray MacBook Pro with Sticker",
    "category": "Electronics",
    "internalDescription": "13-inch laptop left in room 302",
    "generalLocation": "Science Building 3rd Floor",
    "storageLocation": "Central Security Locker B-04",
    "dateFound": "2026-10-06",
    "color": "Space Gray",
    "brand": "Apple",
    "images": ["/uploads/macbook.jpg"]
  }
  ```
- **Response** `(201 Created)`: Created found item record.

### 3.2 List Public/Available Found Items
- **Endpoint**: `GET /api/found-items`
- **Access**: Public / Student (storage location redacted)
- **Query Params**: `category`, `search`, `status`, `page`, `limit`

### 3.3 List Staff Inventory (Includes Storage Location)
- **Endpoint**: `GET /api/found-items/staff/inventory`
- **Access**: Private (Role: `staff`, `admin`)

---

## 4. Claims & Ownership Verification (`/api/claims`)

### 4.1 Submit Ownership Claim (Student)
- **Endpoint**: `POST /api/claims`
- **Access**: Private (Role: `student`)
- **Request Body**:
  ```json
  {
    "foundItemId": "67...",
    "lostItemId": "67...",
    "explanation": "I misplaced my laptop during lecture at 4pm.",
    "identifyingEvidence": "Sticker on top right corner, wallpaper is Yosemite.",
    "proofFiles": ["/uploads/receipt.pdf"]
  }
  ```
- **Response** `(201 Created)`: New claim initialized in `pending` status.

### 4.2 Get Student's Active Claims
- **Endpoint**: `GET /api/claims/my`
- **Access**: Private (Role: `student`)

### 4.3 Get Claims for Staff Review
- **Endpoint**: `GET /api/claims/staff`
- **Access**: Private (Role: `staff`, `admin`)
- **Query Params**: `status` (`pending`, `under_review`, `approved`, `rejected`)

### 4.4 Review & Verify Claim (Staff)
- **Endpoint**: `PATCH /api/claims/:id/review`
- **Access**: Private (Role: `staff`, `admin`)
- **Request Body**:
  ```json
  {
    "status": "approved",
    "reviewRemark": "Serial number matched student purchase invoice."
  }
  ```

### 4.5 Confirm Physical Handover (Staff)
- **Endpoint**: `PATCH /api/claims/:id/handover`
- **Access**: Private (Role: `staff`, `admin`)
- **Request Body**:
  ```json
  {
    "handoverNotes": "Student presented College ID 24CS088. Signature obtained."
  }
  ```
- **Response** `(200 OK)`: Claim marked `completed` and found item status updated to `returned`.

---

## 5. Admin & Management (`/api/admin`)

### 5.1 System Overview & Analytics
- **Endpoint**: `GET /api/admin/stats`
- **Access**: Private (Role: `admin`)
- **Response** `(200 OK)`: Total users, open lost reports, items in custody, return rate, category breakdown.

### 5.2 User Account Management
- **Endpoints**:
  - `GET /api/admin/users`: Query all accounts with role and status filtering.
  - `POST /api/admin/staff`: Create a new staff or faculty account.
  - `PATCH /api/admin/users/:id/status`: Activate, suspend, or deactivate account.

### 5.3 Category Management
- **Endpoints**:
  - `GET /api/admin/categories`: Get all categories.
  - `POST /api/admin/categories`: Create new category.
  - `PUT /api/admin/categories/:id`: Update category icon/name/description.
  - `DELETE /api/admin/categories/:id`: Deactivate category.

### 5.4 Audit Logs
- **Endpoint**: `GET /api/admin/audit-logs`
- **Access**: Private (Role: `admin`)
- **Response** `(200 OK)`: Chronological trace of actions (actor, action type, target item, timestamp).
