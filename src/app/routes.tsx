import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import { AppLayout, ProtectedRoute } from "./components/shared/AppLayout";

// ─── Loading Fallback ────────────────────────────────────────────────────────
// Tampil saat chunk sedang di-download (lazy load)
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Memuat halaman...</p>
      </div>
    </div>
  );
}

function withSuspense(Component: React.ComponentType) {
  return function SuspenseWrapper(props: object) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

// ─── Public / Auth Pages (dimuat awal — selalu dibutuhkan) ───────────────────
import { OnboardingPage } from "./components/auth/OnboardingPage";
import { LoginPage } from "./components/auth/LoginPage";
import { RegisterPage } from "./components/auth/RegisterPage";
import { ForgotPasswordPage } from "./components/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./components/auth/ResetPasswordPage";

// ─── Student Pages — LAZY (chunk: student) ───────────────────────────────────
const StudentDashboard   = lazy(() => import("./components/student/StudentDashboard").then(m => ({ default: m.StudentDashboard })));
const PaySPP             = lazy(() => import("./components/student/PaySPP").then(m => ({ default: m.PaySPP })));
const FundraisingPage    = lazy(() => import("./components/student/FundraisingPage").then(m => ({ default: m.FundraisingPage })));
const HistoryPage        = lazy(() => import("./components/student/HistoryPage").then(m => ({ default: m.HistoryPage })));
const StudentProfile     = lazy(() => import("./components/student/StudentProfile").then(m => ({ default: m.StudentProfile })));

// ─── School Admin Pages — LAZY (chunk: school) ───────────────────────────────
const SchoolDashboard        = lazy(() => import("./components/school/SchoolDashboard").then(m => ({ default: m.SchoolDashboard })));
const SchoolBillsPage        = lazy(() => import("./components/school/SchoolBillsPage").then(m => ({ default: m.SchoolBillsPage })));
const SchoolReportPage       = lazy(() => import("./components/school/SchoolReportPage").then(m => ({ default: m.SchoolReportPage })));
const SchoolProfilePage      = lazy(() => import("./components/school/SchoolProfilePage").then(m => ({ default: m.SchoolProfilePage })));
const SchoolHistoryPage      = lazy(() => import("./components/school/SchoolHistoryPage").then(m => ({ default: m.SchoolHistoryPage })));
const SchoolStudentsPage     = lazy(() => import("./components/school/SchoolStudentsPage").then(m => ({ default: m.SchoolStudentsPage })));
const SchoolNotificationsPage = lazy(() => import("./components/school/SchoolNotificationsPage").then(m => ({ default: m.SchoolNotificationsPage })));
const SchoolCampaignsPage    = lazy(() => import("./components/school/SchoolCampaignsPage").then(m => ({ default: m.SchoolCampaignsPage })));
const SchoolDonorsPage       = lazy(() => import("./components/school/SchoolDonorsPage").then(m => ({ default: m.SchoolDonorsPage })));
const SchoolScholarshipPage  = lazy(() => import("./components/school/SchoolScholarshipPage").then(m => ({ default: m.SchoolScholarshipPage })));

// ─── Donor Pages — LAZY (chunk: donor) ───────────────────────────────────────
const DonorDashboard     = lazy(() => import("./components/donor/DonorDashboard").then(m => ({ default: m.DonorDashboard })));
const CampaignDetail     = lazy(() => import("./components/donor/CampaignDetail").then(m => ({ default: m.CampaignDetail })));
const DonorCampaignsPage = lazy(() => import("./components/donor/DonorCampaignsPage").then(m => ({ default: m.DonorCampaignsPage })));
const DonorHistoryPage   = lazy(() => import("./components/donor/DonorHistoryPage").then(m => ({ default: m.DonorHistoryPage })));
const DonorProfilePage   = lazy(() => import("./components/donor/DonorProfilePage").then(m => ({ default: m.DonorProfilePage })));

// ─── Dev-only Pages — LAZY ───────────────────────────────────────────────────
const WireframeViewer = lazy(() => import("./components/wireframes/WireframeViewer"));
const DatabaseDocs    = lazy(() => import("./components/database/DatabaseDocs"));

export const router = createBrowserRouter([
  // Dev-only routes (no auth)
  { path: "/wireframes", Component: withSuspense(WireframeViewer) },
  { path: "/database-docs", Component: withSuspense(DatabaseDocs) },

  // Main app with AuthProvider via AppLayout
  {
    Component: AppLayout,
    children: [
      // Public (tidak di-lazy — dimuat langsung karena selalu diakses pertama)
      { path: "/", Component: OnboardingPage },
      { path: "/login", Component: LoginPage },
      { path: "/register", Component: RegisterPage },
      { path: "/forgot-password", Component: ForgotPasswordPage },
      { path: "/reset-password", Component: ResetPasswordPage },

      // Student (role: siswa) — lazy loaded
      { path: "/student",             element: <ProtectedRoute allowedRoles={["siswa"]}><Suspense fallback={<PageLoader />}><StudentDashboard /></Suspense></ProtectedRoute> },
      { path: "/student/spp",         element: <ProtectedRoute allowedRoles={["siswa"]}><Suspense fallback={<PageLoader />}><PaySPP /></Suspense></ProtectedRoute> },
      { path: "/student/fundraising", element: <ProtectedRoute allowedRoles={["siswa"]}><Suspense fallback={<PageLoader />}><FundraisingPage /></Suspense></ProtectedRoute> },
      { path: "/student/campaign/:id",element: <ProtectedRoute allowedRoles={["siswa"]}><Suspense fallback={<PageLoader />}><CampaignDetail /></Suspense></ProtectedRoute> },
      { path: "/student/history",     element: <ProtectedRoute allowedRoles={["siswa"]}><Suspense fallback={<PageLoader />}><HistoryPage /></Suspense></ProtectedRoute> },
      { path: "/student/profile",     element: <ProtectedRoute allowedRoles={["siswa"]}><Suspense fallback={<PageLoader />}><StudentProfile /></Suspense></ProtectedRoute> },

      // School Admin (role: sekolah) — lazy loaded
      { path: "/school",               element: <ProtectedRoute allowedRoles={["sekolah"]}><Suspense fallback={<PageLoader />}><SchoolDashboard /></Suspense></ProtectedRoute> },
      { path: "/school/students",      element: <ProtectedRoute allowedRoles={["sekolah"]}><Suspense fallback={<PageLoader />}><SchoolStudentsPage /></Suspense></ProtectedRoute> },
      { path: "/school/bills",         element: <ProtectedRoute allowedRoles={["sekolah"]}><Suspense fallback={<PageLoader />}><SchoolBillsPage /></Suspense></ProtectedRoute> },
      { path: "/school/scholarships",  element: <ProtectedRoute allowedRoles={["sekolah"]}><Suspense fallback={<PageLoader />}><SchoolScholarshipPage /></Suspense></ProtectedRoute> },
      { path: "/school/campaigns",     element: <ProtectedRoute allowedRoles={["sekolah"]}><Suspense fallback={<PageLoader />}><SchoolCampaignsPage /></Suspense></ProtectedRoute> },
      { path: "/school/donors",        element: <ProtectedRoute allowedRoles={["sekolah"]}><Suspense fallback={<PageLoader />}><SchoolDonorsPage /></Suspense></ProtectedRoute> },
      { path: "/school/notifications", element: <ProtectedRoute allowedRoles={["sekolah"]}><Suspense fallback={<PageLoader />}><SchoolNotificationsPage /></Suspense></ProtectedRoute> },
      { path: "/school/report",        element: <ProtectedRoute allowedRoles={["sekolah"]}><Suspense fallback={<PageLoader />}><SchoolReportPage /></Suspense></ProtectedRoute> },
      { path: "/school/history",       element: <ProtectedRoute allowedRoles={["sekolah"]}><Suspense fallback={<PageLoader />}><SchoolHistoryPage /></Suspense></ProtectedRoute> },
      { path: "/school/profile",       element: <ProtectedRoute allowedRoles={["sekolah"]}><Suspense fallback={<PageLoader />}><SchoolProfilePage /></Suspense></ProtectedRoute> },

      // Donor (role: donatur) — lazy loaded
      { path: "/donor",              element: <ProtectedRoute allowedRoles={["donatur"]}><Suspense fallback={<PageLoader />}><DonorDashboard /></Suspense></ProtectedRoute> },
      { path: "/donor/campaigns",    element: <ProtectedRoute allowedRoles={["donatur"]}><Suspense fallback={<PageLoader />}><DonorCampaignsPage /></Suspense></ProtectedRoute> },
      { path: "/donor/campaign/:id", element: <ProtectedRoute allowedRoles={["donatur"]}><Suspense fallback={<PageLoader />}><CampaignDetail /></Suspense></ProtectedRoute> },
      { path: "/donor/history",      element: <ProtectedRoute allowedRoles={["donatur"]}><Suspense fallback={<PageLoader />}><DonorHistoryPage /></Suspense></ProtectedRoute> },
      { path: "/donor/profile",      element: <ProtectedRoute allowedRoles={["donatur"]}><Suspense fallback={<PageLoader />}><DonorProfilePage /></Suspense></ProtectedRoute> },
    ],
  },
]);