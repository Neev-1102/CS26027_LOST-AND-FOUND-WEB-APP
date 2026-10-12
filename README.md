# CampusFind — Enterprise Campus Lost & Found System

CampusFind is an enterprise-grade MERN web application engineered for college and university campuses. It streamlines the lifecycle of reporting lost belongings, cataloging found items into secure custody, verifying claims with matching algorithms, and auditing the physical handover process.

---

## 🎯 Role Workflows & Core Capabilities

### 👨‍🎓 1. Student
- **Report lost item**: Form with dynamic category picker, timestamp, campus location, color, brand, and photos.
- **Receive possible match**: Automated matching engine scores items in custody based on category, title, description, and keywords.
- **Submit claim**: Provide private identifying proof (e.g., serial numbers, stickers, invoice) that only staff can review.
- **Track status**: Real-time progress dashboard (`pending` → `under_review` → `additional_information_requested` → `approved` → `completed`).

### 👮‍♂️ 2. Staff / Security Desk
- **Register found item**: Catalog recovered items with internal designations and private physical storage locker coordinates.
- **Review claims**: Dedicated review queue to evaluate student evidence against item properties.
- **Verify ownership**: Interactive decision console to approve, request more evidence, or reject with feedback.
- **Confirm handover**: In-person verification flow recording identity checks and marking items as officially returned.

### 🛡️ 3. Administrator
- **Manage accounts and categories**: Provision staff credentials, toggle user access states, and manage item categories.
- **Monitor reports**: Global search and moderation view across all lost items, found items, and claims.
- **View analytics and audit logs**: Dynamic visual charts on return rates, category trends, plus tamper-evident audit trails.

---

## 📂 Project Structure

```
campusfind/
├── backend/                   # Node.js & Express REST API
│   ├── src/
│   │   ├── config/            # Database and environment configurations
│   │   ├── controllers/       # Auth, LostItem, FoundItem, Claim, Admin controllers
│   │   ├── middleware/        # JWT auth, role authorization, multer, errors
│   │   ├── models/            # Mongoose schemas (User, LostItem, FoundItem, Claim, etc.)
│   │   ├── routes/            # Express route definitions
│   │   ├── scripts/           # Database seeder (seed.js)
│   │   └── services/          # Matching engine and notifications
│   └── package.json
│
├── docs/                      # Comprehensive Documentation
│   ├── API_DOCUMENTATION.md   # Complete REST API specification
│   ├── WORKFLOWS.md           # Mermaid workflow charts and step-by-step lifecycles
│   ├── SETUP_INSTRUCTIONS.md  # Detailed setup, seeding, and execution guide
│   ├── TEST_CASES.md          # Test matrices across all 3 roles
│   └── README.md              # Documentation index
│
├── src/                       # React 19 Frontend (Vite)
│   ├── components/            # Layouts, common UI components, cards, tables
│   ├── context/               # AuthContext, ToastContext
│   ├── pages/                 # Role-divided pages (student, staff, admin, public, auth)
│   ├── routes/                # ProtectedRoute, RoleRoute, AppRoutes
│   ├── services/              # Axios API service integrations
│   └── utils/                 # Formatters, validators, constants
│
├── public/                    # Static assets
├── index.html                 # HTML shell
├── vite.config.js             # Vite configuration
└── package.json               # Frontend dependencies & scripts
```

---

## 🚀 Quick Start

### 1. Backend
```bash
cd backend
npm install
npm run seed     # Seeds demo accounts and initial items
npm run dev      # Starts Express server on http://localhost:5000
```

### 2. Frontend
```bash
# In the project root directory
npm install
npm run dev      # Starts Vite client on http://localhost:5173
```

---

## 🔑 Default Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@charusat.edu.in` | `student123` |
| **Staff** | `staff@charusat.edu.in` | `staff123` |
| **Admin** | `admin@charusat.edu.in` | `admin123` |

---

## 📚 Detailed Documentation
For complete API contracts, workflow diagrams, and test suites, please explore the [docs directory](file:///d:/LOST%20AND%20FOUND/docs/README.md).
