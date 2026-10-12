# CampusFind Test Cases & Verification Suite

This document outlines the test specifications across all roles and system components.

---

## 1. Student Test Cases

| Test ID | Module | Scenario / Test Description | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-STU-01** | Report Lost | Submit report with item name, category, location, date, and description. | Report created with status `approved`/`pending_review`; immediately triggers match scan. | Pass |
| **TC-STU-02** | Report Lost | Submit report with missing mandatory fields (e.g. empty item name). | Form validation error alerts student; submission blocked. | Pass |
| **TC-STU-03** | AI Matches | Report an item matching an existing found item (e.g., MacBook in Room 302). | High confidence match card (>80%) displayed with match reasons. | Pass |
| **TC-STU-04** | Submit Claim | Submit ownership claim for a found item with explanation & proof. | Claim created in `pending` status; staff custody desk notified. | Pass |
| **TC-STU-05** | Submit Claim | Attempt duplicate active claim for the same found item by the same student. | API returns HTTP 409 Conflict with informative error message. | Pass |
| **TC-STU-06** | Track Status | View `/student/my-claims` and click claim detail. | Real-time status badge (`pending`, `under_review`, `approved`, `completed`) with staff review remarks. | Pass |
| **TC-STU-07** | Data Privacy | Inspect claim detail page as student. | Staff internal notes and exact locker location are redacted/hidden. | Pass |

---

## 2. Staff Test Cases

| Test ID | Module | Scenario / Test Description | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-STF-01** | Register Found | Staff registers found item with internal name, location, and storage locker. | Item registered with status `in_custody`; stored securely in inventory. | Pass |
| **TC-STF-02** | Claims Queue | Navigate to `/staff/claims` to view pending student claims. | Table filters claims by status (`pending`, `under_review`, `approved`, `rejected`). | Pass |
| **TC-STF-03** | Verify Ownership | Staff inspects proof, compares evidence, and marks status as `approved` with remark. | Claim status becomes `approved`; notification sent to student. | Pass |
| **TC-STF-04** | Verify Ownership | Staff requires additional proof and selects `additional_information_requested`. | Student alerted to provide more verification evidence. | Pass |
| **TC-STF-05** | Confirm Handover | Staff completes physical handover at `/staff/claims/:id/handover`. | Item marked `returned`, claim marked `completed`, audit log created. | Pass |
| **TC-STF-06** | Access Control | Staff attempts to access Admin console (`/admin/users`). | RoleRoute blocks access and redirects to `/unauthorized`. | Pass |

---

## 3. Admin Test Cases

| Test ID | Module | Scenario / Test Description | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-ADM-01** | Account Mgmt | Create new staff account from `/admin/staff`. | User created with role `staff`; credentials functional for login. | Pass |
| **TC-ADM-02** | Account Mgmt | Suspend student account via `/admin/users`. | Account marked suspended; user prevented from authenticating. | Pass |
| **TC-ADM-03** | Categories | Add new item category (e.g., "Laboratory Equipment"). | New category appears in dropdowns across lost & found reporting forms. | Pass |
| **TC-ADM-04** | Monitoring | Filter and monitor all lost items, found items, and claims across campus. | Comprehensive tables with sorting, filtering, and detail drawers. | Pass |
| **TC-ADM-05** | Analytics | Access `/admin/analytics`. | Dynamic charts rendered for monthly items, category distribution, and return rates. | Pass |
| **TC-ADM-06** | Audit Logs | Perform handover or status change, then inspect `/admin/audit-logs`. | Non-repudiation audit record appears with timestamp, actor name, action, and target ID. | Pass |

---

## 4. Security & Role-Based Authorization Test Cases

| Test ID | Test Scenario | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **TC-SEC-01** | Unauthenticated user visits protected page `/student/dashboard`. | Redirected to `/login` with return target saved. | Pass |
| **TC-SEC-02** | Expired/Invalid JWT token sent in `Authorization` header. | API returns HTTP 401 Unauthorized; local session cleared. | Pass |
| **TC-SEC-03** | Student role attempts `POST /api/found-items` (staff-only endpoint). | API returns HTTP 403 Forbidden: "Insufficient permissions". | Pass |
| **TC-SEC-04** | Staff role attempts `DELETE /api/admin/categories/:id` (admin-only). | API returns HTTP 403 Forbidden. | Pass |
| **TC-SEC-05** | Password hash check in database. | Bcrypt salt and hash stored; plaintext password never saved. | Pass |
