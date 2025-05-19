# 🚀 Social Media Dashboard 3.0

A modern, real-time social media analytics dashboard built with Next.js and MySQL, providing centralized insights across multiple platforms.

## 📁 Project Overview
- **Industry**: Technology & Social Media Analytics
- **Developer**: [Zay2006](https://github.com/Zay2006)
- **Version**: 2.0.0
- **Last Updated**: May 2025
- **License**: MIT

## 🎯 Features
- Real-time analytics across multiple social media platforms
- Interactive data visualization with dynamic charts
- Cross-platform performance comparison
- Dark/Light mode support
- Mobile-responsive design
- MySQL database integration for reliable data storage
- RESTful API endpoints for platform stats and engagement metrics

## 🛠️ Tech Stack
- **Frontend**: Next.js 15+, React, TypeScript
- **UI Components**: ShadCN UI, Tailwind CSS
- **Data Visualization**: Recharts
- **Database**: MySQL
- **API**: REST endpoints with Next.js API routes
- **State Management**: React Hooks
- **Development**: Turbopack

## 🚀 Getting Started

### Prerequisites
1. Node.js 18.17 or later
2. MySQL 8.0 or later
3. npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Zay2006/social-dashboard-2.0.git
   cd social-dashboard-2.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_database_name
   ```

4. **Set up the database**
   - Create a new MySQL database
   - Import the schema from `src/lib/db/schema.sql`
   ```bash
   mysql -u your_username -p your_database_name < src/lib/db/schema.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Access the dashboard**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📊 Database Structure

The dashboard uses two main tables:
- `platform_followers`: Stores follower counts for each platform
- `engagement_metrics`: Tracks engagement data over time

Refer to `src/lib/db/schema.sql` for the complete database schema.

## 🔌 API Endpoints

- `GET /api/stats/platform`: Fetch platform statistics
  - Query params: `platform` (optional)
  - Returns: Follower counts and engagement rates

- `GET /api/stats/engagement`: Fetch engagement metrics
  - Query params: `platform`, `startDate`, `endDate`
  - Returns: Time-series engagement data

## 🧪 Testing

```bash
npm run test
# or
yarn test
```

## 🔒 Security

- Environment variables for sensitive data
- SQL injection protection
- API rate limiting
- Secure database connections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- ShadCN UI for the component library
- Recharts for data visualization
- Next.js team for the amazing framework

## 📧 Contact

For questions or feedback, please reach out to [your contact information]Social media managers

Digital marketing teams

Small to mid-sized businesses

These users need simple, centralized, and insightful dashboards to optimize their social strategies.

⚠️ Existing Limitations
Current tools are often:

Platform-specific

Not updated in real-time

Lacking AI-powered insights

Complex and expensive

💡 Solution Overview
🔍 Project Description
The Social Media Dashboard offers a central hub to track performance across all major social channels in real time. With interactive charts, smart comparisons, and a clean UI, it streamlines insights into engagement, reach, and audience growth—all powered by React, Next.js, and Recharts.

Note: This project currently uses dummy data for analytics instead of real platform APIs.

✨ Key Features
🔁 Real-time analytics simulation

📊 Interactive visualizations (engagement, reach, growth)

🧭 Cross-platform performance comparison

🌙 Dark mode

📱 Mobile-responsive UI

🌟 Value Proposition
This dashboard simplifies multi-platform analytics into one beautiful, real-time UI—saving time and giving teams actionable insights at a glance.

🤖 AI Implementation (Planned)
Content strategy suggestions

Sentiment analysis

Performance forecasting using OpenAI APIs

🛠️ Tech Stack
Layer	Tools
Frontend	Next.js, React, ShadCN UI
Styling	Tailwind CSS
Backend/API	Next.js API Routes
Database	MySQL (planned)
Authentication	TBD
AI Services	OpenAI API (planned)
Deployment	Vercel
Charts	Recharts
⚙️ Technical Implementation
🧩 Architecture Overview
Modular React components for charts, metrics, and layout

Data fetched via API routes, visualized using Recharts

🗃️ Database Schema (Planned)
Users

Platform access tokens

Analytics logs

📱 UI & UX
🧭 User Journey
Log in

Connect social accounts

View real-time dashboard

Analyze trends via filters

Receive insights & suggestions

📌 Key Screens
Dashboard Overview – aggregated metrics

Insights Panel – AI-powered recommendations (coming soon)

📱 Responsive & Accessible
Tailwind-powered mobile UI

High contrast, keyboard-navigable components

🧪 Testing & QA
✅ Testing Approach
Manual testing

Unit tests for UI components

Integration testing (planned)

🔍 Known Issues
AI modules not yet integrated

TikTok and YouTube support pending

🚀 Deployment
🔧 Build Process
bash
Copy code
git clone https://github.com/Zay2006/social-dashboard.git  
cd social-dashboard  
npm install  
npm run dev  
🧪 CI/CD
Auto-deployed to Vercel on GitHub push

Preview URLs for branches

📚 Week 2: API’s, UI Components & Data Models
Theme: Database Architecture & System Design

📐 Documentation Deliverables
UI/UX Wireframes
Detailed wireframes for all major screens

Mobile and desktop layout variations

Component hierarchy diagrams

User flow diagrams

API Documentation
Endpoint specifications

Request/response formats

Authentication requirements

Error codes and handling

Database Schema Design
Entity Relationship Diagram (ERD)

Schema definitions for all collections

Data validation rules

Indexing strategy

System Architecture
Application layer diagram

Data flow visualization

Component interaction map

Technology stack diagram

🔮 Future Enhancements
🧠 AI-driven content planning

📆 Post scheduling + performance forecasting

🌐 Platform support: YouTube, TikTok, Pinterest

🏎️ Performance optimization & caching

📚 Lessons Learned
🚧 Challenges
Navigating API limitations

Choosing the right UI libraries for data-heavy use cases

💡 Insights
Tailwind CSS significantly speeds up UI development

Recharts is flexible and developer-friendly

✅ Wins
Clean, fast setup

Reusable components

Scalable architecture

👀 What’s Next
AI integration rollout

Improved onboarding experience

Expanded platform support

📅 Project Management
Timeline: 4–6 weeks (currently in Week 2)
Tools Used: GitHub, Trello, Vercel, Figma, Recharts Docs

🏁 Conclusion
The Social Media Dashboard turns multi-platform chaos into clarity. It’s modern, sleek, and on its way to being AI-powered—empowering marketing teams to strategize smarter, faster, and with confidence.

🧰 Appendix
🖥️ Local Setup
bash
Copy code
# Clone the repository  
git clone https://github.com/Zay2006/social-dashboard.git  

# Install dependencies  
cd social-dashboard  
npm install  

# Start the development server  
npm run dev  
