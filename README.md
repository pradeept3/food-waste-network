# 🌍 AI Food Waste Reduction Network

## 🎯 Overview

The AI Food Waste Reduction Network is a comprehensive platform that leverages **Google Gemini AI** to combat food waste while addressing hunger. By predicting surplus food, providing intelligent recommendations, and matching food with recipients, we create a sustainable ecosystem that benefits businesses, communities, and the environment.

### The Global Problem

- **1/3 of all food** is wasted globally
- **828 million people** suffer from hunger
- **8-10% of global greenhouse gas emissions** come from food waste
- Businesses lose **$940 billion annually** due to food waste

---

## ✨ Key Features

### 1. **AI-Powered Waste Predictions**
- Analyzes historical food data patterns
- Generates waste trend analysis (increasing/decreasing/stable)
- Predicts surplus for next period
- Provides 4+ actionable recommendations to reduce waste
- Powered by Google Gemini AI

### 2. **AI Recipient Matching**
- Intelligently matches surplus food with best recipients
- Scores matches from 0-100%
- Considers recipient capacity, specializations, and location
- Provides detailed reasoning for each match
- Optimizes impact with AI analysis

### 3. **Smart Recipe & Usage Suggestions**
- AI generates 3-4 recipes for large quantities of surplus food
- Suggests creative alternative uses (sauces, preserves, etc.)
- Provides preparation instructions and difficulty levels
- Helps maximize value from surplus inventory

### 4. **AI Assistant Chatbot**
- 24/7 support for food waste reduction questions
- Real-time recipe suggestions
- Storage and preservation advice
- Connect with donors and recipients
- Powered by Gemini conversation API

### 5. **Full Food Inventory Management**
- Add and track surplus food items
- Category-based organization (vegetables, dairy, bakery, etc.)
- Quantity tracking with multiple units
- Status management (available, reserved, collected)

### 6. **Transaction & Donation Tracking**
- Record food donations to recipients
- Track transaction history
- Monitor impact metrics in real-time
- Generate impact reports

### 7. **Impact Dashboard**
- Real-time metrics visualization
- Food saved (kg), meals provided, CO2 saved
- Money saved, connections made
- Waste trends by category and day

### 8. **Admin User Management** (Admin Only)
- View all registered users in the system
- Edit user information (name, email, phone, address, type)
- Delete users permanently
- Enable/disable user accounts (revoke access without deletion)
- Grant or revoke admin roles
- Protected endpoints requiring admin authentication
- Beautiful admin panel with real-time updates

### 9. **✨ Multi-Agent AI System** (NEW!)
- **Waste Prediction Agent**: Analyzes patterns and forecasts surplus
- **Matching Agent**: Intelligently matches food with recipients
- **Recipe Agent**: Generates creative recipes and utilization ideas
- **Logistics Agent**: Optimizes pickup and delivery routes
- **Impact Agent**: Tracks environmental and social metrics
- **Coordinator Agent**: Orchestrates complex multi-step operations
- Workflows for complete food rescue automation
- Real-time execution monitoring and history tracking
- Powered by CrewAI and Google Gemini 2.5 Flash

---

## 💻 Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **Google Gemini API** - Advanced AI models for predictions, matching, and chat
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation and settings management
- **python-dotenv** - Environment variable management
- **google-generativeai** - Gemini SDK

### Frontend
- **React 18** - Modern UI library with Hooks
- **Vite** - Lightning-fast build tool
- **Recharts** - Professional data visualization
- **Axios** - HTTP client with interceptors
- **Tailwind CSS** - Utility-first CSS framework

### AI/ML
- **Google Gemini 2.5 Flash** - Latest AI model for:
  - Waste pattern analysis and predictions
  - Intelligent recipient matching with scoring
  - Recipe and usage suggestions
  - Multi-turn conversational AI
- **CrewAI** - Multi-agent orchestration framework
- **LangChain** - LLM integration and tool management
- **LangGraph** - Agent workflow automation

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Google Gemini API Key (get free tier at [aistudio.google.com](https://aistudio.google.com))

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd food-waste-network
```

2. **Setup Backend**
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
echo "GEMINI_API_KEY=your_api_key_here" > .env
echo "DATABASE_URL=sqlite:///food_waste.db" >> .env

# Start server
python main.py
```

Backend runs on `http://localhost:8000`

3. **Setup Frontend**
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3001`

---

## 🔑 Getting Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Get API Key"
3. Create a new API key
4. Add to `backend/.env`:
   ```
   GEMINI_API_KEY=your_key_here
   ```
5. Restart the backend server

**Free Tier Limits:**
- 5 requests per minute (gemini-2.5-flash)
- Perfect for development and testing
- Upgrade to paid plan for production use

---

## 📋 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/all` - Get all users

### Food Management
- `POST /api/food-items` - Add surplus food
- `GET /api/food-items` - List available food
- `GET /api/food-items/{id}` - Get food details

### Transactions
- `POST /api/transactions` - Create donation/transaction
- `GET /api/transactions` - List transactions

### Matching & Recipients
- `GET /api/matching/recommended` - Get AI-recommended recipients
- `GET /api/recipients` - List all recipients

### Predictions
- `GET /api/predictions/surplus` - Get surplus predictions

### AI Features
- `GET /api/ai/status` - Check Gemini AI status
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/recipes` - Get recipe suggestions
- `POST /api/ai/waste-predictions` - Get AI waste analysis & recommendations
- `POST /api/ai/match-recipients` - AI-powered recipient matching

### ✨ Multi-Agent System
- `POST /api/agents/execute` - Execute a specific agent task
- `POST /api/agents/workflow` - Execute a multi-agent workflow
- `GET /api/agents/info` - Get agent information and capabilities
- `GET /api/agents/history` - View agent execution history
- `POST /api/agents/predict-waste` - Waste prediction agent
- `POST /api/agents/match-recipients` - Recipient matching agent
- `POST /api/agents/generate-recipes` - Recipe generation agent
- `POST /api/agents/calculate-impact` - Impact calculation agent
- `POST /api/agents/optimize-logistics` - Logistics optimization agent

**Available Workflows:**
- `food_surplus_workflow` - Complete food rescue process
- `impact_analysis_workflow` - Impact analysis and reporting
- `optimization_workflow` - Network optimization

See [Multi-Agent System Documentation](AGENTS_DOCUMENTATION.md) for detailed API reference.

### Metrics
- `GET /api/metrics/impact` - Get impact statistics

---

## 🎨 User Interface

### Dashboard Tab
- Impact metrics (food saved, meals provided, CO2 saved)
- Waste visualization by day and category
- Quick action buttons
- AI Insights & Recommendations section

### Available Food Tab
- Browse nearby surplus food
- Filter by category and distance
- Reserve food items
- View provider details

### Recipients Tab
- View registered recipients/NGOs
- Add new recipients
- Track recipient capacity
- Contact information

### Predictions Tab
- View AI-generated predictions
- Trend analysis
- Category breakdown
- Confidence scores

### Analytics Tab
- Historical trends
- Waste patterns
- Performance metrics
- Export reports

### Transactions Tab
- Donation history
- Transaction tracking
- Impact per transaction
- Status management

### Users Tab
- View all registered users
- User statistics
- User type breakdown
- Admin management

### ✨ AI Assistant Tab
**Chat Conversation**
- Ask questions about food waste reduction
- Get storage and preservation tips
- Discuss sustainability
- Real-time responses from Gemini AI

**Recipe Suggestions**
- Enter any food item (e.g., "tomatoes")
- Specify quantity (e.g., "50 kg")
- Get 3-4 recipes for large quantities
- Discover creative uses and preservation methods

---

## 📊 Data Models

### User
```python
{
  "id": int,
  "email": str,
  "name": str,
  "user_type": "restaurant|store|farm|ngo|shelter|buyer",
  "phone": str,
  "address": str,
  "latitude": float,
  "longitude": float,
  "created_at": datetime
}
```

### Food Item
```python
{
  "id": int,
  "name": str,
  "quantity": float,
  "unit": str,
  "category": str,
  "description": str,
  "status": "available|reserved|collected",
  "created_at": datetime,
  "expires_at": datetime
}
```

### Transaction
```python
{
  "id": int,
  "food_id": int,
  "from_user": int,
  "to_recipient": int,
  "quantity": float,
  "status": "pending|completed",
  "created_at": datetime
}
```

---

## 🤝 User Types

1. **Food Providers**
   - Restaurants, grocery stores, farms
   - List surplus food
   - Track donations
   - View impact

2. **Recipients**
   - NGOs, food banks, shelters, schools
   - Receive surplus food
   - Manage distribution
   - Report impact

3. **Buyers**
   - Purchase surplus at discounted rates
   - Support sustainability
   - Reduce waste

---

## 🎯 Use Cases

### For Restaurants
- Predict daily surplus with AI
- Automatically match with NGOs
- Get donation receipts
- Track tax deductions

### For Grocery Stores
- Manage expiring inventory
- Smart surplus matching
- Reduce waste disposal costs
- Improve sustainability score

### For NGOs/Shelters
- Access nearby surplus food
- Request specific items
- Track donations
- Report beneficiaries served

### For the Environment
- Reduce landfill waste
- Lower carbon emissions
- Promote circular economy
- Support sustainability goals

---

## 🔧 Configuration

### Environment Variables (.env)
```
# Gemini AI
GEMINI_API_KEY=your_key_here

# Database
DATABASE_URL=sqlite:///food_waste.db

# Server
DEBUG=true
LOG_LEVEL=info
```

### Gemini API Models
Current: **gemini-2.5-flash**
- Fast, efficient, perfect for real-time features
- Excellent for chat and recommendations
- 128K token context window
- Free tier: 5 requests/minute

---

## 📈 Performance & Scaling

### Free Tier (Development)
- 5 requests/minute for Gemini
- In-memory database (for demo)
- Single server deployment
- Perfect for testing and learning

### Paid Tier (Production)
- Unlimited requests per minute
- Production database (MySQL/PostgreSQL)
- Multi-server deployment
- CDN for static assets
- Advanced monitoring

---

## 🚨 Error Handling

### Common Issues

**Gemini API Quota Exceeded**
- Solution: Wait 3 seconds or upgrade to paid plan
- Check rate limits at [ai.dev/rate-limit](https://ai.dev/rate-limit)

**Database Errors**
- Ensure `.env` has valid DATABASE_URL
- Check database connection
- Review server logs

**CORS Errors**
- Backend CORS configured for localhost:3000, 3001, 5173
- Update in `main.py` if using different ports

---

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest tests/

# Frontend tests
cd frontend
npm run test
```

---

## 📚 Documentation

- [Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [FastAPI Docs](http://localhost:8000/docs) - Interactive API docs
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Team

Built with ❤️ for food waste reduction

---

## 📞 Support

- **Documentation**: Check README and API docs
- **Issues**: Report on GitHub
- **Email**: support@foodwaste.network
- **Chat**: Use the built-in AI Assistant tab

---

## 🌱 Impact Goals

- **2024**: Reduce food waste by 100 tons
- **2025**: Serve 10,000+ people
- **2026**: Expand to 50+ cities
- **2027**: Prevent 1M+ tons of food waste globally

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Status**: 🟢 Active & Production Ready

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- Docker & Docker Compose (recommended)
- MySQL 8.0+ (or use Docker)

### Option 1: Docker Compose (Recommended - Easiest)

```bash
# Clone the repository
git clone https://github.com/yourusername/food-waste-network.git
cd food-waste-network

# Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start all services
docker-compose up -d

# Wait for MySQL to be ready (about 30 seconds)
# Then initialize database
docker-compose exec backend python -c "from models import init_db; init_db()"

# Create admin user
docker-compose exec backend python scripts/create_admin.py

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup (Windows)

See detailed instructions below for [Backend Setup](#backend-setup) and [Frontend Setup](#frontend-setup).

---

## 🔧 Backend Setup (Python/FastAPI)

### 1. Prerequisites
- Python 3.9 or higher
- MySQL 8.0+ (or XAMPP/Docker)
- Redis (optional for background tasks)

### 2. Installation

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Variables

Create `backend/.env` file:

```env
# Database Configuration (MySQL)
DATABASE_URL=mysql+pymysql://foodwaste:foodwaste_password@localhost:3306/foodwaste

# For Docker, use:
# DATABASE_URL=mysql+pymysql://foodwaste:foodwaste_password@mysql:3306/foodwaste

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Optional: Email & SMS
SENDGRID_API_KEY=your-sendgrid-key-optional
TWILIO_ACCOUNT_SID=your-twilio-sid-optional
TWILIO_AUTH_TOKEN=your-twilio-token-optional
TWILIO_PHONE_NUMBER=+1234567890
```

### 4. Initialize Database

```bash
# Create tables
python -c "from models import init_db; init_db()"
```

### 5. Create Admin User

```bash
# Run the create admin script
python scripts/create_admin.py

# Default credentials:
# Email: admin@foodwaste.com
# Password: admin123
```

### 6. Run Backend Server

```bash
# Development mode (with auto-reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production mode
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

**Backend will be available at:**
- API: http://localhost:8000
- Interactive Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

---

## 💻 Frontend Setup (React)

### 1. Prerequisites
- Node.js 18+ and npm

### 2. Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Install additional packages (if not in package.json)
npm install recharts axios react-router-dom
```

### 3. Environment Variables

Create `frontend/.env` file:

```env
VITE_API_URL=http://localhost:8000
```

### 4. Configuration

Verify `src/config.js` exists with:

```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const config = {
  apiUrl: API_URL,
  defaultRadius: 10, // km
  mapCenter: [37.7749, -122.4194], // Default: San Francisco
};

export default config;
```

### 5. Run Frontend

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Frontend will be available at:** http://localhost:3000 (or http://localhost:5173 with Vite default)

---

## 🐬 Database Setup (MySQL)

### Option 1: Docker (Easiest)

Already included in `docker-compose.yml`. Just run:

```bash
docker-compose up -d mysql
```

**Access phpMyAdmin:** http://localhost:8080
- Username: `foodwaste`
- Password: `foodwaste_password`

### Option 2: XAMPP (Windows - Beginner Friendly)

1. **Install XAMPP** from https://www.apachefriends.org/
2. **Start MySQL** from XAMPP Control Panel
3. **Open phpMyAdmin** at http://localhost/phpmyadmin
4. **Create Database:**
   - Click "New" in left sidebar
   - Database name: `foodwaste`
   - Collation: `utf8mb4_unicode_ci`
   - Click "Create"
5. **Create User:**
   - Go to "User Accounts" → "Add User Account"
   - Username: `foodwaste`
   - Host: `localhost`
   - Password: `foodwaste_password`
   - Check "Grant all privileges on database foodwaste"
   - Click "Go"

### Option 3: Local MySQL Installation

```bash
# Install MySQL 8.0 from https://dev.mysql.com/downloads/

# Create database and user
mysql -u root -p

# In MySQL console:
CREATE DATABASE foodwaste CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'foodwaste'@'localhost' IDENTIFIED BY 'foodwaste_password';
GRANT ALL PRIVILEGES ON foodwaste.* TO 'foodwaste'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Test Database Connection

```bash
cd backend
python -c "
from sqlalchemy import create_engine, text
engine = create_engine('mysql+pymysql://foodwaste:foodwaste_password@localhost:3306/foodwaste')
with engine.connect() as conn:
    result = conn.execute(text('SELECT VERSION()'))
    print(f'✅ Connected! MySQL Version: {result.fetchone()[0]}')
"
```

---

## 🐳 Docker Setup

### Using Docker Compose

The project includes a complete `docker-compose.yml` with:
- MySQL database
- Redis cache
- Backend API
- Frontend app
- phpMyAdmin (database management)

```bash
# Start all services
docker-compose up -d

# Start with phpMyAdmin
docker-compose --profile tools up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove all data
docker-compose down -v
```

### Individual Docker Commands

```bash
# Build backend
cd backend
docker build -t foodwaste-backend .

# Build frontend
cd frontend
docker build -t foodwaste-frontend .

# Run backend container
docker run -d -p 8000:8000 foodwaste-backend

# Run frontend container
docker run -d -p 3000:3000 foodwaste-frontend
```

---

## ✨ AI Model Setup

### 1. Train Initial Model

```bash
cd backend

# Train model with sample data
python -c "
from ml_model import SurplusPredictionModel
import json

model = SurplusPredictionModel()

# Generate sample training data
historical_data = [
    {
        'day_of_week': i % 7,
        'month': 1,
        'avg_daily_sales': 150 + (i % 50),
        'current_inventory': 200,
        'temperature': 20 + (i % 10),
        'is_weekend': 1 if i % 7 >= 5 else 0,
        'is_holiday': 0,
        'local_event_score': 0.3,
        'previous_waste': 10 + (i % 10),
        'days_until_expiry': 2
    }
    for i in range(100)
]

surplus_labels = [12 + (i % 10) for i in range(100)]

result = model.train(historical_data, surplus_labels)
print(json.dumps(result, indent=2))

# Save model
model.save_model('models/surplus_model.pkl')
print('✅ Model trained and saved!')
"
```

### 2. Test Predictions

```bash
python -c "
from ml_model import SurplusPredictionModel
import json

model = SurplusPredictionModel()
model.load_model('models/surplus_model.pkl')

test_data = {
    'day_of_week': 1,
    'month': 1,
    'avg_daily_sales': 150,
    'current_inventory': 200,
    'temperature': 22,
    'is_weekend': 0,
    'is_holiday': 0,
    'local_event_score': 0.3,
    'previous_waste': 12,
    'days_until_expiry': 2
}

prediction = model.predict_surplus(test_data)
print(json.dumps(prediction, indent=2, default=str))
"
```

---

## 📚 API Documentation

### Authentication Endpoints

```bash
POST /api/users/register    # Register new user
POST /api/users/login        # Login
GET  /api/users/me           # Get current user
```

### Food Management

```bash
POST   /api/food-items          # Create listing
GET    /api/food-items          # List available food
GET    /api/food-items/{id}     # Get specific item
PUT    /api/food-items/{id}     # Update item
DELETE /api/food-items/{id}     # Delete item
```

### AI Predictions

```bash
GET  /api/predictions/surplus            # Get predictions
POST /api/predictions/analyze            # Analyze patterns
GET  /api/predictions/multi-day?days=7   # Multi-day forecast
```

### Transactions

```bash
POST /api/transactions/reserve/{id}      # Reserve food
GET  /api/transactions                   # List transactions
PUT  /api/transactions/{id}/status       # Update status
POST /api/transactions/{id}/rate         # Rate transaction
```

### Metrics

```bash
GET /api/metrics/impact        # Platform impact
GET /api/metrics/user          # User metrics
```

**Interactive API Documentation:** http://localhost:8000/docs

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest tests/ -v
pytest tests/ -v --cov=.  # With coverage
```

### Frontend Tests

```bash
cd frontend
npm test
npm run test:coverage
```

---

## 🚢 Deployment

### Backend Deployment

**Option 1: Docker**
```bash
docker build -t foodwaste-backend .
docker run -d -p 8000:8000 foodwaste-backend
```

**Option 2: Cloud Platforms**
- **AWS**: Use ECS or Elastic Beanstalk
- **Azure**: Use Container Apps or App Service
- **Google Cloud**: Use Cloud Run
- **Railway/Render**: Direct deployment from GitHub

### Frontend Deployment

**Option 1: Vercel (Recommended)**
```bash
npm run build
vercel deploy
```

**Option 2: Netlify**
```bash
npm run build
netlify deploy --prod --dir=dist
```

**Option 3: AWS S3 + CloudFront**
```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name
```

### Database

Use managed database services:
- **AWS RDS** for MySQL
- **Azure Database** for MySQL
- **Google Cloud SQL**
- **PlanetScale** (serverless MySQL)

---

## 🔍 Troubleshooting

### Common Issues

**Backend won't start:**
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Verify database connection
python -c "from models import engine; print(engine.url)"
```

**Frontend can't connect to backend:**
```bash
# Check CORS settings in main.py
# Verify VITE_API_URL in frontend/.env
```

**Database connection error:**
```bash
# Check MySQL is running
# Windows (XAMPP): Check XAMPP Control Panel
# Docker: docker-compose ps mysql
# Verify credentials in .env file
```

**Module not found errors:**
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

---

## 📱 Access Points

After complete setup:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **phpMyAdmin**: http://localhost:8080 (Docker) or http://localhost/phpmyadmin (XAMPP)
- **MySQL**: localhost:3306

---

## 📊 Project Structure

```
food-waste-network/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Database models
│   ├── ml_model.py          # AI/ML models
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile           # Backend container
│   ├── .env                 # Environment variables
│   ├── scripts/             # Utility scripts
│   │   └── create_admin.py
│   ├── models/              # ML model storage
│   └── tests/               # Backend tests
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main component
│   │   ├── api.js           # API client
│   │   ├── config.js        # Configuration
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   └── utils/           # Utilities
│   ├── Dockerfile           # Frontend container
│   ├── package.json         # npm dependencies
│   ├── nginx.conf           # Nginx config
│   └── .env                 # Environment variables
│
├── docker-compose.yml       # Docker orchestration
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

---

## 🙏 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Email: support@foodwastenetwork.com

