# Database Integration and Real Data Setup Guide

## Overview
The Food Waste Network now uses a proper database to store all data instead of just in-memory storage. This guide explains how to set up and use the real data features.

## 📊 What Data is Now Saved to Database

1. **Recipients/Organizations** - All NGOs, shelters, and food banks
2. **Donations** - Every donation transaction is recorded with:
   - Food item details
   - Recipient information
   - Quantity donated
   - Transaction status
   - Timestamps

3. **Food Items** - Available surplus food listings
4. **Users** - User accounts and profiles
5. **Predictions** - AI-generated waste predictions
6. **Transactions** - Complete donation history

## 🚀 Getting Started

### 1. Set Up Database Connection

Edit your `.env` file (or create one in the `backend/` directory):

```env
# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=password
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/foodwaste
```

### 2. Initialize Database Tables

```bash
cd backend
python -c "from database import init_db; init_db()"
```

### 3. Seed Recipients Data

Run the seed script to populate your database with 15 real NGO and charity organizations:

```bash
cd backend
python seed_recipients.py
```

**Output:**
```
🌱 Seeding recipients into the database...
================================================================================
✅ Successfully seeded 15 recipients into the database!

📋 Seeded Recipients:
--------------------------------------------------------------------------------
  • Hope Shelter                           (shelter      ) - Serves ~150 people
  • Community Food Bank                    (food_bank    ) - Serves ~5000 people
  • Children's Care Center                 (charity      ) - Serves ~200 people
  • Meals on Wheels Program                (ngo          ) - Serves ~800 people
  • Local Food Rescue Network              (ngo          ) - Serves ~3000 people
  • Senior Living Community                (charity      ) - Serves ~300 people
  • Urban Kitchen Culinary School          (ngo          ) - Serves ~150 people
  • Pet Rescue and Animal Shelter          (ngo          ) - Serves ~500 people
  • Community Garden Initiative            (charity      ) - Serves ~400 people
  • School District Food Program           (food_bank    ) - Serves ~10000 people
  • Homeless Outreach Center               (shelter      ) - Serves ~250 people
  • Faith-Based Food Pantry                (ngo          ) - Serves ~600 people
  • Nutrition Support Program              (charity      ) - Serves ~450 people
  • Immigrant Integration Services         (ngo          ) - Serves ~800 people
  • Employee Assistance & Food Program     (food_bank    ) - Serves ~2000 people
--------------------------------------------------------------------------------

✨ Seeding completed successfully!
```

### 4. Start the Backend

```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Start the Frontend

In a new terminal:

```bash
cd frontend
npm install  # if you haven't already
npm run dev
```

## 📱 Using the Feature

### Creating Donations

1. **Add Food Item** - Click "Add Food Item" on the dashboard
2. **Create Donation** - Click "Donate" on a food item in the Available Food list
3. **Select Recipient** - Choose from the dropdown (populated from database)
4. **Enter Quantity** - Specify how much to donate
5. **Submit** - Data is automatically saved to the database

### Real-Time Data Flow

```
Frontend (React)
    ↓
API Endpoints (/api/donations, /api/recipients)
    ↓
FastAPI Backend
    ↓
Database (MySQL/SQLAlchemy)
    ↓
Persistent Storage
```

## 🔌 New API Endpoints

### Get All Recipients
```bash
GET /api/recipients
```
**Response:**
```json
[
  {
    "id": 1,
    "name": "Hope Shelter",
    "type": "shelter",
    "address": "123 Main Street, Downtown",
    "phone": "555-0101",
    "email": "hope@shelteronline.org",
    "people_served": 150
  }
]
```

### Create Donation
```bash
POST /api/donations
```
**Request Body:**
```json
{
  "food_item_id": 1,
  "recipient_id": 2,
  "quantity": 25.5,
  "recipient_name": "Community Food Bank"
}
```

**Response:**
```json
{
  "id": 1,
  "food_id": 1,
  "from_user_id": 1,
  "to_recipient_id": 2,
  "quantity": 25.5,
  "status": "pending",
  "created_at": "2024-02-25T10:30:00"
}
```

## 🔒 Fallback Mechanism

If database connection fails, the system automatically falls back to in-memory storage to ensure the app continues to function. All data will be lost on server restart, but the app won't crash.

Check backend logs for database connection errors:
```
Database query failed: Connection refused
Using fallback data
```

## 🐍 Raw SQL Queries (Advanced)

### View All Donations
```bash
cd backend
python -c "
from database import SessionLocal
from database import Transaction
db = SessionLocal()
donations = db.query(Transaction).all()
for d in donations:
    print(f'Donation {d.id}: {d.quantity}kg from user {d.from_user_id} to {d.to_recipient_id}')
"
```

### Count Recipients by Type
```bash
python -c "
from database import SessionLocal
from database import Recipient
from sqlalchemy import func
db = SessionLocal()
results = db.query(Recipient.type, func.count(Recipient.id)).group_by(Recipient.type).all()
for type_, count in results:
    print(f'{type_}: {count}')
"
```

## 🆘 Troubleshooting

### Issue: "Connection refused"
**Solution**: Ensure MySQL is running
```bash
mysql -u root -p  # Test MySQL connection
```

### Issue: "Table already exists"
**Solution**: Database tables already created, just run seed script
```bash
python seed_recipients.py
```

### Issue: "Recipient not found"
**Solution**: Run the seed script first
```bash
python seed_recipients.py
```

### Issue: 500 Error on Donation
**Check backend logs for:**
- Missing food item ID
- Invalid recipient ID
- Database connection error

## 📈 Real Data Sources

The recipients are based on real types of organizations that would benefit from food donations:

- **Shelters** - Emergency housing, food services
- **Food Banks** - Community food distribution
- **NGOs** - Non-profit organizations with community programs
- **Charities** - Educational and care facilities

The contact information is simulated but represents realistic organization structures.

## 🔄 Updating Seeds

To add more recipients, edit `backend/seed_recipients.py`:

```python
REAL_RECIPIENTS_DATA = [
    {
        'name': 'Your Organization',
        'type': 'ngo',  # or shelter, food_bank, charity
        'address': '123 Main St',
        'phone': '555-1234',
        'email': 'contact@org.org',
        'people_served': 500
    },
    # Add more...
]
```

Then run: `python seed_recipients.py`

## ✅ Success Indicators

When everything is working correctly, you should see:

1. ✅ Recipients dropdown populated with real data
2. ✅ Donations saved in database (table shows "pending" status)
3. ✅ No "Connection refused" errors in backend logs
4. ✅ Multiple donations can be created sequentially
5. ✅ Data persists after page refresh

## 📚 Next Steps

1. **Analytics Dashboard** - View donation statistics and impact
2. **Email Notifications** - Notify recipients of available food
3. **Route Optimization** - Calculate best delivery routes
4. **Predictive Analytics** - AI-powered surplus predictions
5. **Mobile App** - Extend to mobile platforms

---

**Questions?** Check the main README.md or contact the development team.
