# GitHub Issues Breakdown
# EDUFIN Platform Development

**Generated from:** PRD.md v1.0  
**Date:** 31 Mei 2025  
**Status:** Ready for GitHub  

---

## 📋 TABLE OF CONTENTS

1. [Issue Labels & Conventions](#1-issue-labels--conventions)
2. [Epic-Level Issues](#2-epic-level-issues)
3. [Phase 1: Foundation](#3-phase-1-foundation-weeks-1-4)
4. [Phase 2: SPP Payment Core](#4-phase-2-spp-payment-core-weeks-5-8)
5. [Phase 3: Cicilan & Notifications](#5-phase-3-cicilan--notifications-weeks-9-10)
6. [Phase 4: Fundraising/Campaign](#6-phase-4-fundraisingcampaign-weeks-11-14)
7. [Phase 5: Reporting & Analytics](#7-phase-5-reporting--analytics-weeks-15-16)
8. [Phase 6: Polish & Testing](#8-phase-6-polish--testing-weeks-17-18)
9. [Phase 7: Deployment & Launch](#9-phase-7-deployment--launch-week-19)
10. [Bug Template](#10-bug-template)
11. [Feature Request Template](#11-feature-request-template)

---

## 1. ISSUE LABELS & CONVENTIONS

### 1.1 Label System

**Priority Labels:**
- 🔴 `priority: critical` - Blocker, must be fixed immediately
- 🟠 `priority: high` - Important, needed for MVP
- 🟡 `priority: medium` - Should have, can be deferred
- 🟢 `priority: low` - Nice to have, optional

**Type Labels:**
- 🎯 `type: epic` - Large feature (multiple stories)
- 📖 `type: story` - User story (1-3 days work)
- 🐛 `type: bug` - Bug report
- ✨ `type: enhancement` - Feature improvement
- 📝 `type: docs` - Documentation
- 🔧 `type: chore` - Maintenance task

**Component Labels:**
- 🎨 `component: frontend` - React/UI work
- ⚙️ `component: backend` - Supabase/API work
- 💳 `component: payment` - Payment gateway integration
- 🔐 `component: auth` - Authentication/authorization
- 📊 `component: reporting` - Analytics/reports
- 🔔 `component: notifications` - Email/in-app notifications

**Phase Labels:**
- `phase: 1` - Foundation
- `phase: 2` - SPP Payment
- `phase: 3` - Cicilan & Notifications
- `phase: 4` - Fundraising
- `phase: 5` - Reporting
- `phase: 6` - Testing
- `phase: 7` - Deployment

**Effort Labels (Story Points):**
- `effort: XS` - 1 point (< 4 hours)
- `effort: S` - 2 points (4-8 hours)
- `effort: M` - 3 points (1-2 days)
- `effort: L` - 5 points (3-5 days)
- `effort: XL` - 8 points (1-2 weeks)

---

### 1.2 Issue Naming Convention

**Format:** `[Component] Short descriptive title`

**Examples:**
- `[Frontend] Create login page UI`
- `[Backend] Setup Supabase database schema`
- `[Payment] Integrate Midtrans QRIS`
- `[Bug] Payment webhook not triggering`

---

### 1.3 Story Point Estimation

| Points | Time | Complexity | Examples |
|--------|------|------------|----------|
| 1 (XS) | < 4 hours | Trivial | Add a button, fix typo, update text |
| 2 (S) | 4-8 hours | Simple | Create simple form, add API endpoint |
| 3 (M) | 1-2 days | Moderate | Implement CRUD, integrate API |
| 5 (L) | 3-5 days | Complex | Payment flow, authentication system |
| 8 (XL) | 1-2 weeks | Very Complex | Full dashboard, reporting module |

---

## 2. EPIC-LEVEL ISSUES

Epics adalah high-level features yang terdiri dari multiple stories.

---

### **EPIC #1: Authentication & User Management**

**Title:** `[Epic] Authentication & User Management System`

**Description:**
Implement complete authentication system with multi-role support (siswa, sekolah, donatur).

**User Stories:**
- As a **siswa**, I want to register with NISN + email so I can access the platform
- As a **user**, I want to login with email + password so I can access my account
- As a **user**, I want to reset my password if I forget it
- As an **admin**, I want to manage user accounts

**Acceptance Criteria:**
- [ ] User can register (siswa, sekolah, donatur)
- [ ] User can login with email + password
- [ ] User can logout
- [ ] User can request password reset via email
- [ ] Email verification required for activation
- [ ] Role-based access control (RBAC) implemented
- [ ] Session management with JWT tokens

**Labels:** `type: epic`, `priority: critical`, `component: auth`, `phase: 1`

**Effort:** 13 points (breakdown in child issues)

**Child Issues:** #2, #3, #4, #5, #6, #7

---

### **EPIC #8: SPP Payment Management**

**Title:** `[Epic] SPP Payment Management System`

**Description:**
Complete SPP payment flow including tagihan creation, payment processing via Midtrans, and payment history.

**User Stories:**
- As a **siswa**, I want to view my monthly SPP bills so I know what I need to pay
- As a **siswa**, I want to pay SPP via QRIS/VA so I don't have to come to school
- As an **admin**, I want to create SPP bills for students
- As an **admin**, I want to track payment status for all students

**Acceptance Criteria:**
- [ ] Admin can create tagihan (bulk or individual)
- [ ] Student can view their bills
- [ ] Student can pay via QRIS or Virtual Account
- [ ] Payment webhook updates bill status automatically
- [ ] Student receives payment confirmation email
- [ ] Student can download payment receipt (PDF)
- [ ] Admin can view payment history and export reports

**Labels:** `type: epic`, `priority: critical`, `component: payment`, `phase: 2`

**Effort:** 21 points (breakdown in child issues)

**Child Issues:** #15, #16, #17, #18, #19, #20, #21, #22

---

### **EPIC #23: Cicilan (Installment) System**

**Title:** `[Epic] Installment Payment System`

**Description:**
Allow students to request installment plans for SPP payments, with admin approval workflow.

**User Stories:**
- As a **siswa**, I want to request installment plan so I can pay SPP in multiple periods
- As an **admin**, I want to approve/reject installment requests
- As a **siswa**, I want to pay installments per period

**Acceptance Criteria:**
- [ ] Student can request installment (choose number of periods)
- [ ] Admin can approve/reject installment request
- [ ] Approved installment splits bill into multiple periods
- [ ] Student can pay each period separately
- [ ] System tracks installment progress
- [ ] Auto-mark as defaulted if payment late > 30 days

**Labels:** `type: epic`, `priority: high`, `component: payment`, `phase: 3`

**Effort:** 13 points (breakdown in child issues)

**Child Issues:** #24, #25, #26, #27

---

### **EPIC #28: Fundraising/Campaign Platform**

**Title:** `[Epic] Fundraising Campaign System`

**Description:**
Complete fundraising platform where students can create campaigns and donors can contribute.

**User Stories:**
- As a **siswa**, I want to create a fundraising campaign for my needs
- As an **admin**, I want to review and approve campaigns before they go live
- As a **donatur**, I want to browse and donate to approved campaigns
- As a **siswa**, I want to track my campaign progress

**Acceptance Criteria:**
- [ ] Student can create campaign (title, description, target, duration)
- [ ] Admin can approve/reject campaigns
- [ ] Public page shows all approved campaigns
- [ ] Donor can donate to campaign via QRIS/VA
- [ ] Campaign progress tracked in real-time
- [ ] Auto-close campaign when target reached
- [ ] Admin can disburse funds to school account

**Labels:** `type: epic`, `priority: high`, `component: frontend`, `component: payment`, `phase: 4`

**Effort:** 21 points (breakdown in child issues)

**Child Issues:** #29, #30, #31, #32, #33, #34, #35

---

### **EPIC #36: Notification System**

**Title:** `[Epic] Notification System (Email + In-App)`

**Description:**
Comprehensive notification system for all user actions (payment, campaign, installment).

**User Stories:**
- As a **user**, I want to receive email notifications for important events
- As a **user**, I want to see in-app notifications in notification center
- As an **admin**, I want to send bulk notifications to students

**Acceptance Criteria:**
- [ ] Email notifications for payment, campaign, installment
- [ ] In-app notification center with unread count
- [ ] User can mark notifications as read
- [ ] User can configure notification preferences
- [ ] Auto-send payment reminders before due date

**Labels:** `type: epic`, `priority: high`, `component: notifications`, `phase: 3`

**Effort:** 13 points (breakdown in child issues)

**Child Issues:** #37, #38, #39, #40

---

### **EPIC #41: Admin Dashboard & Reporting**

**Title:** `[Epic] Admin Dashboard & Reporting System`

**Description:**
Complete admin dashboard with analytics, reports, and data export functionality.

**User Stories:**
- As an **admin**, I want to see overview of payment status on dashboard
- As an **admin**, I want to generate payment reports
- As an **admin**, I want to export data to Excel/PDF

**Acceptance Criteria:**
- [ ] Dashboard shows key metrics (total students, revenue, outstanding)
- [ ] Charts for payment trends
- [ ] CRUD for student management
- [ ] Payment reports with filters (date, status, class)
- [ ] Campaign reports
- [ ] Financial summary report
- [ ] Export to Excel/PDF

**Labels:** `type: epic`, `priority: medium`, `component: reporting`, `phase: 5`

**Effort:** 21 points (breakdown in child issues)

**Child Issues:** #42, #43, #44, #45, #46, #47

---

## 3. PHASE 1: FOUNDATION (Weeks 1-4)

### **Story #2: Setup Project Structure**

**Title:** `[Frontend] Setup React + TypeScript + Tailwind project`

**Description:**
Initialize project with React 18, TypeScript, Tailwind CSS v4, and necessary dependencies.

**Tasks:**
- [ ] Create React app with Vite
- [ ] Configure TypeScript (tsconfig.json)
- [ ] Setup Tailwind CSS v4
- [ ] Install dependencies (react-router, lucide-react, recharts)
- [ ] Configure ESLint + Prettier
- [ ] Setup folder structure (/src/app, /src/components, /src/types, /src/utils)
- [ ] Create CONTEXT.md, PRD.md, ISSUES.md

**Acceptance Criteria:**
- Project runs locally with `npm run dev`
- TypeScript compiles without errors
- Tailwind classes work correctly
- Folder structure matches architecture

**Labels:** `type: story`, `priority: critical`, `component: frontend`, `phase: 1`, `effort: M`

**Effort:** 3 points

---

### **Story #3: Setup Supabase Backend**

**Title:** `[Backend] Setup Supabase project and database schema`

**Description:**
Create Supabase project, design and implement database schema for all tables.

**Tasks:**
- [ ] Create Supabase project
- [ ] Design database schema (users, students, bills, campaigns, etc.)
- [ ] Create tables with proper relationships
- [ ] Setup Row Level Security (RLS) policies
- [ ] Create indexes for performance
- [ ] Setup Supabase client in frontend
- [ ] Test database connection

**Acceptance Criteria:**
- All tables created as per PRD Section 6.2
- RLS policies enforce role-based access
- Foreign keys properly set up
- Indexes created for frequently queried fields
- Frontend can connect to Supabase

**Labels:** `type: story`, `priority: critical`, `component: backend`, `phase: 1`, `effort: L`

**Effort:** 5 points

---

### **Story #4: Implement User Registration**

**Title:** `[Auth] Implement user registration (siswa, sekolah, donatur)`

**Description:**
Create registration flow for all three user roles with email verification.

**Tasks:**
- [ ] Create registration form UI (siswa, sekolah, donatur)
- [ ] Add form validation (NISN format, email format, password strength)
- [ ] Integrate Supabase Auth signup
- [ ] Send verification email
- [ ] Create user profile in students/school table after signup
- [ ] Handle registration errors (duplicate email, NISN)
- [ ] Add success message and redirect to login

**Acceptance Criteria:**
- User can register with valid NISN (siswa) or email (others)
- Email verification sent after registration
- User cannot login until email verified
- Error messages clear and specific
- Form validates input before submit

**Labels:** `type: story`, `priority: critical`, `component: auth`, `component: frontend`, `phase: 1`, `effort: L`

**Effort:** 5 points

---

### **Story #5: Implement Login System**

**Title:** `[Auth] Implement login with email + password`

**Description:**
Create login page with email + password authentication for all user roles.

**Tasks:**
- [ ] Create login form UI
- [ ] Add form validation
- [ ] Integrate Supabase Auth login
- [ ] Store JWT token in AuthContext
- [ ] Implement "Remember me" checkbox (localStorage)
- [ ] Redirect to appropriate dashboard based on role
- [ ] Handle login errors (wrong password, unverified email)
- [ ] Add "Forgot password?" link

**Acceptance Criteria:**
- User can login with email + password
- Siswa redirected to student dashboard
- Sekolah redirected to admin dashboard
- Donatur redirected to donor dashboard
- Session persists on page refresh
- Error messages clear

**Labels:** `type: story`, `priority: critical`, `component: auth`, `component: frontend`, `phase: 1`, `effort: M`

**Effort:** 3 points

---

### **Story #6: Implement Password Reset**

**Title:** `[Auth] Implement forgot password flow`

**Description:**
Create password reset flow via email link.

**Tasks:**
- [ ] Create "Forgot Password" page with email input
- [ ] Integrate Supabase Auth password reset
- [ ] Send reset email with magic link
- [ ] Create "Reset Password" page (from email link)
- [ ] Allow user to enter new password
- [ ] Validate password strength
- [ ] Show success message and redirect to login

**Acceptance Criteria:**
- User can request password reset
- Email sent with reset link
- Reset link expires after 24 hours
- User can set new password
- New password must meet strength requirements

**Labels:** `type: story`, `priority: high`, `component: auth`, `component: frontend`, `phase: 1`, `effort: M`

**Effort:** 3 points

---

### **Story #7: Implement Role-Based Access Control**

**Title:** `[Auth] Implement RBAC and route protection`

**Description:**
Protect routes based on user role (siswa, sekolah, donatur).

**Tasks:**
- [ ] Create AuthContext with user role
- [ ] Create ProtectedRoute component
- [ ] Wrap routes with role check
- [ ] Redirect unauthorized access to login
- [ ] Create 403 Forbidden page
- [ ] Test access control for all roles

**Acceptance Criteria:**
- Siswa cannot access admin routes
- Sekolah cannot access student routes
- Unauthenticated users redirected to login
- Role stored in AuthContext
- Logout clears session

**Labels:** `type: story`, `priority: critical`, `component: auth`, `component: frontend`, `phase: 1`, `effort: M`

**Effort:** 3 points

---

### **Story #9: Create Student Dashboard Layout**

**Title:** `[Frontend] Create mobile-first student dashboard layout`

**Description:**
Design and implement student dashboard with bottom navigation and card-based UI.

**Tasks:**
- [ ] Create StudentDashboard component
- [ ] Design mobile-first layout (max-width 430px)
- [ ] Implement bottom navigation (Home, Payment, Campaign, Profile)
- [ ] Create summary cards (SPP status, campaign progress)
- [ ] Add placeholder content
- [ ] Make responsive for desktop

**Acceptance Criteria:**
- Mobile-first design (looks good on 375px width)
- Bottom nav fixed at bottom
- Cards display correctly
- Responsive breakpoints work
- Navigation active state shows current page

**Labels:** `type: story`, `priority: high`, `component: frontend`, `phase: 1`, `effort: M`

**Effort:** 3 points

---

### **Story #10: Create Admin Desktop Layout**

**Title:** `[Frontend] Create desktop-first admin dashboard layout`

**Description:**
Design and implement admin dashboard with sidebar navigation and multi-column layout.

**Tasks:**
- [ ] Create SchoolDesktopLayout component
- [ ] Design sidebar navigation (fixed left)
- [ ] Add navigation items (Dashboard, Students, Bills, Campaigns, Reports, Settings)
- [ ] Create top bar with school name and logout button
- [ ] Implement active state for nav items
- [ ] Create placeholder dashboard content
- [ ] Test on desktop resolution

**Acceptance Criteria:**
- Sidebar fixed on left (250px width)
- Top bar shows school name
- Navigation highlights active page
- Main content area scrollable
- Logout button works

**Labels:** `type: story`, `priority: high`, `component: frontend`, `phase: 1`, `effort: M`

**Effort:** 3 points

---

### **Story #11: Create Donor Dashboard Layout**

**Title:** `[Frontend] Create donor dashboard layout`

**Description:**
Design and implement donor dashboard for browsing campaigns and donation history.

**Tasks:**
- [ ] Create DonorDashboard component
- [ ] Mobile-first layout similar to student
- [ ] Bottom navigation (Browse, My Donations, Profile)
- [ ] Featured campaigns section
- [ ] Donation history preview
- [ ] Make responsive

**Acceptance Criteria:**
- Mobile-first design
- Browse tab shows campaign cards
- My Donations shows donation history
- Profile shows donor info
- Responsive for desktop

**Labels:** `type: story`, `priority: medium`, `component: frontend`, `phase: 1`, `effort: M`

**Effort:** 3 points

---

### **Story #12: Setup LocalStorage Fallback**

**Title:** `[Backend] Implement localStorage fallback for offline mode`

**Description:**
Create localStorage fallback layer for when Supabase is unavailable.

**Tasks:**
- [ ] Create localStorage utility functions (get, set, delete)
- [ ] Implement fallback logic in AuthContext
- [ ] Cache user session in localStorage
- [ ] Store JWT token locally
- [ ] Create offline mode indicator UI
- [ ] Test offline functionality

**Acceptance Criteria:**
- User can login when offline (if previously logged in)
- Session persists in localStorage
- Offline indicator shows when no connection
- Auto-sync when connection restored

**Labels:** `type: story`, `priority: medium`, `component: backend`, `phase: 1`, `effort: M`

**Effort:** 3 points

---

## 4. PHASE 2: SPP PAYMENT CORE (Weeks 5-8)

### **Story #15: Admin - Create Tagihan SPP**

**Title:** `[Backend] Admin can create SPP bills for students`

**Description:**
Implement tagihan creation flow for admin to create monthly SPP bills.

**Tasks:**
- [ ] Create bills table API endpoint (POST /bills)
- [ ] Admin UI: Create Bill form (student select, amount, month, due date)
- [ ] Implement bulk create (all students at once)
- [ ] Add form validation
- [ ] Save bills to Supabase
- [ ] Show success notification
- [ ] Test with multiple students

**Acceptance Criteria:**
- Admin can create bill for individual student
- Admin can bulk create bills for all students
- Amount, month, due date required
- Bills saved to database
- Validation prevents duplicate bills (same student + month)

**Labels:** `type: story`, `priority: critical`, `component: backend`, `component: frontend`, `phase: 2`, `effort: M`

**Effort:** 3 points

---

### **Story #16: Student - View Tagihan SPP**

**Title:** `[Frontend] Student can view their SPP bills`

**Description:**
Display student's SPP bills with status (lunas, belum bayar, terlambat, cicilan).

**Tasks:**
- [ ] Create API endpoint GET /bills?student_id=xxx
- [ ] Fetch bills from Supabase
- [ ] Display bills in card layout (mobile)
- [ ] Show status badge (color-coded)
- [ ] Show amount, due date, month
- [ ] Add "Bayar Sekarang" button for unpaid bills
- [ ] Show payment history

**Acceptance Criteria:**
- Student sees only their own bills
- Bills sorted by due date (newest first)
- Status badge color matches status (green=lunas, orange=belum bayar, red=terlambat)
- Paid bills show payment date
- Unpaid bills show "Bayar Sekarang" button

**Labels:** `type: story`, `priority: critical`, `component: frontend`, `component: backend`, `phase: 2`, `effort: M`

**Effort:** 3 points

---

### **Story #17: Integrate Midtrans QRIS**

**Title:** `[Payment] Integrate Midtrans QRIS payment method`

**Description:**
Implement QRIS payment flow via Midtrans Snap.

**Tasks:**
- [ ] Setup Midtrans account (sandbox mode)
- [ ] Install Midtrans Snap.js
- [ ] Create API endpoint POST /payments/initiate
- [ ] Backend: Create transaction in Midtrans
- [ ] Backend: Return snap_token to frontend
- [ ] Frontend: Show Midtrans Snap popup
- [ ] Handle payment callbacks (success, pending, error)
- [ ] Update bill status on success
- [ ] Test with sandbox QRIS

**Acceptance Criteria:**
- Student can click "Bayar Sekarang"
- Midtrans Snap popup appears with QRIS code
- Student can scan QRIS code (sandbox)
- Payment success updates bill status to "lunas"
- Student sees success message

**Labels:** `type: story`, `priority: critical`, `component: payment`, `component: backend`, `phase: 2`, `effort: L`

**Effort:** 5 points

---

### **Story #18: Integrate Midtrans Virtual Account**

**Title:** `[Payment] Integrate Midtrans Virtual Account (BCA, Mandiri)`

**Description:**
Implement VA payment for BCA and Mandiri.

**Tasks:**
- [ ] Enable VA payment in Midtrans dashboard
- [ ] Add VA option in payment method selection
- [ ] Backend: Create VA transaction in Midtrans
- [ ] Frontend: Display VA number and instructions
- [ ] Implement payment webhook handler
- [ ] Update bill status on webhook callback
- [ ] Test with sandbox VA

**Acceptance Criteria:**
- Student can choose VA BCA or VA Mandiri
- VA number generated and displayed
- Payment instructions clear
- Webhook updates bill status when payment received
- Receipt sent after payment

**Labels:** `type: story`, `priority: critical`, `component: payment`, `component: backend`, `phase: 2`, `effort: L`

**Effort:** 5 points

---

### **Story #19: Payment Webhook Handler**

**Title:** `[Backend] Implement Midtrans payment webhook`

**Description:**
Create webhook endpoint to receive payment notifications from Midtrans.

**Tasks:**
- [ ] Create API endpoint POST /payments/webhook
- [ ] Verify Midtrans signature
- [ ] Parse webhook payload
- [ ] Update bill status based on transaction status
- [ ] Send confirmation email to student
- [ ] Send notification to admin
- [ ] Log webhook events
- [ ] Test with Midtrans webhook simulator

**Acceptance Criteria:**
- Webhook receives Midtrans callbacks
- Signature verification passes
- Bill status updated correctly (success, pending, failed)
- Email sent on successful payment
- Webhook logged for debugging

**Labels:** `type: story`, `priority: critical`, `component: backend`, `component: payment`, `phase: 2`, `effort: L`

**Effort:** 5 points

---

### **Story #20: Payment Receipt Generator**

**Title:** `[Backend] Generate payment receipt (PDF)`

**Description:**
Create PDF receipt for successful payments.

**Tasks:**
- [ ] Install PDF library (e.g., jsPDF or Puppeteer)
- [ ] Design receipt template (school header, student info, amount, date, transaction ID)
- [ ] Create API endpoint GET /payments/:id/receipt
- [ ] Generate PDF on-demand
- [ ] Return PDF as download
- [ ] Send PDF via email
- [ ] Test receipt generation

**Acceptance Criteria:**
- Receipt PDF includes all required info
- Receipt downloadable from payment history
- Receipt sent via email after payment
- PDF layout professional and readable

**Labels:** `type: story`, `priority: high`, `component: backend`, `phase: 2`, `effort: M`

**Effort:** 3 points

---

### **Story #21: Payment History**

**Title:** `[Frontend] Display payment history for student`

**Description:**
Show list of all past payments with filters.

**Tasks:**
- [ ] Create Payment History page
- [ ] Fetch payment history from Supabase
- [ ] Display in table/list (mobile-friendly)
- [ ] Show: Date, Amount, Method, Status, Transaction ID
- [ ] Add filter by date range
- [ ] Add "Download Receipt" button per payment
- [ ] Test with multiple payments

**Acceptance Criteria:**
- Student sees all their past payments
- Payments sorted by date (newest first)
- Filter works (date range)
- Download receipt button works
- Mobile-responsive table

**Labels:** `type: story`, `priority: medium`, `component: frontend`, `phase: 2`, `effort: S`

**Effort:** 2 points

---

### **Story #22: Admin - Payment Verification**

**Title:** `[Frontend] Admin can verify manual payments`

**Description:**
Allow admin to manually verify cash/transfer payments.

**Tasks:**
- [ ] Create "Pending Payments" view for admin
- [ ] Display payments waiting verification
- [ ] Show uploaded payment proof (if any)
- [ ] Add "Approve" and "Reject" buttons
- [ ] Update bill status on approval
- [ ] Send notification to student
- [ ] Test manual verification flow

**Acceptance Criteria:**
- Admin sees pending manual payments
- Admin can view payment proof
- Approve button updates bill to "lunas"
- Reject button sends notification with reason
- Student notified of verification result

**Labels:** `type: story`, `priority: high`, `component: frontend`, `component: backend`, `phase: 2`, `effort: M`

**Effort:** 3 points

---

## 5. PHASE 3: CICILAN & NOTIFICATIONS (Weeks 9-10)

### **Story #24: Student - Request Installment**

**Title:** `[Frontend] Student can request installment plan`

**Description:**
Create UI for students to request installment for unpaid bills.

**Tasks:**
- [ ] Add "Ajukan Cicilan" button on unpaid bills
- [ ] Create installment request form (select periods: 2x, 3x, 4x, max 6x)
- [ ] Calculate amount per period and display
- [ ] Add optional reason field
- [ ] Submit request to backend
- [ ] Show confirmation message
- [ ] Test request flow

**Acceptance Criteria:**
- Button appears only on unpaid bills
- Form shows amount per period calculation
- User can select 2-6 periods
- Request saved with status "pending"
- Student sees confirmation

**Labels:** `type: story`, `priority: high`, `component: frontend`, `component: backend`, `phase: 3`, `effort: M`

**Effort:** 3 points

---

### **Story #25: Admin - Approve/Reject Installment**

**Title:** `[Frontend] Admin can approve or reject installment requests`

**Description:**
Admin dashboard to review and approve/reject installment requests.

**Tasks:**
- [ ] Create "Pending Installment Requests" section in admin
- [ ] Display requests with student info, bill amount, periods
- [ ] Add "Approve" and "Reject" buttons
- [ ] Approve: Split bill into X periods
- [ ] Reject: Send notification with reason
- [ ] Test approval/rejection flow

**Acceptance Criteria:**
- Admin sees all pending requests
- Approve splits bill into periods (new bills created)
- Reject sends notification to student
- Original bill marked as "cicilan" status

**Labels:** `type: story`, `priority: high`, `component: frontend`, `component: backend`, `phase: 3`, `effort: M`

**Effort:** 3 points

---

### **Story #26: Installment Payment Tracking**

**Title:** `[Frontend] Track installment payment progress`

**Description:**
Display installment progress for students with cicilan.

**Tasks:**
- [ ] Show installment periods on student dashboard
- [ ] Display: Period X of Y, Amount per period, Due date
- [ ] Show progress bar (e.g., "2/4 periods paid")
- [ ] Mark paid periods as "Lunas"
- [ ] Allow payment of next unpaid period
- [ ] Test with multiple periods

**Acceptance Criteria:**
- Student sees installment breakdown
- Progress bar shows % completion
- Only next unpaid period is payable
- Paid periods marked clearly

**Labels:** `type: story`, `priority: high`, `component: frontend`, `phase: 3`, `effort: M`

**Effort:** 3 points

---

### **Story #27: Installment Default Handling**

**Title:** `[Backend] Handle installment defaults (late > 30 days)`

**Description:**
Auto-mark installment as defaulted if payment late > 30 days.

**Tasks:**
- [ ] Create cron job / scheduled function
- [ ] Check installments with due date > 30 days overdue
- [ ] Mark as "defaulted" status
- [ ] Send notification to student
- [ ] Optionally: Convert back to full payment
- [ ] Test with test dates

**Acceptance Criteria:**
- Cron runs daily
- Installments late > 30 days marked as defaulted
- Student notified of default
- Admin can view defaulted installments

**Labels:** `type: story`, `priority: medium`, `component: backend`, `phase: 3`, `effort: M`

**Effort:** 3 points

---

### **Story #37: Email Notification System**

**Title:** `[Notifications] Implement email notifications`

**Description:**
Setup email notification system for all user actions.

**Tasks:**
- [ ] Setup email provider (Supabase email or SendGrid)
- [ ] Create email templates (payment confirmation, campaign approved, etc.)
- [ ] Implement email sending function
- [ ] Trigger emails on events (payment success, campaign approval, etc.)
- [ ] Test email delivery
- [ ] Add unsubscribe link

**Acceptance Criteria:**
- Emails sent for: Payment, Campaign, Installment events
- Email templates professional and branded
- Emails delivered within 1 minute
- Unsubscribe link works

**Labels:** `type: story`, `priority: high`, `component: notifications`, `phase: 3`, `effort: L`

**Effort:** 5 points

---

### **Story #38: In-App Notification Center**

**Title:** `[Frontend] Implement in-app notification center`

**Description:**
Create notification center with bell icon and notification list.

**Tasks:**
- [ ] Create notifications table in database
- [ ] Add bell icon to header with unread count
- [ ] Create notification dropdown/page
- [ ] Display notifications (title, message, timestamp)
- [ ] Mark as read on click
- [ ] Delete notification option
- [ ] Test with multiple notifications

**Acceptance Criteria:**
- Bell icon shows unread count badge
- Clicking bell opens notification list
- Notifications sorted by date (newest first)
- Mark as read changes unread count
- Delete removes notification

**Labels:** `type: story`, `priority: high`, `component: frontend`, `component: backend`, `phase: 3`, `effort: M`

**Effort:** 3 points

---

### **Story #39: Payment Reminder System**

**Title:** `[Notifications] Auto-send payment reminders`

**Description:**
Automatically send email reminders before SPP due date.

**Tasks:**
- [ ] Create cron job for daily check
- [ ] Check bills with due date in 7 days
- [ ] Send reminder email to student
- [ ] Check bills with due date in 1 day (final reminder)
- [ ] Check bills overdue (late notice)
- [ ] Log reminder sent
- [ ] Test with test dates

**Acceptance Criteria:**
- Reminder sent 7 days before due date
- Final reminder sent 1 day before
- Late notice sent on day after due date
- Each reminder sent only once (no duplicates)

**Labels:** `type: story`, `priority: high`, `component: notifications`, `component: backend`, `phase: 3`, `effort: M`

**Effort:** 3 points

---

### **Story #40: Notification Preferences**

**Title:** `[Frontend] User can configure notification preferences`

**Description:**
Allow users to enable/disable specific notification types.

**Tasks:**
- [ ] Create Notification Settings page
- [ ] Add toggles for: Email notifications, In-app notifications
- [ ] Add checkboxes for notification types (payment, campaign, etc.)
- [ ] Save preferences to database
- [ ] Respect preferences when sending notifications
- [ ] Test preference changes

**Acceptance Criteria:**
- User can toggle email ON/OFF
- User can toggle in-app ON/OFF
- User can select specific notification types
- Preferences saved and respected
- Default: All notifications ON

**Labels:** `type: story`, `priority: medium`, `component: frontend`, `component: backend`, `phase: 3`, `effort: S`

**Effort:** 2 points

---

## 6. PHASE 4: FUNDRAISING/CAMPAIGN (Weeks 11-14)

### **Story #29: Student - Create Campaign**

**Title:** `[Frontend] Student can create fundraising campaign`

**Description:**
Implement campaign creation form for students.

**Tasks:**
- [ ] Create "Buat Kampanye" page
- [ ] Form fields: Title, Description, Target amount, Duration, Category
- [ ] Add file upload for supporting documents
- [ ] Form validation
- [ ] Submit to backend
- [ ] Show confirmation (pending approval)
- [ ] Test campaign creation

**Acceptance Criteria:**
- Student can fill out campaign form
- All required fields validated
- Supporting document uploaded (optional)
- Campaign saved with status "pending"
- Student notified that campaign needs approval

**Labels:** `type: story`, `priority: high`, `component: frontend`, `component: backend`, `phase: 4`, `effort: M`

**Effort:** 3 points

---

### **Story #30: Admin - Approve/Reject Campaign**

**Title:** `[Frontend] Admin can approve or reject campaigns`

**Description:**
Admin interface to review and approve/reject student campaigns.

**Tasks:**
- [ ] Create "Pending Campaigns" section in admin
- [ ] Display campaign details (student, title, description, target, documents)
- [ ] Add "Approve" and "Reject" buttons
- [ ] Approve: Mark as "approved" and go live
- [ ] Reject: Enter reason and notify student
- [ ] Test approval/rejection

**Acceptance Criteria:**
- Admin sees all pending campaigns
- Campaign details displayed clearly
- Approve makes campaign public
- Reject sends notification with reason
- Supporting documents viewable

**Labels:** `type: story`, `priority: high`, `component: frontend`, `component: backend`, `phase: 4`, `effort: M`

**Effort:** 3 points

---

### **Story #31: Public Campaign Browse Page**

**Title:** `[Frontend] Public page to browse approved campaigns`

**Description:**
Create public-facing page where donors can browse and search campaigns.

**Tasks:**
- [ ] Create public /campaigns page (no auth required)
- [ ] Fetch approved campaigns from Supabase
- [ ] Display campaign cards (title, student, target, progress, category)
- [ ] Add filter by category
- [ ] Add sort (newest, most funded, ending soon)
- [ ] Add search by title/student name
- [ ] Test with multiple campaigns

**Acceptance Criteria:**
- Public can view page without login
- Only approved campaigns shown
- Filter and sort work correctly
- Search works (case-insensitive)
- Mobile-responsive card grid

**Labels:** `type: story`, `priority: high`, `component: frontend`, `phase: 4`, `effort: M`

**Effort:** 3 points

---

### **Story #32: Campaign Detail Page**

**Title:** `[Frontend] Campaign detail page with donation CTA`

**Description:**
Individual campaign page showing full details and donation button.

**Tasks:**
- [ ] Create /campaigns/:id page
- [ ] Display: Title, description, target, current amount, progress bar
- [ ] Show student info
- [ ] List recent donors (with anonymous option)
- [ ] Add "Donasi Sekarang" button
- [ ] Show campaign updates (if any)
- [ ] Test campaign detail view

**Acceptance Criteria:**
- Campaign details displayed fully
- Progress bar shows % funded
- Donor list shows recent donations
- Anonymous donors shown as "Donatur Anonim"
- Donate button leads to donation flow

**Labels:** `type: story`, `priority: high`, `component: frontend`, `phase: 4`, `effort: M`

**Effort:** 3 points

---

### **Story #33: Donation Flow**

**Title:** `[Payment] Implement donation payment flow`

**Description:**
Allow donors to donate to campaigns via QRIS/VA.

**Tasks:**
- [ ] Create donation form (amount, message, anonymous option)
- [ ] Guest checkout option (no login required)
- [ ] Validate min donation (Rp 10,000)
- [ ] Integrate Midtrans (same as SPP payment)
- [ ] Update campaign current_amount on success
- [ ] Send thank you email to donor
- [ ] Add donation to donor list
- [ ] Test donation flow

**Acceptance Criteria:**
- Donor can donate without login (guest)
- Min donation Rp 10,000 enforced
- Payment via QRIS/VA works
- Campaign progress updates in real-time
- Thank you email sent
- Donor name shown (or anonymous)

**Labels:** `type: story`, `priority: high`, `component: payment`, `component: frontend`, `component: backend`, `phase: 4`, `effort: L`

**Effort:** 5 points

---

### **Story #34: Campaign Progress Tracking**

**Title:** `[Frontend] Real-time campaign progress tracking`

**Description:**
Display campaign progress with real-time updates.

**Tasks:**
- [ ] Show progress bar (% funded)
- [ ] Display: Current amount / Target amount
- [ ] Show number of donors
- [ ] Update progress on new donation (real-time or on refresh)
- [ ] Auto-close campaign when 100% funded
- [ ] Test progress updates

**Acceptance Criteria:**
- Progress bar updates after donation
- Current amount displayed correctly
- Campaign auto-closes at 100%
- Student notified when target reached

**Labels:** `type: story`, `priority: medium`, `component: frontend`, `component: backend`, `phase: 4`, `effort: S`

**Effort:** 2 points

---

### **Story #35: Fund Disbursement**

**Title:** `[Backend] Admin can disburse campaign funds`

**Description:**
Allow admin to transfer campaign funds to school account.

**Tasks:**
- [ ] Create "Disburse Funds" button in admin (for completed campaigns)
- [ ] Show total amount to disburse
- [ ] Confirm disbursement (manual transfer to school bank)
- [ ] Mark campaign as "completed"
- [ ] Send notification to student (funds disbursed)
- [ ] Send notification to donors (campaign completed)
- [ ] Test disbursement flow

**Acceptance Criteria:**
- Admin can disburse only completed campaigns
- Confirmation dialog shown
- Campaign marked as "completed"
- Student and donors notified
- Disbursement logged in transaction history

**Labels:** `type: story`, `priority: medium`, `component: backend`, `component: frontend`, `phase: 4`, `effort: M`

**Effort:** 3 points

---

## 7. PHASE 5: REPORTING & ANALYTICS (Weeks 15-16)

### **Story #42: Admin Dashboard Overview**

**Title:** `[Frontend] Create admin dashboard with key metrics`

**Description:**
Implement admin dashboard with summary cards and charts.

**Tasks:**
- [ ] Create summary cards (total students, revenue, outstanding, pending campaigns)
- [ ] Create bar chart (monthly payment trend)
- [ ] Create pie chart (payment status distribution)
- [ ] Display recent transactions (latest 10)
- [ ] Make responsive for desktop
- [ ] Test with real data

**Acceptance Criteria:**
- Summary cards show correct numbers
- Charts display data correctly
- Recent transactions list works
- Charts use Recharts library
- Desktop-optimized layout

**Labels:** `type: story`, `priority: medium`, `component: frontend`, `component: reporting`, `phase: 5`, `effort: L`

**Effort:** 5 points

---

### **Story #43: Student Management CRUD**

**Title:** `[Frontend] Admin can manage students (CRUD)`

**Description:**
Full CRUD for student management in admin panel.

**Tasks:**
- [ ] Create Students page with table view
- [ ] Add "Tambah Siswa" button (create form)
- [ ] Edit student button (edit form)
- [ ] Delete student button (with confirmation)
- [ ] View student detail (payment history, campaigns)
- [ ] Bulk import students (CSV upload)
- [ ] Export student list (Excel)
- [ ] Test CRUD operations

**Acceptance Criteria:**
- Admin can add new student
- Admin can edit student info
- Admin can deactivate student (soft delete)
- Admin can view student detail
- Bulk import works (CSV format)
- Export works (Excel format)

**Labels:** `type: story`, `priority: high`, `component: frontend`, `component: backend`, `phase: 5`, `effort: L`

**Effort:** 5 points

---

### **Story #44: Payment Report**

**Title:** `[Frontend] Payment report with filters and export`

**Description:**
Create payment report page with filtering and export options.

**Tasks:**
- [ ] Create Payment Report page
- [ ] Display payments in table (date, student, amount, status, method)
- [ ] Add filters: Date range, Status, Class, Payment method
- [ ] Add search by student name
- [ ] Export to Excel button
- [ ] Export to PDF button
- [ ] Test filters and export

**Acceptance Criteria:**
- Table shows all payments
- Filters work correctly
- Search works (case-insensitive)
- Excel export includes filtered data
- PDF export formatted nicely

**Labels:** `type: story`, `priority: medium`, `component: frontend`, `component: reporting`, `phase: 5`, `effort: M`

**Effort:** 3 points

---

### **Story #45: Campaign Report**

**Title:** `[Frontend] Campaign report and analytics`

**Description:**
Report page showing all campaigns with stats.

**Tasks:**
- [ ] Create Campaign Report page
- [ ] Display campaigns table (title, student, target, raised, status)
- [ ] Add filters: Status, Date range
- [ ] Show stats: Total raised, Success rate, Avg campaign duration
- [ ] Export to Excel
- [ ] Test with multiple campaigns

**Acceptance Criteria:**
- Table shows all campaigns
- Filters work
- Stats calculated correctly
- Export includes all data

**Labels:** `type: story`, `priority: medium`, `component: frontend`, `component: reporting`, `phase: 5`, `effort: M`

**Effort:** 3 points

---

### **Story #46: Financial Summary Report**

**Title:** `[Frontend] Monthly financial summary report`

**Description:**
Generate monthly financial summary for admin.

**Tasks:**
- [ ] Create Financial Summary page
- [ ] Show monthly breakdown (SPP vs Donations)
- [ ] Show outstanding amount by class
- [ ] Show payment method distribution (QRIS vs VA vs Cash)
- [ ] Export as PDF (printable format)
- [ ] Test summary calculation

**Acceptance Criteria:**
- Summary shows correct monthly totals
- Breakdown by revenue source (SPP, Donations)
- Charts for payment method distribution
- PDF export professional and printable

**Labels:** `type: story`, `priority: medium`, `component: frontend`, `component: reporting`, `phase: 5`, `effort: M`

**Effort:** 3 points

---

### **Story #47: Transaction History Log**

**Title:** `[Frontend] Complete transaction history with filters`

**Description:**
View all transactions (SPP + Donations) with filtering.

**Tasks:**
- [ ] Create Transaction History page
- [ ] Fetch all transactions from database
- [ ] Display: Date, Type, Amount, Status, Transaction ID
- [ ] Add filters: Date range, Type, Status
- [ ] Add search by transaction ID
- [ ] Export to Excel
- [ ] Test with multiple transactions

**Acceptance Criteria:**
- All transactions shown (SPP + Donations)
- Filters work correctly
- Search works
- Export includes all data
- Sorted by date (newest first)

**Labels:** `type: story`, `priority: medium`, `component: frontend`, `component: backend`, `phase: 5`, `effort: M`

**Effort:** 3 points

---

## 8. PHASE 6: POLISH & TESTING (Weeks 17-18)

### **Story #48: UI/UX Refinement**

**Title:** `[Frontend] Polish UI/UX across all pages`

**Description:**
Final UI/UX improvements, consistency, and polish.

**Tasks:**
- [ ] Review all pages for consistency
- [ ] Replace all emojis with Lucide icons
- [ ] Fix spacing, alignment issues
- [ ] Ensure color scheme consistent
- [ ] Add loading states for all async operations
- [ ] Add empty states for no data
- [ ] Test mobile responsiveness on real devices
- [ ] Fix any UI bugs found

**Acceptance Criteria:**
- No emojis in UI (all replaced with icons)
- Consistent spacing and alignment
- Loading states show during data fetch
- Empty states guide user (e.g., "No bills yet")
- Mobile responsive on all pages

**Labels:** `type: story`, `priority: high`, `component: frontend`, `phase: 6`, `effort: M`

**Effort:** 3 points

---

### **Story #49: Performance Optimization**

**Title:** `[Frontend] Optimize performance (bundle size, lazy loading)`

**Description:**
Improve app performance and load times.

**Tasks:**
- [ ] Analyze bundle size with Vite build
- [ ] Implement code splitting for routes
- [ ] Lazy load heavy components (charts, modals)
- [ ] Optimize images (compress, lazy load)
- [ ] Reduce unnecessary re-renders
- [ ] Test load times (homepage, payment page)
- [ ] Aim for < 2s homepage load

**Acceptance Criteria:**
- Homepage loads < 2 seconds
- Payment page loads < 3 seconds
- Bundle size reduced by 20%+
- Images lazy loaded
- No unnecessary re-renders

**Labels:** `type: story`, `priority: medium`, `component: frontend`, `phase: 6`, `effort: M`

**Effort:** 3 points

---

### **Story #50: Security Audit**

**Title:** `[Backend] Security audit and fixes`

**Description:**
Review and fix security vulnerabilities.

**Tasks:**
- [ ] Review RLS policies in Supabase
- [ ] Test authentication edge cases
- [ ] Validate all user inputs (frontend + backend)
- [ ] Check for SQL injection vulnerabilities
- [ ] Check for XSS vulnerabilities
- [ ] Ensure HTTPS only
- [ ] Test payment webhook signature verification
- [ ] Fix any security issues found

**Acceptance Criteria:**
- RLS policies enforce access control correctly
- All inputs validated
- No SQL injection possible
- No XSS possible
- Webhook signature verified

**Labels:** `type: story`, `priority: critical`, `component: backend`, `phase: 6`, `effort: L`

**Effort:** 5 points

---

### **Story #51: Bug Fixes**

**Title:** `[Bug] Fix all reported bugs from testing`

**Description:**
Collect and fix bugs found during testing phase.

**Tasks:**
- [ ] Create bug tracking spreadsheet
- [ ] Test all features end-to-end
- [ ] Log bugs found
- [ ] Prioritize bugs (critical, high, medium, low)
- [ ] Fix critical bugs first
- [ ] Retest fixed bugs
- [ ] Update documentation if needed

**Acceptance Criteria:**
- All critical bugs fixed
- High priority bugs fixed
- Medium/low bugs logged for post-launch
- Regression testing passed

**Labels:** `type: bug`, `priority: critical`, `phase: 6`, `effort: XL`

**Effort:** 8 points

---

### **Story #52: User Acceptance Testing (UAT)**

**Title:** `[Testing] Conduct UAT with SDN 3 Malang`

**Description:**
Test platform with real users from SDN 3 Malang.

**Tasks:**
- [ ] Invite admin sekolah for training
- [ ] Create test accounts (students, admin)
- [ ] Walk through each feature with admin
- [ ] Invite sample students to test
- [ ] Gather feedback (usability, bugs, feature requests)
- [ ] Document feedback
- [ ] Fix critical issues found in UAT

**Acceptance Criteria:**
- Admin trained on all features
- Students tested payment flow
- Feedback collected and documented
- Critical issues fixed before launch
- Admin approves for launch

**Labels:** `type: story`, `priority: high`, `phase: 6`, `effort: L`

**Effort:** 5 points

---

## 9. PHASE 7: DEPLOYMENT & LAUNCH (Week 19)

### **Story #53: Production Deployment**

**Title:** `[DevOps] Deploy to production (Vercel + Supabase)`

**Description:**
Deploy frontend and backend to production environment.

**Tasks:**
- [ ] Setup production Supabase project
- [ ] Migrate database schema to production
- [ ] Setup environment variables (production)
- [ ] Deploy frontend to Vercel
- [ ] Test production deployment
- [ ] Setup custom domain (edufin.sch.id)
- [ ] Configure SSL certificate
- [ ] Test end-to-end in production

**Acceptance Criteria:**
- Frontend deployed to Vercel
- Production Supabase connected
- Custom domain working with HTTPS
- All features work in production
- Environment variables secured

**Labels:** `type: chore`, `priority: critical`, `phase: 7`, `effort: M`

**Effort:** 3 points

---

### **Story #54: Data Migration**

**Title:** `[Backend] Migrate existing data (if any)`

**Description:**
If SDN 3 Malang has existing student data, migrate to EDUFIN.

**Tasks:**
- [ ] Export existing student data from school
- [ ] Clean and format data (CSV)
- [ ] Import students to Supabase
- [ ] Verify data accuracy
- [ ] Import historical payment data (if any)
- [ ] Test with imported data

**Acceptance Criteria:**
- All students imported successfully
- Data accuracy verified with school
- No duplicate records
- Historical data (if any) preserved

**Labels:** `type: chore`, `priority: high`, `component: backend`, `phase: 7`, `effort: M`

**Effort:** 3 points

---

### **Story #55: Admin Training**

**Title:** `[Training] Train admin sekolah on platform usage`

**Description:**
Conduct training session for admin sekolah.

**Tasks:**
- [ ] Prepare training materials (user guide, video tutorial)
- [ ] Schedule training session with admin
- [ ] Walk through: Login, Create bills, Verify payments, Manage students, Approve campaigns, Reports
- [ ] Answer questions
- [ ] Provide support contact (WhatsApp/email)
- [ ] Follow-up 1 week after training

**Acceptance Criteria:**
- Admin trained on all features
- User guide provided (PDF + video)
- Admin confident to use platform
- Support channel established

**Labels:** `type: chore`, `priority: high`, `phase: 7`, `effort: S`

**Effort:** 2 points

---

### **Story #56: Soft Launch (Beta)**

**Title:** `[Launch] Soft launch with limited users`

**Description:**
Launch to limited group of students for beta testing.

**Tasks:**
- [ ] Select 20-30 students for beta
- [ ] Send invitation email with login instructions
- [ ] Monitor usage and errors
- [ ] Gather feedback
- [ ] Fix critical issues quickly
- [ ] Prepare for full launch

**Acceptance Criteria:**
- Beta users successfully onboarded
- No critical issues in production
- Feedback positive overall
- Platform stable under real usage

**Labels:** `type: chore`, `priority: high`, `phase: 7`, `effort: M`

**Effort:** 3 points

---

### **Story #57: Full Launch**

**Title:** `[Launch] Full launch to all students`

**Description:**
Launch to all students of SDN 3 Malang.

**Tasks:**
- [ ] Send announcement email to all students
- [ ] Provide registration instructions
- [ ] Monitor registration and usage
- [ ] Provide support for onboarding issues
- [ ] Celebrate launch 🎉
- [ ] Plan post-launch improvements

**Acceptance Criteria:**
- All students notified
- Registration guide clear
- Support available for issues
- Platform stable
- Success! 🚀

**Labels:** `type: chore`, `priority: critical`, `phase: 7`, `effort: M`

**Effort:** 3 points

---

## 10. BUG TEMPLATE

Use this template when creating bug reports:

---

**Title:** `[Bug] Short description of the bug`

**Description:**
Clear description of what went wrong.

**Steps to Reproduce:**
1. Go to...
2. Click on...
3. Enter...
4. See error

**Expected Behavior:**
What should have happened.

**Actual Behavior:**
What actually happened.

**Screenshots:**
(Attach screenshots if applicable)

**Environment:**
- Browser: Chrome 110
- OS: Windows 11
- Device: Desktop / Mobile
- User role: Siswa / Sekolah / Donatur

**Severity:**
- [ ] Critical (blocks major functionality)
- [ ] High (major feature broken)
- [ ] Medium (minor feature broken)
- [ ] Low (cosmetic issue)

**Labels:** `type: bug`, `priority: ???`, `component: ???`

---

## 11. FEATURE REQUEST TEMPLATE

Use this template when requesting new features:

---

**Title:** `[Feature] Short description of the feature`

**Description:**
What feature do you want to add?

**User Story:**
As a [role], I want to [action] so that [benefit].

**Problem Statement:**
What problem does this solve?

**Proposed Solution:**
How should this work?

**Alternatives Considered:**
Other ways to solve this problem?

**Priority:**
- [ ] Must have (critical for MVP)
- [ ] Should have (important, but can wait)
- [ ] Nice to have (optional)

**Labels:** `type: enhancement`, `priority: ???`, `component: ???`

---

## 📊 SUMMARY

**Total Story Points:** ~150 points  
**Total Issues:** 57 stories (excluding bugs/enhancements)  
**Estimated Timeline:** 19 weeks (flexible)

**Breakdown by Phase:**
- **Phase 1 (Foundation):** 22 points (4 weeks)
- **Phase 2 (SPP Payment):** 29 points (4 weeks)
- **Phase 3 (Cicilan & Notif):** 22 points (2 weeks)
- **Phase 4 (Fundraising):** 22 points (4 weeks)
- **Phase 5 (Reporting):** 22 points (2 weeks)
- **Phase 6 (Polish & Testing):** 24 points (2 weeks)
- **Phase 7 (Deployment):** 14 points (1 week)

**Total:** 155 story points

---

## 🚀 NEXT STEPS

1. **Copy issues to GitHub:** Create issues in GitHub repo using this template
2. **Assign priorities:** Review and adjust priorities based on team capacity
3. **Assign to team members:** Distribute issues across team
4. **Create milestones:** Group issues by phase (Phase 1, Phase 2, etc.)
5. **Start Sprint 1:** Begin with Phase 1 (Foundation)

**Ready to launch!** 🎯
