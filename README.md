# 🚀 Social Media Dashboard 3.0

A modern, real-time social media analytics dashboard built with Next.js and PostgreSQL (Supabase), providing centralized insights across multiple platforms.

## 📁 Project Overview
- **Industry**: Technology & Social Media Analytics
- **Developer**: [Zay2006](https://github.com/Zay2006)
- **Version**: 3.0.0
- **Last Updated**: May 2025
- **License**: MIT

## 🎯 Features
- Real-time analytics across multiple social media platforms
- Interactive data visualization with dynamic charts
- Cross-platform performance comparison
- Dark/Light mode support
- Mobile-responsive design
- PostgreSQL database integration with Supabase
- Robust error handling and data validation
- Secure authentication system
- RESTful API endpoints for platform stats and engagement metrics

## 🛠️ Tech Stack
- **Frontend**: Next.js 15+, React, TypeScript
- **UI Components**: ShadCN UI, Tailwind CSS
- **Data Visualization**: Recharts
- **Database**: PostgreSQL (Supabase)
- **API**: REST endpoints with Next.js API routes
- **State Management**: React Hooks
- **Development**: Turbopack
- **ORM**: node-postgres (pg)

## 🚀 Getting Started

### Prerequisites
1. Node.js 18.17 or later
2. PostgreSQL database (via Supabase)
3. npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Zay2006/social-dashboard3.0.git
   cd social-dashboard3.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update the `.env.local` file with your database credentials:
   ```
   DATABASE_URL=postgresql://postgres:[password]@db.iddtbmgmstqtjuyrjrzz.supabase.co:5432/postgres
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the dashboard**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📊 Database Structure

The dashboard uses several tables to store and retrieve data:
- `platforms`: Stores information about each social media platform
- `platform_followers`: Tracks follower counts for each platform over time
- `engagement_metrics`: Records engagement data (likes, comments, shares)
- `dashboard_kpis`: Stores key performance indicators
- `audience_reach`: Tracks audience reach metrics
- `platform_performance`: Records platform-specific performance metrics
- `overall_trends`: Aggregates engagement and growth trends

## 🔌 API Endpoints

- `GET /api/stats/platform`: Fetch platform statistics
  - Query params: `platform` (optional)
  - Returns: Follower counts and growth rates

- `GET /api/stats/engagement`: Fetch engagement metrics
  - Query params: `platform`, `startDate`, `endDate`
  - Returns: Time-series engagement data

- `GET /api/stats/kpis`: Fetch dashboard KPIs
  - Query params: `date` (optional)
  - Returns: Key performance indicators with growth percentages

- `GET /api/stats/audience`: Fetch audience reach data
  - Query params: `platform`, `startDate`, `endDate`
  - Returns: Platform-specific audience reach metrics

- `GET /api/stats/performance`: Fetch platform performance data
  - Query params: `platform`, `startDate`, `endDate`
  - Returns: Engagement and growth rates by platform

- `GET /api/stats/trends`: Fetch overall trends
  - Query params: `startDate`, `endDate`
  - Returns: Aggregated engagement and follower data

## 🔒 Security

- Environment variables for sensitive data
- SQL injection protection
- API rate limiting
- Secure database connections

## 🚀 Deployment

This project is configured for easy deployment to Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up the environment variables in the Vercel dashboard
4. Deploy!

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- ShadCN UI for the component library
- Recharts for data visualization
- Next.js team for the amazing framework
- Supabase for database hosting
