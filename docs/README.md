# CampusFind Documentation Index

Welcome to the **CampusFind** documentation hub. This directory contains detailed guides covering system architecture, role workflows, REST API contracts, setup procedures, and test specifications.

---

## Documentation Directory

| Document | Description |
| :--- | :--- |
| **[Workflows](file:///d:/LOST%20AND%20FOUND/docs/WORKFLOWS.md)** | Step-by-step lifecycles and Mermaid diagrams for **Student**, **Staff**, and **Admin** workflows. |
| **[API Documentation](file:///d:/LOST%20AND%20FOUND/docs/API_DOCUMENTATION.md)** | Full REST API specification covering endpoints, headers, payloads, and responses. |
| **[Setup Instructions](file:///d:/LOST%20AND%20FOUND/docs/SETUP_INSTRUCTIONS.md)** | Prerequisites, environment configuration, database seeding, and execution instructions. |
| **[Test Cases](file:///d:/LOST%20AND%20FOUND/docs/TEST_CASES.md)** | Verification matrix and test coverage for functional and role-based security requirements. |

---

## Role & Capability Matrix

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     STUDENT     │       │      STAFF      │       │      ADMIN      │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ • Report Lost   │       │ • Register Found│       │ • User Accounts │
│ • AI Matches    │       │ • Review Claims │       │ • Categories    │
│ • Submit Claim  │       │ • Verify Proof  │       │ • Reports Monitor│
│ • Track Status  │       │ • Confirm Return│       │ • Analytics/Logs│
└─────────────────┘       └─────────────────┘       └─────────────────┘
```
