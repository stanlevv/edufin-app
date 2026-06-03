import { createBrowserRouter } from "react-router";
import { AppLayout, ProtectedRoute } from "./components/shared/AppLayout";
import { OnboardingPage } from "./components/auth/OnboardingPage";
import { LoginPage } from "./components/auth/LoginPage";
import { RegisterPage } from "./components/auth/RegisterPage";
import { StudentDashboard } from "./components/student/StudentDashboard";
import { PaySPP } from "./components/student/PaySPP";
import { LoanPage } from "./components/student/LoanPage";
import { FundraisingPage } from "./components/student/FundraisingPage";
import { HistoryPage } from "./components/student/HistoryPage";
import { StudentProfile } from "./components/student/StudentProfile";
import { SchoolDashboard } from "./components/school/SchoolDashboard";
import { SchoolBillsPage } from "./components/school/SchoolBillsPage";
import { SchoolReportPage } from "./components/school/SchoolReportPage";
import { SchoolProfilePage } from "./components/school/SchoolProfilePage";
import { SchoolHistoryPage } from "./components/school/SchoolHistoryPage";
import { SchoolStudentsPage } from "./components/school/SchoolStudentsPage";
import { SchoolNotificationsPage } from "./components/school/SchoolNotificationsPage";
import { SchoolCampaignsPage } from "./components/school/SchoolCampaignsPage";
import { SchoolDonorsPage } from "./components/school/SchoolDonorsPage";
import { SchoolLoansPage } from "./components/school/SchoolLoansPage";
import { SchoolScholarshipPage } from "./components/school/SchoolScholarshipPage";
import { DonorDashboard } from "./components/donor/DonorDashboard";
import { CampaignDetail } from "./components/donor/CampaignDetail";
import { DonorCampaignsPage } from "./components/donor/DonorCampaignsPage";
import { DonorHistoryPage } from "./components/donor/DonorHistoryPage";
import { DonorProfilePage } from "./components/donor/DonorProfilePage";
import WireframeViewer from "./components/wireframes/WireframeViewer";
import DatabaseDocs from "./components/database/DatabaseDocs";

export const router = createBrowserRouter([
  // Dev-only routes (no auth)
  { path: "/wireframes", Component: WireframeViewer },
  { path: "/database-docs", Component: DatabaseDocs },

  // Main app with AuthProvider via AppLayout
  {
    Component: AppLayout,
    children: [
      // Public
      { path: "/", Component: OnboardingPage },
      { path: "/login", Component: LoginPage },
      { path: "/register", Component: RegisterPage },

      // Student (role: siswa)
      { path: "/student", element: <ProtectedRoute allowedRoles={["siswa"]}><StudentDashboard /></ProtectedRoute> },
      { path: "/student/spp", element: <ProtectedRoute allowedRoles={["siswa"]}><PaySPP /></ProtectedRoute> },
      { path: "/student/loan", element: <ProtectedRoute allowedRoles={["siswa"]}><LoanPage /></ProtectedRoute> },
      { path: "/student/fundraising", element: <ProtectedRoute allowedRoles={["siswa"]}><FundraisingPage /></ProtectedRoute> },
      { path: "/student/campaign/:id", element: <ProtectedRoute allowedRoles={["siswa"]}><CampaignDetail /></ProtectedRoute> },
      { path: "/student/history", element: <ProtectedRoute allowedRoles={["siswa"]}><HistoryPage /></ProtectedRoute> },
      { path: "/student/profile", element: <ProtectedRoute allowedRoles={["siswa"]}><StudentProfile /></ProtectedRoute> },

      // School Admin (role: sekolah)
      { path: "/school", element: <ProtectedRoute allowedRoles={["sekolah"]}><SchoolDashboard /></ProtectedRoute> },
      { path: "/school/students", element: <ProtectedRoute allowedRoles={["sekolah"]}><SchoolStudentsPage /></ProtectedRoute> },
      { path: "/school/bills", element: <ProtectedRoute allowedRoles={["sekolah"]}><SchoolBillsPage /></ProtectedRoute> },
      { path: "/school/scholarships", element: <ProtectedRoute allowedRoles={["sekolah"]}><SchoolScholarshipPage /></ProtectedRoute> },
      { path: "/school/campaigns", element: <ProtectedRoute allowedRoles={["sekolah"]}><SchoolCampaignsPage /></ProtectedRoute> },
      { path: "/school/donors", element: <ProtectedRoute allowedRoles={["sekolah"]}><SchoolDonorsPage /></ProtectedRoute> },
      { path: "/school/loans", element: <ProtectedRoute allowedRoles={["sekolah"]}><SchoolLoansPage /></ProtectedRoute> },
      { path: "/school/notifications", element: <ProtectedRoute allowedRoles={["sekolah"]}><SchoolNotificationsPage /></ProtectedRoute> },
      { path: "/school/report", element: <ProtectedRoute allowedRoles={["sekolah"]}><SchoolReportPage /></ProtectedRoute> },
      { path: "/school/history", element: <ProtectedRoute allowedRoles={["sekolah"]}><SchoolHistoryPage /></ProtectedRoute> },
      { path: "/school/profile", element: <ProtectedRoute allowedRoles={["sekolah"]}><SchoolProfilePage /></ProtectedRoute> },

      // Donor (role: donatur)
      { path: "/donor", element: <ProtectedRoute allowedRoles={["donatur"]}><DonorDashboard /></ProtectedRoute> },
      { path: "/donor/campaigns", element: <ProtectedRoute allowedRoles={["donatur"]}><DonorCampaignsPage /></ProtectedRoute> },
      { path: "/donor/campaign/:id", element: <ProtectedRoute allowedRoles={["donatur"]}><CampaignDetail /></ProtectedRoute> },
      { path: "/donor/history", element: <ProtectedRoute allowedRoles={["donatur"]}><DonorHistoryPage /></ProtectedRoute> },
      { path: "/donor/profile", element: <ProtectedRoute allowedRoles={["donatur"]}><DonorProfilePage /></ProtectedRoute> },
    ],
  },
]);