# 🛠️ GearGuard - Industrial Equipment Maintenance Management System

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/keya10713-4339s-projects/v0-gear-guard)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/urvD6PMTQHO)

> An enterprise-grade SaaS platform for managing industrial equipment maintenance, built for a 2nd Year B.Tech Hackathon Project.

## 🌟 Project Overview

GearGuard is a comprehensive maintenance management system designed to streamline equipment tracking, maintenance scheduling, and team coordination in industrial environments. The platform provides an intuitive dark-mode UI with real-time updates and smart automation features inspired by enterprise solutions like Odoo.

**Live Demo:** [https://vercel.com/keya10713-4339s-projects/v0-gear-guard](https://vercel.com/keya10713-4339s-projects/v0-gear-guard)

## 🎯 Problem Statement

Industrial facilities face challenges in:
- Tracking equipment status and maintenance history
- Coordinating maintenance teams efficiently
- Preventing equipment downtime through preventive maintenance
- Managing maintenance requests across departments
- Maintaining audit trails for compliance

GearGuard solves these problems with a centralized, user-friendly platform.

## ✨ Key Features

### 🔐 Authentication & User Management
- Secure user authentication with Supabase Auth
- Email/password signup and login
- Session management with HTTP-only cookies
- Row-Level Security (RLS) for data protection
- User profile management

### 📊 Dashboard & Analytics
- Real-time KPI cards showing:
  - Total equipment count
  - Active maintenance requests
  - Equipment utilization rates
  - Team performance metrics
- Trend indicators with percentage changes
- Visual status indicators for quick insights

### 🏭 Equipment Management
- Comprehensive equipment database with:
  - Equipment ID, name, type, and category
  - Manufacturer details and serial numbers
  - Department assignment
  - Cost tracking
  - Status monitoring (Active/Scrapped)
- **Smart Buttons**: View all maintenance requests for specific equipment
- Badge counters showing open request counts
- Department-based filtering (Manufacturing, Warehouse, Logistics)
- Search functionality across all equipment fields
- Detailed equipment view with maintenance history

### 👥 Team Management
- Team creation and member assignment
- Role-based access (Admin, Manager, Technician)
- Team member profiles with contact information
- Visual team cards with member avatars
- Department-wise team organization

### 📋 Maintenance Request Management (Kanban Board)
- **Four-stage workflow**: New → In Progress → Repaired → Scrap
- **Drag-and-drop functionality** for moving requests between stages
- Visual indicators:
  - Technician avatars on each card
  - Red overdue indicators for late requests
  - Maintenance type badges (Preventive, Corrective, Emergency)
  - Priority levels (High, Medium, Low)
- Automatic equipment scrap marking when requests reach Scrap stage
- Request details including:
  - Equipment information
  - Assigned technician
  - Due date with overdue detection
  - Description and notes

### 📅 Calendar View
- Monthly calendar display with current month/year
- All preventive maintenance requests visualized
- Click-to-schedule new maintenance
- Interactive date selection
- Equipment and technician assignment
- Maintenance type categorization

### 📈 Reports & Analytics
- Generate comprehensive reports:
  - Equipment status reports
  - Maintenance history
  - Team performance
  - Department-wise analysis
- Export functionality (PDF/Excel)
- Customizable date ranges

### ⚙️ Settings
- User profile management
- Email and password updates
- Notification preferences
- System configuration options

### 🔔 Smart Features (Odoo-inspired)
- **Smart Buttons** with badge counters
- Automatic equipment status updates
- Maintenance history logging
- Audit trail for all changes
- Automated scrap logic

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **UI Library**: React 19.2
- **Styling**: 
  - Tailwind CSS v4
  - shadcn/ui components
  - Radix UI primitives
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Form Management**: React Hook Form + Zod validation
- **Animations**: Tailwind CSS Animate

### Backend & Database
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth with Row-Level Security
- **API**: Next.js API Routes + Server Actions
- **Real-time**: Supabase Realtime subscriptions

### Deployment & DevOps
- **Hosting**: [Vercel](https://vercel.com/)
- **Version Control**: Git + GitHub
- **CI/CD**: Automatic deployments via Vercel
- **Analytics**: Vercel Analytics

### Database Schema
```sql
Tables:
- profiles (user profiles linked to auth)
- equipment_categories
- equipments
- maintenance_teams
- team_members
- maintenance_requests
- maintenance_request_history
```

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Vercel account (optional, for deployment)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/your-username/v0-gear-guard.git
cd v0-gear-guard
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL scripts in order:
     ```bash
     scripts/01-create-tables.sql
     scripts/02-enable-rls-v2.sql
     scripts/03-seed-data.sql
     scripts/04-create-functions.sql
     scripts/09-insert-all-sample-data.sql
     ```

4. **Configure environment variables**

Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

5. **Run the development server**
```bash
npm run dev
# or
pnpm dev
```

6. **Open [http://localhost:3000](http://localhost:3000)**

### Database Setup

Execute the SQL scripts in your Supabase SQL Editor in this order:

1. `01-create-tables.sql` - Creates all database tables
2. `02-enable-rls-v2.sql` - Enables Row-Level Security policies
3. `03-seed-data.sql` - Seeds equipment categories
4. `04-create-functions.sql` - Creates database functions and triggers
5. `09-insert-all-sample-data.sql` - Inserts sample data for testing

## 🎨 Design System

### Color Palette
- **Primary**: Purple/Indigo gradient (`#8B5CF6` to `#6366F1`)
- **Background**: Deep navy/charcoal (`#0A0E1A`, `#0F1419`)
- **Accent**: Purple highlights
- **Text**: White/gray scale for readability
- **Status Colors**: Green (success), Red (danger), Yellow (warning)

### Typography
- **Headings**: Inter (system sans-serif)
- **Body**: Inter with 1.5 line height
- **Border Radius**: 14-18px for modern feel

### Layout
- **Sidebar**: Fixed 260px width with gradient background
- **Top Header**: Horizontal navigation bar
- **Content**: Responsive grid layouts with proper spacing

## 📱 Pages & Routes

- `/` - Dashboard with KPIs and overview
- `/equipment` - Equipment management table
- `/teams` - Team management and member cards
- `/requests` - Kanban board for maintenance requests
- `/calendar` - Calendar view for scheduling
- `/reports` - Reports and analytics
- `/settings` - User settings and preferences
- `/login` - User authentication
- `/signup` - New user registration

## 🔒 Security Features

- Row-Level Security (RLS) policies on all tables
- Secure authentication with Supabase Auth
- HTTP-only cookies for session management
- Password hashing with bcrypt
- SQL injection prevention with parameterized queries
- Input validation with Zod schemas

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push to main branch

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/v0-gear-guard)

## 📊 Sample Data

The project includes comprehensive sample data:
- 8 equipment items across different departments
- 3 maintenance teams with 9 team members
- 20 maintenance requests in various stages
- 12 calendar events for preventive maintenance

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is created for educational purposes as part of a 2nd Year B.Tech Hackathon.

## 👨‍💻 Team

- **Developer**: [Your Name]
- **GitHub**: [@keya102](https://github.com/keya102)
- **Project Type**: 2nd Year B.Tech Hackathon Project

## 🙏 Acknowledgments

- Built with [v0.app](https://v0.app) - AI-powered UI generation
- UI Components from [shadcn/ui](https://ui.shadcn.com/)
- Database & Auth by [Supabase](https://supabase.com/)
- Deployed on [Vercel](https://vercel.com/)

## 📞 Support

For any queries or issues, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for Industrial Equipment Management**
