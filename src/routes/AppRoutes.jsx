import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';
import StudentLayout from '../components/layout/StudentLayout';
import StaffLayout from '../components/layout/StaffLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Public Pages
import HomePage from '../pages/public/HomePage';
import LostItemsPage from '../pages/public/LostItemsPage';
import FoundItemsPage from '../pages/public/FoundItemsPage';
import ItemDetailsPage from '../pages/public/ItemDetailsPage';
import HowItWorksPage from '../pages/public/HowItWorksPage';
import AboutPage from '../pages/public/AboutPage';
import UnauthorizedPage from '../pages/public/UnauthorizedPage';
import NotFoundPage from '../pages/public/NotFoundPage';

// AI Matches
import AIMatchesPage from '../pages/ai/AIMatchesPage';
import AIMatchDetailsPage from '../pages/ai/AIMatchDetailsPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

// Student Pages
import StudentDashboardPage from '../pages/student/StudentDashboardPage';
import ReportLostItemPage from '../pages/student/ReportLostItemPage';
import ReportFoundPage from '../pages/user/ReportFoundPage';
import MyLostItemsPage from '../pages/student/MyLostItemsPage';
import AvailableClaimListingsPage from '../pages/student/AvailableClaimListingsPage';
import SubmitClaimPage from '../pages/student/SubmitClaimPage';
import MyClaimsPage from '../pages/student/MyClaimsPage';
import ClaimDetailsPage from '../pages/student/ClaimDetailsPage';
import StudentNotificationsPage from '../pages/student/StudentNotificationsPage';
import StudentProfilePage from '../pages/student/StudentProfilePage';
import ChangePasswordPage from '../pages/student/ChangePasswordPage';

// Staff Pages
import StaffDashboardPage from '../pages/staff/StaffDashboardPage';
import AllLostReportsPage from '../pages/staff/AllLostReportsPage';
import RegisterFoundItemPage from '../pages/staff/RegisterFoundItemPage';
import FoundItemsInventoryPage from '../pages/staff/FoundItemsInventoryPage';
import ClaimManagementPage from '../pages/staff/ClaimManagementPage';
import ClaimReviewDetailsPage from '../pages/staff/ClaimReviewDetailsPage';
import HandoverConfirmationPage from '../pages/staff/HandoverConfirmationPage';
import StaffActivityHistoryPage from '../pages/staff/StaffActivityHistoryPage';
import StaffProfilePage from '../pages/staff/StaffProfilePage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import CreateStaffPage from '../pages/admin/CreateStaffPage';
import AdminLostItemsPage from '../pages/admin/AdminLostItemsPage';
import AdminFoundItemsPage from '../pages/admin/AdminFoundItemsPage';
import AdminClaimsPage from '../pages/admin/AdminClaimsPage';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage';
import AdminAuditLogsPage from '../pages/admin/AdminAuditLogsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import AdminProfilePage from '../pages/admin/AdminProfilePage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/lost-items" element={<LostItemsPage />} />
        <Route path="/found-items" element={<FoundItemsPage />} />
        <Route path="/lost-items/:id" element={<ItemDetailsPage />} />
        <Route path="/found-items/:id" element={<ItemDetailsPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* AI match exploration */}
        <Route path="/ai-matches" element={<AIMatchesPage />} />
        <Route path="/ai-matches/:id" element={<AIMatchDetailsPage />} />
        <Route path="/ai-match-history" element={<AIMatchesPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Access Denied */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      {/* 2. Protected Student Routes */}
      <Route
        element={
          <RoleRoute allowedRoles={['student']}>
            <StudentLayout />
          </RoleRoute>
        }
      >
        <Route path="/student/dashboard" element={<StudentDashboardPage />} />
        <Route path="/student/report-lost" element={<ReportLostItemPage />} />
        <Route path="/student/report-found" element={<ReportFoundPage />} />
        <Route path="/student/my-lost-items" element={<MyLostItemsPage />} />
        <Route path="/student/available-claims" element={<AvailableClaimListingsPage />} />
        <Route path="/student/claim/:id" element={<SubmitClaimPage />} />
        <Route path="/student/my-claims" element={<MyClaimsPage />} />
        <Route path="/student/claims/:id" element={<ClaimDetailsPage />} />
        <Route path="/student/notifications" element={<StudentNotificationsPage />} />
        <Route path="/student/profile" element={<StudentProfilePage />} />
        <Route path="/student/change-password" element={<ChangePasswordPage />} />

        {/* Compatibility aliases for previous links */}
        <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
        <Route path="/report/lost" element={<Navigate to="/student/report-lost" replace />} />
        <Route path="/report-lost" element={<Navigate to="/student/report-lost" replace />} />
        <Route path="/report/found" element={<Navigate to="/student/report-found" replace />} />
        <Route path="/report-found" element={<Navigate to="/student/report-found" replace />} />
        <Route path="/my-items/lost" element={<Navigate to="/student/my-lost-items" replace />} />
        <Route path="/my-lost-items" element={<Navigate to="/student/my-lost-items" replace />} />
        <Route path="/my-items/found" element={<Navigate to="/student/available-claims" replace />} />
        <Route path="/my-found-items" element={<Navigate to="/student/available-claims" replace />} />
        <Route path="/claims" element={<Navigate to="/student/my-claims" replace />} />
        <Route path="/my-claims" element={<Navigate to="/student/my-claims" replace />} />
        <Route path="/claims/:id" element={<ClaimDetailsPage />} />
        <Route path="/notifications" element={<Navigate to="/student/notifications" replace />} />
        <Route path="/profile" element={<Navigate to="/student/profile" replace />} />
      </Route>

      {/* 3. Protected Staff Routes */}
      <Route
        element={
          <RoleRoute allowedRoles={['staff', 'faculty']}>
            <StaffLayout />
          </RoleRoute>
        }
      >
        <Route path="/staff/dashboard" element={<StaffDashboardPage />} />
        <Route path="/staff/lost-reports" element={<AllLostReportsPage />} />
        <Route path="/staff/register-found" element={<RegisterFoundItemPage />} />
        <Route path="/staff/found-inventory" element={<FoundItemsInventoryPage />} />
        <Route path="/staff/claims" element={<ClaimManagementPage />} />
        <Route path="/staff/claims/:id" element={<ClaimReviewDetailsPage />} />
        <Route path="/staff/claims/:id/handover" element={<HandoverConfirmationPage />} />
        <Route path="/staff/activity" element={<StaffActivityHistoryPage />} />
        <Route path="/staff/profile" element={<StaffProfilePage />} />
        <Route path="/faculty" element={<Navigate to="/staff/dashboard" replace />} />
      </Route>

      {/* 4. Protected Admin Routes */}
      <Route
        element={
          <RoleRoute allowedRoles={['admin']}>
            <AdminLayout />
          </RoleRoute>
        }
      >
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/staff" element={<CreateStaffPage />} />
        <Route path="/admin/lost-items" element={<AdminLostItemsPage />} />
        <Route path="/admin/found-items" element={<AdminFoundItemsPage />} />
        <Route path="/admin/claims" element={<AdminClaimsPage />} />
        <Route path="/admin/categories" element={<AdminCategoriesPage />} />
        <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />
        <Route path="/admin/reports" element={<Navigate to="/admin/analytics" replace />} />
      </Route>

      {/* 5. 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
