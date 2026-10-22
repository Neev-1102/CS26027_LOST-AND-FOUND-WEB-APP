# CampusFind — Comprehensive Project Audit & Diagnostic Report

**Audit Date:** October 2026  
**System:** CampusFind — Campus Lost and Found Management System  
**Stack:** MERN (MongoDB, Express.js, React 19, Node.js, Vite 8, Tailwind CSS, Recharts, Lucide Icons)  
**Status:** Audit Completed | Fixes & Enhancements Prioritized  

---

## 1. Architecture & Baseline Overview

### 1.1 Architecture Discovery
- **Frontend:** React 19 + Vite 8 in `src/`, styled with Tailwind CSS v4, Lucide icons, React Router v7, React Hook Form, Recharts. Dev server runs on port `3000`.
- **Backend:** Node.js + Express (ES Modules) in `backend/src/` running on port `5000`.
  - Routes: `/api/auth`, `/api/lost-items`, `/api/found-items`, `/api/claims`, `/api/notifications`, `/api/admin`.
  - Database: MongoDB via Mongoose connecting to `mongodb://127.0.0.1:27017/campusfind`.
  - File Uploads: Multer storing images to `uploads/` directory, served at `/uploads`.
- **Legacy Duplicate Directory:** A separate `server/` directory exists with a minimal prototype server. Root `package.json` scripts execute `backend/src/server.js`.
- **Active Database State:** MongoDB active on `127.0.0.1:27017` with collections: `users`, `lostitems`, `founditems`, `claims`, `categories`, `auditlogs`, `notifications`.

---

## 2. Prioritized Discovered Issues & Root Cause Analysis

### Issue 1: Admin Dashboard Crash & Hardcoded Fallback Data (CRITICAL)
- **Severity:** High / Critical Runtime Failure
- **Affected Files:** `src/pages/admin/AdminDashboardPage.jsx`, `src/services/adminService.js`, `src/services/claimService.js`
- **Root Cause:**
  - `AdminDashboardPage.jsx` invoked `claimService.getAllClaims()`, which does not exist in `claimService.js` (throws `TypeError: claimService.getAllClaims is not a function`).
  - Expected analytics structure (`analytics.overview`, `analytics.lostVsFound`, `analytics.byCategory`) did not match backend `/api/admin/dashboard` response (`stats.totalUsers`, `stats.totalLost`, `stats.totalFound`, `stats.totalClaims`, `stats.recoveryRate`, `stats.recentAuditLogs`).
  - When the promise failed, the UI silently fell back to hardcoded static mockup numbers (`5,420 users`, `1,250 lost`, `720 recovered`), completely hiding real database metrics.
- **Proposed Fix:**
  - Standardize `adminService.getStats()` to call `/api/admin/dashboard`.
  - Align `AdminDashboardPage.jsx` state directly to the live backend schema.
  - Implement real dynamic charts for status breakdowns, category distributions, and monthly trends.
- **Verification Method:** Log in as admin (`admin@charusat.edu.in`), verify page loads without console errors, and verify displayed numbers exactly match `User.countDocuments()`, `LostItem.countDocuments()`, `FoundItem.countDocuments()`, `Claim.countDocuments()`.

---

### Issue 2: Admin User Management Non-Existent Methods (CRITICAL)
- **Severity:** High / Broken Workflow
- **Affected Files:** `src/pages/admin/AdminUsersPage.jsx`, `src/services/adminService.js`
- **Root Cause:**
  - `AdminUsersPage.jsx` calls `adminService.updateUserStatus(user.id, newStatus)` and `adminService.updateUserRole(userId, newRole)`. Neither method exists in `adminService.js` (only generic `updateUser` existed).
  - MongoDB user documents use `_id`, whereas several frontend calls passed `user.id`.
- **Proposed Fix:**
  - Add explicit `updateUserStatus` and `updateUserRole` methods to `adminService.js`, with proper normalization of `_id` vs `id`.
  - Connect to backend `PATCH /api/admin/users/:id`.
- **Verification Method:** Toggle user account status (active ↔ inactive) and change user roles from the Admin table; verify changes persist in MongoDB.

---

### Issue 3: Admin Claims & Category Management Page Crashes (HIGH)
- **Severity:** High / Runtime Exception
- **Affected Files:** `src/pages/admin/AdminClaimsPage.jsx`, `src/pages/admin/AdminCategoriesPage.jsx`
- **Root Cause:**
  - `AdminClaimsPage.jsx` called `claimService.getAllClaims()` and `claimService.updateClaimStatus()`, which are not exported by `claimService.js`.
  - In `AdminCategoriesPage.jsx`, `const data = await adminService.getCategories()` receives `{ success: true, categories: [...] }`. Setting `setCategories(data)` caused `categories.map()` to crash with `TypeError: categories.map is not a function`.
- **Proposed Fix:**
  - In `claimService.js`, add `getAllClaims` alias pointing to `/api/claims/staff/all` and align review calls.
  - In `AdminCategoriesPage.jsx`, unwrap `res.categories || res` and support `_id`.
- **Verification Method:** Open `/admin/claims` and `/admin/categories`, create a category, edit it, delete it; verify no crashes occur and live data displays.

---

### Issue 4: Item Details Page Response Unwrapping Bug (HIGH)
- **Severity:** High / Visual Broken State
- **Affected Files:** `src/pages/public/ItemDetailsPage.jsx`
- **Root Cause:**
  - Backend `/api/lost-items/:id` and `/api/found-items/:id` return `{ success: true, item: { ... } }`.
  - `ItemDetailsPage.jsx` assigned `setItem(fetchedItem)` directly, leaving `item.title`, `item.category`, `item.description`, `item.images` undefined.
  - Field naming mismatch: models use `itemName` and `internalItemName`, while template accessed `title`.
- **Proposed Fix:**
  - Unwrap `res.item || res`.
  - Normalize title (`item.itemName || item.internalItemName || item.title`), description, and image arrays.
- **Verification Method:** Click "View Full Details" on any lost or found item from the public listings; verify full title, badge, category, location, and gallery render correctly.

---

### Issue 5: AI Matching Service Disconnected from Real Backend (MEDIUM)
- **Severity:** Medium / Mock Dependence
- **Affected Files:** `src/services/aiMatchService.js`, `backend/src/app.js`, `backend/src/routes/aiMatchRoutes.js` (to create), `backend/src/controllers/aiMatchController.js` (to create)
- **Root Cause:**
  - `aiMatchService.js` called `/ai-matches/search` and `/ai-matches/history`, but no such backend routes were registered in `backend/src/app.js`.
  - Backend had an algorithmic matcher in `backend/src/services/matchingService.js`, but it was only accessible via `/api/lost-items/:id/matches`.
  - Consequently, the frontend always fell back to `mockAIMatches.js`.
- **Proposed Fix:**
  - Create dedicated `/api/ai-matches` routes on the backend providing real dynamic similarity search between lost reports and custody found items.
  - Wire `aiMatchService.js` directly to this live API endpoint.
- **Verification Method:** Trigger an AI scan on `/ai-matches` for a reported lost item; verify backend computes scores based on category, color, keywords, and dates from MongoDB.

---

### Issue 6: Vite Proxy & Image Asset Serving (MEDIUM)
- **Severity:** Medium / Asset Loading Failure
- **Affected Files:** `vite.config.js`, `src/services/api.js`
- **Root Cause:**
  - Vite dev server runs on port `3000`, while Express backend runs on port `5000`.
  - Uploaded images stored in `uploads/` are served at `http://localhost:5000/uploads/filename.ext`.
  - If frontend requests `/uploads/filename.ext` from port `3000`, Vite returns 404 because no proxy rule exists.
- **Proposed Fix:**
  - Configure `vite.config.js` with proxy rules for `/api` and `/uploads` forwarding to `http://localhost:5000`.
  - Ensure image URLs consistently resolve whether relative or absolute.
- **Verification Method:** Upload an image during lost item reporting; verify the thumbnail loads properly on cards and detail pages without 404 errors.

---

### Issue 7: UI Consistency & Modern Campus Aesthetic Polish (ENHANCEMENT)
- **Severity:** Visual Polish / UX Experience
- **Affected Files:** Public layouts, student portal, staff console, admin control center
- **Root Cause:**
  - Inconsistent spacing, mismatched badge states, and rough card layouts.
  - Some pages had conflicting role navigation tabs and redundant mock fallback alerts.
- **Proposed Fix:**
  - Cohesive design system: deep slate `#0f172a`, modern campus navy `#1d4ed8`, crisp emerald badges for custody, amber for pending reviews, purple for admin actions.
  - Enhanced responsive behavior on mobile/tablet screens.
  - Accessible contrast, clear loading spinners, polished modals, and informative toast feedback.
- **Verification Method:** Full UI walkthrough across mobile and desktop viewport sizes.

---

## 3. Repair Roadmap

1. **Phase 2 & 6:** Repair backend services, controllers, routes, and add missing `/api/ai-matches` controller & routes.
2. **Phase 6 & 7:** Fix frontend API services (`adminService.js`, `claimService.js`, `lostItemService.js`, `foundItemService.js`, `aiMatchService.js`).
3. **Phase 3 & 4:** Polish role pages, unwrap model fields, ensure student safe views strip `storageLocation`.
4. **Phase 5 & 8:** Complete end-to-end testing of Student → Staff → Admin workflow.
5. **Phase 9 & 10:** Automated tests, browser verification, and test report generation.
