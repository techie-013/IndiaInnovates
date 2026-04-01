# CivicLens - Digital Democracy Platform

## 🏙️ Overview
CivicLens is a comprehensive civic grievance platform that bridges the gap between citizens and government authorities. It combines AI-powered complaint classification, social media-style public forums, and transparent tracking to create an accountable governance ecosystem.

## 🎯 Problem Statement
- **70%** of grievance processing time wasted on manual sorting
- **40%+** complaints rejected due to insufficient evidence
- No priority system - life-threatening issues get same attention as minor problems
- Departmental silos causing blame-shifting
- **37%** drop in citizen trust due to lack of transparency

## 💡 Our Solution
- 🤖 **AI-Powered Classification** - 90% accurate auto-routing to departments
- 📸 **Multimodal Evidence** - Photo/video upload with metadata
- 📊 **Community-Led Priority** - Upvoting system for urgent issues
- 🗺️ **Geospatial Tracking** - Precise location mapping
- 💬 **Public Forum** - Social media style civic discussions
- 📈 **Budget Transparency** - Real-time spending visualization

## 👥 Team Members
| Name | Role | Responsibilities |
|------|------|------------------|
| **Sneha Singh** | Frontend Developer | Building all user interfaces, dashboards, and frontend components |
| **Rahul Kumar** | Backend Developer | Building APIs, authentication, server logic, and integrations |
| **Muskan** | AI Engineer | Building AI classification engine, NLP models, and content moderation |
| **Payal Bhyan** | Database Designer | Designing database schemas, data modeling, and database optimization |

## 🛠️ Tech Stack

### Frontend (Sneha)
- **Framework:** React.js + Vite
- **State Management:** React Hooks + Context API
- **Styling:** Tailwind CSS
- **HTTP Client:** Firebase SDK
- **Maps:** Leaflet / Mapbox
- **Charts:** Recharts

### Backend (Rahul)
- **Runtime:** Node.js (Firebase Cloud Functions)
- **Database:** Firestore
- **Authentication:** Firebase Auth
- **Storage:** Firebase Storage
- **Real-time:** Firestore listeners

### AI Engine (Muskan)
- **Framework:** TensorFlow.js / Natural
- **NLP:** Compromise / Natural
- **Classification:** Custom keyword-based with ML fallback

### Database (Payal)
- **Database:** Firestore
- **Data Modeling:** Collections and subcollections
- **Indexing:** Composite indexes for queries
- **Security:** Firestore Security Rules

## 📋 Prerequisites
- Node.js (v18+)
- Firebase Account
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/techie-013/CivicLens.git

2. Install Frontend Dependencies
bash
cd frontend
npm install
3. Configure Firebase
Create a Firebase project at https://console.firebase.google.com

Enable Authentication (Email/Password + Google)

Create Firestore Database (test mode)

Enable Storage

Copy your Firebase config to frontend/.env

4. Run the App
bash
npm run dev
🔐 Test Accounts
Role	Email	Password
Citizen	citizen@test.com	test123
Roads Official	roads@test.com	test123
Admin	admin@test.com	test123
📡 API Endpoints (Cloud Functions)
Method	Endpoint	Description
POST	/api/auth/login	User login
POST	/api/auth/register	User registration
GET	/api/complaints	Get all complaints
POST	/api/complaints	Create complaint
PUT	/api/complaints/:id/status	Update status
POST	/api/complaints/:id/upvote	Upvote complaint
🗺️ Dashboard URLs
Dashboard	URL	Access
Public Forum	/forum	Public
Citizen Dashboard	/citizen	Registered Citizens
Official Dashboard	/official	Department Officials
Admin Dashboard	/admin	Super Admin Only
📄 License
MIT License - feel free to use and modify!

📞 Contact
Team Name: The Garuds

Institution: GJUS&T, Hisar

Built with ❤️ for better governance

