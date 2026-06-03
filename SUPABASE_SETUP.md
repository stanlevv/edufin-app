# Supabase Setup Guide for EduFin

## Prerequisites
- A Supabase account (sign up at https://supabase.com)
- Node.js and pnpm installed

## Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in:
   - Name: `edufin`
   - Database Password: (save this securely)
   - Region: Choose closest to your users
4. Wait for the project to be created (~2 minutes)

## Step 2: Run Database Schema

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the entire contents of `supabase-schema.sql` from this project
4. Paste it into the SQL editor
5. Click **Run** or press `Ctrl/Cmd + Enter`
6. Wait for all tables and policies to be created
7. Check for any errors in the output panel

## Step 3: Get API Credentials

1. Go to **Settings** > **API** in your Supabase project
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJhbGci...`)

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Important**: Never commit `.env` to git! It's already in `.gitignore`

## Step 5: Verify Installation

1. Restart your development server:
   ```bash
   pnpm run dev
   ```

2. Open the browser console and check for Supabase connection messages
3. Try logging in with demo credentials:
   - **Student**: siswa@edufin.id / demo123
   - **School**: sekolah@edufin.id / demo123
   - **Donor**: donatur@edufin.id / demo123

## Step 6: Seed Sample Data (Optional)

To add realistic sample data for testing:

1. Go to **SQL Editor** in Supabase
2. Run the seed queries from `supabase-seed.sql` (will be created)
3. This will populate:
   - Sample students with bills and payments
   - Sample campaigns and donations
   - Sample notifications

## Database Schema Overview

### Core Tables
- **users**: All user accounts (students, schools, donors)
- **students**: Student profile data (linked to users)
- **schools**: School profile data (linked to users)
- **donors**: Donor profile data (linked to users)

### Financial Tables
- **bills**: Monthly SPP bills for students
- **bill_items**: Line items in each bill (SPP, Kegiatan, Lab, etc.)
- **payments**: Payment transactions
- **loans**: Student loan applications
- **loan_installments**: Monthly installments for loans

### Fundraising Tables
- **campaigns**: Donation campaigns
- **donations**: Individual donations to campaigns

### Communication Tables
- **notifications**: User notifications
- **transactions**: Audit trail of all financial transactions

## Row Level Security (RLS)

The database uses Supabase RLS for security:
- Students can only see their own bills and payments
- Donors can only see their own donations
- Schools (admin) can see all data
- Anyone can view active campaigns

## Troubleshooting

### Issue: "Supabase URL or Anon Key is missing"
- Make sure `.env` file exists and has correct values
- Restart the dev server after creating `.env`

### Issue: SQL errors when running schema
- Make sure you're running the entire `supabase-schema.sql` file
- Check that UUID extension is enabled
- Verify no existing tables conflict with new ones

### Issue: Authentication not working
- Check that users table has demo accounts
- Verify RLS policies are created
- Check browser console for Supabase errors

## Next Steps

After setup is complete:
1. Test login with demo accounts
2. Verify data appears in dashboards
3. Test CRUD operations from admin panel
4. Configure real authentication (email, OAuth, etc.)

## Useful Links

- Supabase Dashboard: https://app.supabase.com
- Supabase Docs: https://supabase.com/docs
- EduFin GitHub: [your-repo-url]
