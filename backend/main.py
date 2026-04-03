from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime, timedelta
import uvicorn
from enum import Enum
from sqlalchemy.orm import Session
from gemini_service import (
    match_recipients_with_surplus,
    generate_waste_predictions,
    generate_recipe_suggestions,
    chat_with_ai,
    gemini_available
)
from database import SessionLocal, get_db, Base, engine
from database import User as DBUser
from database import FoodItem as DBFoodItem
from database import Recipient as DBRecipient
from database import Transaction as DBTransaction
from database import Prediction as DBPrediction
from database import SessionLocal, get_db, Base, engine, User, FoodItem, Recipient, Transaction, Prediction
from sqlalchemy.orm import Session

# Multi-Agent System
try:
    from agents import get_orchestrator, initialize_agents
    from agents_config import AgentType
    AGENTS_AVAILABLE = True
except ImportError:
    AGENTS_AVAILABLE = False
    print("⚠️  Warning: Agent system not available (some dependencies may be missing)")

# Initialize FastAPI app
app = FastAPI(
    title="AI Food Waste Reduction Network API",
    description="API for connecting surplus food with those in need",
    version="1.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()
security_optional = HTTPBearer(auto_error=False)

# Initialize Multi-Agent System on startup
@app.on_event("startup")
async def startup_event():
    """Initialize agents and services on application startup"""
    # Initialize database tables
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables initialized")
    except Exception as e:
        print(f"⚠️  Warning: Could not initialize database: {str(e)}")
    
    if AGENTS_AVAILABLE:
        try:
            orchestrator = initialize_agents()
            print("✓ Multi-Agent System initialized successfully")
        except Exception as e:
            print(f"⚠️  Warning: Could not initialize agents: {str(e)}")

# Enums
class UserType(str, Enum):
    RESTAURANT = "restaurant"
    STORE = "store"
    FARM = "farm"
    NGO = "ngo"
    SHELTER = "shelter"
    BUYER = "buyer"

class FoodStatus(str, Enum):
    AVAILABLE = "available"
    RESERVED = "reserved"
    COLLECTED = "collected"
    EXPIRED = "expired"

# Pydantic Models
class UserBase(BaseModel):
    email: EmailStr
    name: str
    user_type: UserType
    phone: Optional[str] = None
    address: str
    latitude: float
    longitude: float

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    verified: bool
    is_admin: bool
    is_active: bool
    
    class Config:
        from_attributes = True

class FoodItemResponse(BaseModel):
    id: int
    name: str
    quantity: float
    unit: str
    category: str
    description: Optional[str] = None
    status: str
    created_at: datetime
    expires_at: Optional[datetime] = None
    user_id: int
    
    class Config:
        from_attributes = True

class FoodItemCreate(BaseModel):
    name: str
    quantity: float
    unit: str
    category: str
    expiry_date: datetime
    estimated_value: float
    description: Optional[str] = None
    image_url: Optional[str] = None

class SurplusPrediction(BaseModel):
    provider_id: int
    predicted_date: datetime
    predicted_items: List[dict]
    confidence_score: float
    reasoning: str

class TransactionResponse(BaseModel):
    id: int
    food_id: int
    from_user_id: int
    to_recipient_id: Optional[int] = None
    quantity: float
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ImpactMetrics(BaseModel):
    total_food_saved_kg: float
    total_meals_provided: int
    co2_emissions_saved_kg: float
    money_saved: float
    businesses_connected: int
    ngos_helped: int

class RecipientResponse(BaseModel):
    id: int
    name: str
    type: str
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    people_served: int
    
    class Config:
        from_attributes = True

class RecipientCreate(BaseModel):
    name: str
    type: str = "ngo"
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    people_served: Optional[int] = 0

class DonationCreate(BaseModel):
    food_item_id: int
    recipient_id: int
    quantity: float
    recipient_name: Optional[str] = None  # Allow manual entry as fallback

class DonationResponse(BaseModel):
    id: int
    food_id: int
    from_user_id: int
    to_recipient_id: int
    quantity: float
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# ============================================================================
# Agent-Related Models
# ============================================================================

class AgentTaskRequest(BaseModel):
    agent_type: str
    task_description: str
    context: Optional[dict] = None

class WorkflowRequest(BaseModel):
    workflow_name: str
    input_data: dict

class AgentTaskResponse(BaseModel):
    agent_name: str
    agent_type: str
    task: str
    result: dict
    timestamp: str
    success: bool
    error: Optional[str] = None

class WorkflowResponse(BaseModel):
    workflow: str
    description: str
    started_at: str
    completed_at: Optional[str] = None
    steps: List[dict]
    final_output: Optional[dict] = None
    success: bool
    error: Optional[str] = None

# Mock database (replace with actual database)
users_db = {
    1: {
        'id': 1,
        'email': 'admin@foodwaste.com',
        'name': 'Admin User',
        'user_type': 'restaurant',
        'phone': '555-0000',
        'address': 'Admin Office',
        'latitude': 37.7749,
        'longitude': -122.4194,
        'created_at': datetime.now().isoformat(),
        'verified': True,
        'is_admin': True,
        'is_active': True,
        'password_hash': 'admin123'
    },
    2: {
        'id': 2,
        'email': 'demo@foodwaste.com',
        'name': 'Demo User',
        'user_type': 'restaurant',
        'phone': '555-0001',
        'address': 'Demo Location',
        'latitude': 37.7749,
        'longitude': -122.4194,
        'created_at': datetime.now().isoformat(),
        'verified': True,
        'is_admin': False,
        'is_active': True,
        'password_hash': 'password123'
    }
}
food_items_db = {}
transactions_db = {}
predictions_db = {}
recipients_db = {
    1: {
        'id': 1,
        'name': 'Hope Shelter',
        'type': 'shelter',
        'address': '123 Main St, Downtown',
        'phone': '555-0101',
        'email': 'hope@example.com',
        'people_served': 150
    },
    2: {
        'id': 2,
        'name': 'Community Food Bank',
        'type': 'ngo',
        'address': '456 Oak Ave, Midtown',
        'phone': '555-0102',
        'email': 'food@example.com',
        'people_served': 500
    },
    3: {
        'id': 3,
        'name': 'Children\'s Care Center',
        'type': 'charity',
        'address': '789 Pine Rd, Uptown',
        'phone': '555-0103',
        'email': 'care@example.com',
        'people_served': 200
    }
}

# Authentication helper
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # In production, verify JWT token
    token = credentials.credentials
    if not token:
        raise HTTPException(status_code=401, detail="Invalid authentication")
    
    # Extract user_id from token format: token_<user_id>_<timestamp>
    try:
        parts = token.split('_')
        if len(parts) >= 2 and parts[0] == 'token':
            user_id = int(parts[1])
            return {"user_id": user_id, "user_type": "restaurant"}
    except (ValueError, IndexError):
        pass
    
    raise HTTPException(status_code=401, detail="Invalid token format")

def verify_token_optional(credentials: HTTPAuthorizationCredentials = Depends(security_optional)):
    # Optional token verification - returns mock user if no valid token
    try:
        if credentials and credentials.credentials:
            token = credentials.credentials
            parts = token.split('_')
            if len(parts) >= 2 and parts[0] == 'token':
                user_id = int(parts[1])
                return {"user_id": user_id, "user_type": "restaurant"}
    except (ValueError, IndexError):
        pass
    # Return default user if no token or invalid token
    return {"user_id": 1, "user_type": "restaurant", "is_demo": True}

# Admin dependency function
def admin_required(current_user: dict = Depends(verify_token)):
    """Check if current user is an admin"""
    user_id = current_user['user_id']
    if user_id not in users_db:
        raise HTTPException(status_code=401, detail="User not found")
    user_data = users_db[user_id]
    if not user_data.get('is_admin', False):
        raise HTTPException(status_code=403, detail="Admin access required")
    if not user_data.get('is_active', False):
        raise HTTPException(status_code=403, detail="User account is disabled")
    return current_user

# API Endpoints

@app.get("/")
def root():
    return {
        "message": "AI Food Waste Reduction Network API",
        "version": "1.0.0",
        "docs": "/docs"
    }

# User Management
@app.post("/api/users/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate):
    """Register a new user (business, NGO, or buyer)"""
    try:
        print(f"\n=== REGISTRATION ATTEMPT ===")
        print(f"Email: {user.email}")
        print(f"Name: {user.name}")
        print(f"Password: {user.password}")
        print(f"User Type: {user.user_type}")
        print(f"Phone: {user.phone}")
        print(f"Address: {user.address}")
        print(f"Latitude: {user.latitude}")
        print(f"Longitude: {user.longitude}")
        
        # Check if email already exists
        for existing_user in users_db.values():
            if existing_user.get('email') == user.email:
                print(f"Email already exists: {user.email}")
                raise HTTPException(status_code=400, detail="Email already registered")
        
        user_id = len(users_db) + 1
        user_data = {
            'id': user_id,
            'email': user.email,
            'name': user.name,
            'user_type': user.user_type,
            'phone': user.phone,
            'address': user.address,
            'latitude': user.latitude,
            'longitude': user.longitude,
            'created_at': datetime.now().isoformat(),
            'verified': False,
            'password_hash': user.password  # In production, use proper hashing
        }
        users_db[user_id] = user_data
        
        print(f"✓ User registered successfully with ID: {user_id}")
        print(f"✓ Stored user data: email={user_data['email']}, password_hash={user_data['password_hash']}")
        print(f"✓ Total users in DB: {len(users_db)}")
        print("===========================\n")
        
        # Return user data without password
        response_data = user_data.copy()
        del response_data['password_hash']
        return {
            "success": True,
            "message": "User registered successfully",
            "user": response_data
        }
    except HTTPException as he:
        print(f"✗ Registration failed: {he.detail}")
        raise
    except Exception as e:
        print(f"✗ Unexpected error during registration: {str(e)}")
        print(f"✗ Error type: {type(e).__name__}")
        raise HTTPException(status_code=500, detail=f"Registration error: {str(e)}")

@app.post("/api/users/login")
def login_user(login_data: dict):
    """Authenticate user and return token"""
    email = login_data.get('email')
    password = login_data.get('password')
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    
    # Debug: Print to console
    print(f"\n=== LOGIN ATTEMPT ===")
    print(f"Email: {email}")
    print(f"Password: {password}")
    print(f"Users in DB: {list(users_db.keys())}")
    for uid, udata in users_db.items():
        print(f"  User {uid}: email={udata.get('email')}, password_hash={udata.get('password_hash')}")
    print("===================\n")
    
    # Find user by email
    user_found = None
    for user_id, user_data in users_db.items():
        if user_data.get('email') == email:
            user_found = user_data
            break
    
    if not user_found:
        print(f"User not found with email: {email}")
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # In production, verify password hash
    stored_password = user_found.get('password_hash')
    print(f"Comparing passwords: input='{password}' vs stored='{stored_password}'")
    if stored_password != password:
        print(f"Password mismatch!")
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    print(f"Login successful for {email}")
    
    # Return user data and token
    user_response = user_found.copy()
    if 'password_hash' in user_response:
        del user_response['password_hash']
    
    return {
        "access_token": f"token_{user_found['id']}_{datetime.now().timestamp()}",
        "token_type": "bearer",
        "user": user_response
    }

@app.get("/api/users/all")
def get_all_users(admin_user: dict = Depends(admin_required)):
    """Get all registered users (Admin only)"""
    users_list = []
    for user_id, user_data in users_db.items():
        user_response = user_data.copy()
        if 'password_hash' in user_response:
            del user_response['password_hash']
        users_list.append(user_response)
    
    return {
        "total_users": len(users_list),
        "users": users_list
    }

@app.get("/api/users/count")
def get_user_count():
    """Get count of registered users"""
    return {
        "total_users": len(users_db),
        "users_by_type": {
            "restaurant": len([u for u in users_db.values() if u.get('user_type') == 'restaurant']),
            "store": len([u for u in users_db.values() if u.get('user_type') == 'store']),
            "farm": len([u for u in users_db.values() if u.get('user_type') == 'farm']),
            "ngo": len([u for u in users_db.values() if u.get('user_type') == 'ngo']),
            "shelter": len([u for u in users_db.values() if u.get('user_type') == 'shelter']),
            "buyer": len([u for u in users_db.values() if u.get('user_type') == 'buyer'])
        }
    }

@app.get("/api/debug/users")
def debug_get_all_users(admin_user: dict = Depends(admin_required)):
    """Debug endpoint - Get all users with passwords for testing (Admin only)"""
    users_list = []
    for user_id, user_data in users_db.items():
        users_list.append(user_data)
    
    return {
        "total_users": len(users_list),
        "users": users_list,
        "database_state": "in-memory"
    }

@app.get("/api/users/me", response_model=dict)
def get_current_user(current_user: dict = Depends(verify_token)):
    """Get current user profile"""
    user_id = current_user['user_id']
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    user_data = users_db[user_id].copy()
    if 'password_hash' in user_data:
        del user_data['password_hash']
    return user_data

# Food Item Management
@app.post("/api/food-items", response_model=FoodItemResponse, status_code=status.HTTP_201_CREATED)
def create_food_item(item: FoodItemCreate, current_user: dict = Depends(verify_token_optional), db: Session = Depends(get_db)):
    """Create a new surplus food listing"""
    try:
        new_food_item = DBFoodItem(
            name=item.name,
            quantity=item.quantity,
            unit=item.unit,
            category=item.category,
            description=item.description,
            user_id=current_user.get('user_id', 1),
            status='available',
            created_at=datetime.now(),
            expires_at=item.expiry_date
        )
        db.add(new_food_item)
        db.commit()
        db.refresh(new_food_item)
        print(f"✅ Food item created in MySQL database: ID={new_food_item.id}, Name={new_food_item.name}")
        return new_food_item
    except Exception as e:
        db.rollback()
        print(f"❌ Database error creating food item: {e}")
        # Fallback to in-memory storage
        item_id = len(food_items_db) + 1
        food_data = item.dict()
        food_data['id'] = item_id
        food_data['user_id'] = current_user.get('user_id', 1)
        food_data['status'] = 'available'
        food_data['created_at'] = datetime.now()
        food_items_db[item_id] = food_data
        print(f"⚠️  Stored food item in fallback in-memory database: {food_data}")
        return food_data

@app.get("/api/food-items", response_model=List[FoodItemResponse])
def get_available_food(
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    radius_km: Optional[float] = 10,
    category: Optional[str] = None,
    current_user: dict = Depends(verify_token_optional),
    db: Session = Depends(get_db)
):
    """Get available food items with optional filters"""
    try:
        query = db.query(DBFoodItem).filter(DBFoodItem.status == 'available')
        
        if category:
            query = query.filter(DBFoodItem.category == category)
        
        items = query.limit(20).all()
        print(f"✅ Retrieved {len(items)} available food items from database")
        return items
    except Exception as e:
        print(f"❌ Database error fetching food items: {e}")
        # Fallback to in-memory data
        items = [item for item in food_items_db.values() 
                 if item['status'] == 'available']
        if category:
            items = [item for item in items if item['category'] == category]
        return items[:20]

@app.get("/api/food-items/{item_id}", response_model=FoodItemResponse)
def get_food_item(item_id: int, db: Session = Depends(get_db)):
    """Get specific food item details"""
    try:
        food_item = db.query(DBFoodItem).filter(DBFoodItem.id == item_id).first()
        if not food_item:
            # Check fallback in-memory database
            if item_id in food_items_db:
                return food_items_db[item_id]
            raise HTTPException(status_code=404, detail="Food item not found")
        return food_item
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Database error fetching food item {item_id}: {e}")
        if item_id in food_items_db:
            return food_items_db[item_id]
        raise HTTPException(status_code=404, detail="Food item not found")

# Recipients API
@app.get("/api/recipients", response_model=List[RecipientResponse])
def get_recipients(db: Session = Depends(get_db)):
    """Get all available recipients (NGOs, shelters, food banks, etc.)"""
    try:
        # Get recipients from database
        recipients = db.query(DBRecipient).all()
        if recipients:
            return recipients
    except Exception as e:
        print(f"Database query failed: {e}, using fallback data")
    
    # Fallback to in-memory data if database fails
    recipient_list = []
    for rid, rdata in recipients_db.items():
        recipient_list.append({
            'id': rdata['id'],
            'name': rdata['name'],
            'type': rdata['type'],
            'address': rdata.get('address'),
            'phone': rdata.get('phone'),
            'email': rdata.get('email'),
            'people_served': rdata.get('people_served', 0)
        })
    return recipient_list

# Add new recipient
@app.post("/api/recipients", response_model=RecipientResponse, status_code=status.HTTP_201_CREATED)
def create_recipient(
    recipient_data: RecipientCreate,
    db: Session = Depends(get_db)
):
    """Add a new recipient organization"""
    try:
        new_recipient = DBRecipient(
            name=recipient_data.name,
            type=recipient_data.type,
            address=recipient_data.address,
            phone=recipient_data.phone,
            email=recipient_data.email,
            people_served=recipient_data.people_served
        )
        db.add(new_recipient)
        db.commit()
        db.refresh(new_recipient)
        return new_recipient
    except Exception as e:
        db.rollback()
        print(f"Error creating recipient: {e}")
        # Fallback: add to in-memory storage
        new_id = max([r['id'] for r in recipients_db.values()] or [0]) + 1
        recipients_db[new_id] = {
            'id': new_id,
            'name': recipient_data.name,
            'type': recipient_data.type,
            'address': recipient_data.address,
            'phone': recipient_data.phone,
            'email': recipient_data.email,
            'people_served': recipient_data.people_served
        }
        return recipients_db[new_id]

# Donations API
@app.post("/api/donations", response_model=DonationResponse, status_code=status.HTTP_201_CREATED)
def create_donation(
    donation: DonationCreate,
    current_user: dict = Depends(verify_token_optional),
    db: Session = Depends(get_db)
):
    """Create a donation/transaction and save to database"""
    try:
        # Verify food item exists
        food_item = db.query(DBFoodItem).filter(DBFoodItem.id == donation.food_item_id).first()
        if not food_item:
            raise HTTPException(status_code=404, detail="Food item not found")
        
        # Verify recipient exists
        recipient = db.query(DBRecipient).filter(DBRecipient.id == donation.recipient_id).first()
        if not recipient:
            raise HTTPException(status_code=404, detail="Recipient not found")
        
        # Create transaction
        transaction = DBTransaction(
            food_id=donation.food_item_id,
            from_user_id=current_user.get('user_id', 1),
            to_recipient_id=donation.recipient_id,
            quantity=donation.quantity,
            status='pending',
            created_at=datetime.now()
        )
        
        db.add(transaction)
        db.commit()
        db.refresh(transaction)
        
        return transaction
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        # Fallback: store in mock database
        transaction_id = len(transactions_db) + 1
        transaction = {
            "id": transaction_id,
            "food_id": donation.food_item_id,
            "from_user_id": current_user.get('user_id', 1),
            "to_recipient_id": donation.recipient_id,
            "quantity": donation.quantity,
            "status": "pending",
            "created_at": datetime.now()
        }
        transactions_db[transaction_id] = transaction
        print(f"Stored donation in fallback database: {e}")
        return transaction

# AI Predictions
@app.get("/api/predictions/surplus", response_model=List[SurplusPrediction])
def get_surplus_predictions(current_user: dict = Depends(verify_token_optional)):
    """Get AI predictions for surplus food"""
    # Mock prediction - in production, use actual ML model
    predictions = [
        {
            "provider_id": current_user['user_id'],
            "predicted_date": datetime.now() + timedelta(days=1),
            "predicted_items": [
                {"name": "Fresh Vegetables", "quantity": 15, "unit": "kg"},
                {"name": "Bread", "quantity": 20, "unit": "loaves"}
            ],
            "confidence_score": 0.87,
            "reasoning": "Based on historical patterns and current inventory levels"
        }
    ]
    return predictions

@app.post("/api/predictions/analyze")
def analyze_waste_pattern(
    start_date: datetime,
    end_date: datetime,
    current_user: dict = Depends(verify_token)
):
    """Analyze waste patterns and get recommendations"""
    # Mock analysis - integrate actual ML model
    return {
        "total_waste": 150.5,
        "waste_by_category": {
            "vegetables": 45.2,
            "dairy": 30.5,
            "bakery": 74.8
        },
        "recommendations": [
            "Reduce bread production on Mondays by 15%",
            "Offer discounts on vegetables 2 days before expiry"
        ],
        "potential_savings": 1250.00
    }

# Matching API
@app.get("/api/matching/recommended")
def get_recommended_recipients(current_user: dict = Depends(verify_token_optional)):
    """Get recommended recipients for food items with AI-powered matching"""
    # Mock data for NGOs and shelters with AI scoring
    base_recipients = [
        {
            "id": 1,
            "name": "Hope Shelter",
            "type": "shelter",
            "user_type": "shelter",
            "address": "123 Main St, Downtown",
            "latitude": 40.7128,
            "longitude": -74.0060,
            "distance": 2.3,
            "people_served": 150,
            "urgency": "high",
            "rating": 4.8,
            "phone": "+1-555-0101",
            "email": "info@hopeshelter.org",
            "specializations": ["prepared meals", "ready-to-eat foods"],
            "operational_hours": "24/7",
            "languages": ["English", "Spanish"],
            "recent_donations": 12,
            "capacity_status": "80% full"
        },
        {
            "id": 2,
            "name": "Community Food Bank",
            "type": "ngo",
            "user_type": "ngo",
            "address": "456 Oak Ave, Midtown",
            "latitude": 40.7580,
            "longitude": -73.9855,
            "distance": 1.8,
            "people_served": 500,
            "urgency": "medium",
            "rating": 4.9,
            "phone": "+1-555-0102",
            "email": "donations@communityfoodbank.org",
            "specializations": ["vegetables", "dairy", "bakery"],
            "operational_hours": "Mon-Fri 8AM-6PM",
            "languages": ["English", "Spanish", "Mandarin"],
            "recent_donations": 45,
            "capacity_status": "60% full"
        },
        {
            "id": 3,
            "name": "Kids First Foundation",
            "type": "ngo",
            "user_type": "ngo",
            "address": "789 Pine Road, Uptown",
            "latitude": 40.7614,
            "longitude": -73.9776,
            "distance": 3.2,
            "people_served": 200,
            "urgency": "high",
            "rating": 4.7,
            "phone": "+1-555-0103",
            "email": "support@kidsfirst.org",
            "specializations": ["fruits", "vegetables", "dairy", "whole grains"],
            "operational_hours": "Tue-Sat 10AM-4PM",
            "languages": ["English"],
            "recent_donations": 28,
            "capacity_status": "45% full"
        },
        {
            "id": 4,
            "name": "Elder Care Center",
            "type": "shelter",
            "user_type": "shelter",
            "address": "321 Elm Street, Westside",
            "latitude": 40.7489,
            "longitude": -74.0008,
            "distance": 4.1,
            "people_served": 80,
            "urgency": "medium",
            "rating": 4.6,
            "phone": "+1-555-0104",
            "email": "donations@eldercare.org",
            "specializations": ["soft foods", "prepared meals", "dairy"],
            "operational_hours": "24/7",
            "languages": ["English"],
            "recent_donations": 8,
            "capacity_status": "55% full"
        }
    ]
    
    # AI scoring: Calculate match score based on available food and recipient preferences
    available_food_categories = set()
    for food in food_items_db.values():
        available_food_categories.add(food.get("category", "other").lower())
    
    # Score recipients based on specializations match and urgency
    scored_recipients = []
    for recipient in base_recipients:
        match_score = 0
        matched_specializations = []
        
        # Check specialization matches
        for spec in recipient.get("specializations", []):
            if any(cat in spec.lower() for cat in available_food_categories):
                match_score += 25
                matched_specializations.append(spec)
        
        # Boost score for high urgency recipients
        if recipient.get("urgency") == "high":
            match_score += 15
        
        # Boost score for highly rated recipients
        rating = recipient.get("rating", 0)
        match_score += min(rating, 5) * 5
        
        # Factor in recent donation activity
        recent = recipient.get("recent_donations", 0)
        match_score += min(recent / 50 * 10, 10)
        
        # Boost score for lower distance
        distance = recipient.get("distance", 100)
        match_score += max(20 - (distance * 2), 0)
        
        recipient["match_score"] = min(100, match_score)
        recipient["matched_specializations"] = matched_specializations
        scored_recipients.append(recipient)
    
    # Sort by match score (highest first)
    scored_recipients.sort(key=lambda x: x["match_score"], reverse=True)
    
    return scored_recipients

# Transactions & Matching
@app.post("/api/transactions/reserve/{item_id}")
def reserve_food_item(item_id: int, current_user: dict = Depends(verify_token)):
    """Reserve a food item for pickup"""
    if item_id not in food_items_db:
        raise HTTPException(status_code=404, detail="Food item not found")
    
    item = food_items_db[item_id]
    if item['status'] != 'available':
        raise HTTPException(status_code=400, detail="Item not available")
    
    transaction_id = len(transactions_db) + 1
    transaction = {
        "id": transaction_id,
        "food_item_id": item_id,
        "provider_id": item['provider_id'],
        "receiver_id": current_user['user_id'],
        "quantity": item['quantity'],
        "transaction_fee": item['estimated_value'] * 0.03,  # 3% fee
        "status": "reserved",
        "scheduled_pickup": datetime.now() + timedelta(hours=2),
        "actual_pickup": None,
        "created_at": datetime.now()
    }
    
    transactions_db[transaction_id] = transaction
    item['status'] = 'reserved'
    
    return transaction

@app.get("/api/transactions", response_model=List[TransactionResponse])
def get_transactions(current_user: dict = Depends(verify_token)):
    """Get user's transaction history"""
    user_id = current_user['user_id']
    user_transactions = [
        t for t in transactions_db.values()
        if t['provider_id'] == user_id or t['receiver_id'] == user_id
    ]
    return user_transactions

# Impact Metrics
@app.get("/api/metrics/impact", response_model=ImpactMetrics)
def get_impact_metrics(current_user: dict = Depends(verify_token_optional)):
    """Get overall impact metrics"""
    # Calculate from transactions
    return {
        "total_food_saved_kg": len(food_items_db) * 5,  # Dynamic calculation
        "total_meals_provided": len(food_items_db) * 15,
        "co2_emissions_saved_kg": len(food_items_db) * 15,
        "money_saved": len(food_items_db) * 50,
        "businesses_connected": 156,
        "ngos_helped": 43
    }

@app.get("/api/metrics/user")
def get_user_metrics(current_user: dict = Depends(verify_token_optional)):
    """Get user-specific metrics"""
    return {
        "food_donated_kg": 245.5,
        "meals_provided": 818,
        "co2_saved_kg": 736.5,
        "cost_savings": 1950.00,
        "tax_deduction_eligible": 2450.00,
        "connections_made": 12
    }

# Logistics Optimization
@app.post("/api/logistics/optimize-route")
def optimize_delivery_route(pickup_locations: List[dict], delivery_location: dict):
    """Optimize delivery route for multiple pickups"""
    # Mock optimization - integrate actual routing algorithm
    return {
        "optimized_route": pickup_locations,
        "total_distance_km": 15.5,
        "estimated_time_minutes": 45,
        "fuel_cost": 12.50,
        "co2_emissions_kg": 3.2
    }

# ==================== GEMINI AI ENDPOINTS ====================

@app.get("/api/ai/status")
def ai_status():
    """Check if Gemini AI is available"""
    return {
        "gemini_available": gemini_available,
        "message": "Gemini AI is " + ("available" if gemini_available else "not configured")
    }

@app.post("/api/ai/match-recipients")
def ai_match_recipients(surplus_food: dict, recipient_ids: Optional[List[int]] = None):
    """
    Use Gemini AI to match surplus food with best recipients
    
    Example request:
    {
        "surplus_food": {
            "item": "tomatoes",
            "quantity": 50,
            "unit": "kg",
            "category": "vegetables",
            "description": "Fresh tomatoes from farm"
        },
        "recipient_ids": [2, 3, 5]
    }
    """
    if not gemini_available:
        return {
            "error": "Gemini AI not configured",
            "message": "Please set GEMINI_API_KEY environment variable",
            "matches": []
        }
    
    # Get selected recipients from database
    selected_recipients = []
    if recipient_ids:
        for rid in recipient_ids:
            if rid in recipients_db:
                selected_recipients.append({
                    "id": rid,
                    "name": recipients_db[rid].get("name"),
                    "type": recipients_db[rid].get("type"),
                    "location": recipients_db[rid].get("address")
                })
    
    if not selected_recipients:
        # Use all recipients if none specified
        selected_recipients = [
            {"id": rid, "name": r.get("name"), "type": r.get("type"), "location": r.get("address")}
            for rid, r in recipients_db.items()
        ]
    
    result = match_recipients_with_surplus(surplus_food, selected_recipients)
    return result

@app.post("/api/ai/waste-predictions")
def ai_waste_predictions(days_history: int = 30):
    """
    Use Gemini AI to analyze waste trends and predict future waste
    """
    if not gemini_available:
        return {
            "error": "Gemini AI not configured",
            "predictions": "Please set GEMINI_API_KEY environment variable",
            "recommendations": []
        }
    
    # Get historical food data
    historical = []
    for food_id, food in food_items_db.items():
        historical.append({
            "item": food.get("item"),
            "quantity": food.get("quantity"),
            "status": food.get("status"),
            "created_at": food.get("created_at"),
            "category": food.get("category")
        })
    
    result = generate_waste_predictions(historical)
    return result

@app.post("/api/ai/recipes")
def ai_recipe_suggestions(food_item: str, quantity: str):
    """
    Use Gemini AI to suggest recipes and creative uses for food
    
    Example: /api/ai/recipes?food_item=tomatoes&quantity=50kg
    """
    if not gemini_available:
        return {
            "error": "Gemini AI not configured",
            "message": "Please set GEMINI_API_KEY environment variable",
            "recipes": []
        }
    
    result = generate_recipe_suggestions(food_item, quantity)
    return result

@app.post("/api/ai/chat")
def ai_chat(message: str, user_context: Optional[str] = None):
    """
    Chat with Gemini AI for general questions about food waste reduction
    
    Example: /api/ai/chat?message=How can I reduce food waste?
    """
    if not gemini_available:
        return {
            "error": "Gemini AI not configured",
            "message": "Please set GEMINI_API_KEY environment variable",
            "response": ""
        }
    
    response = chat_with_ai(message, user_context)
    return {
        "message": message,
        "response": response,
        "timestamp": datetime.now().isoformat()
    }

# ==================== ADMIN USER MANAGEMENT ENDPOINTS ====================

@app.get("/api/admin/users")
def get_admin_users(admin_user: dict = Depends(admin_required)):
    """Get all users for admin panel (Admin only)"""
    users_list = []
    for user_id, user_data in users_db.items():
        user_response = user_data.copy()
        if 'password_hash' in user_response:
            del user_response['password_hash']
        users_list.append(user_response)
    
    return {
        "total_users": len(users_list),
        "users": sorted(users_list, key=lambda x: x['id'])
    }

@app.get("/api/admin/users/{user_id}")
def get_admin_user(user_id: int, admin_user: dict = Depends(admin_required)):
    """Get specific user details for admin (Admin only)"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = users_db[user_id].copy()
    if 'password_hash' in user_data:
        del user_data['password_hash']
    return user_data

@app.put("/api/admin/users/{user_id}")
def edit_user(
    user_id: int,
    updates: dict,
    admin_user: dict = Depends(admin_required)
):
    """Edit user details (Admin only)"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = users_db[user_id]
    
    # Allowed fields to update
    allowed_fields = ['name', 'email', 'phone', 'address', 'user_type']
    
    for field in allowed_fields:
        if field in updates and updates[field] is not None:
            user_data[field] = updates[field]
    
    return {
        "message": "User updated successfully",
        "user": {k: v for k, v in user_data.items() if k != 'password_hash'}
    }

@app.delete("/api/admin/users/{user_id}")
def delete_user(user_id: int, admin_user: dict = Depends(admin_required)):
    """Delete a user (Admin only)"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent deleting the admin user itself
    if user_id == admin_user['user_id']:
        raise HTTPException(status_code=400, detail="Cannot delete your own admin account")
    
    deleted_user = users_db.pop(user_id)
    return {
        "message": f"User {deleted_user['email']} deleted successfully",
        "user_id": user_id
    }

@app.put("/api/admin/users/{user_id}/toggle-access")
def toggle_user_access(user_id: int, admin_user: dict = Depends(admin_required)):
    """Enable/disable user access (revoke or grant) (Admin only)"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent disabling admin account
    if user_id == admin_user['user_id']:
        raise HTTPException(status_code=400, detail="Cannot disable your own admin account")
    
    user_data = users_db[user_id]
    user_data['is_active'] = not user_data.get('is_active', True)
    
    status = "enabled" if user_data['is_active'] else "disabled"
    return {
        "message": f"User access {status}",
        "user_id": user_id,
        "is_active": user_data['is_active']
    }

@app.put("/api/admin/users/{user_id}/toggle-admin")
def toggle_user_admin(user_id: int, admin_user: dict = Depends(admin_required)):
    """Grant or revoke admin role (Admin only)"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent removing admin from yourself
    if user_id == admin_user['user_id']:
        raise HTTPException(status_code=400, detail="Cannot revoke your own admin role")
    
    user_data = users_db[user_id]
    user_data['is_admin'] = not user_data.get('is_admin', False)
    
    role = "promoted to" if user_data['is_admin'] else "demoted from"
    return {
        "message": f"User {role} admin role",
        "user_id": user_id,
        "is_admin": user_data['is_admin']
    }

# ============================================================================
# MULTI-AGENT SYSTEM ENDPOINTS
# ============================================================================

@app.post("/api/agents/execute", response_model=AgentTaskResponse)
def execute_agent_task(request: AgentTaskRequest):
    """
    Execute a task using a specific agent
    
    Agents available:
    - waste_prediction: Analyzes food waste patterns and predicts surplus
    - matching: Matches food with recipients intelligently
    - recipe: Generates recipes and utilization suggestions
    - logistics: Handles scheduling and logistics optimization
    - impact: Tracks environmental and social impact
    - coordinator: Orchestrates other agents for complex problems
    """
    if not AGENTS_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Agent system not available"
        )
    
    try:
        orchestrator = get_orchestrator()
        
        # Validate agent type
        try:
            agent_type = AgentType[request.agent_type.upper()]
        except KeyError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid agent type. Available: {[a.value for a in AgentType]}"
            )
        
        # Execute agent task
        response = orchestrator.execute_agent_task(
            agent_type=agent_type,
            task_description=request.task_description,
            context=request.context or {}
        )
        
        return response
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent execution error: {str(e)}")

@app.post("/api/agents/workflow", response_model=WorkflowResponse)
def execute_workflow(request: WorkflowRequest):
    """
    Execute a predefined workflow using multiple agents
    
    Available workflows:
    - food_surplus_workflow: Complete workflow for processing surplus food
    - impact_analysis_workflow: Analyze and report on network impact
    - optimization_workflow: Optimize network operations
    """
    if not AGENTS_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Agent system not available"
        )
    
    try:
        orchestrator = get_orchestrator()
        
        result = orchestrator.execute_workflow(
            workflow_name=request.workflow_name,
            input_data=request.input_data
        )
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result.get("message", "Workflow error"))
        
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Workflow execution error: {str(e)}")

@app.get("/api/agents/info")
def get_agents_info():
    """Get information about all agents and their capabilities"""
    if not AGENTS_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Agent system not available"
        )
    
    try:
        orchestrator = get_orchestrator()
        return orchestrator.get_agent_info()
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving agent info: {str(e)}")

@app.get("/api/agents/history")
def get_agent_history(limit: int = 10):
    """Get recent agent execution history"""
    if not AGENTS_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Agent system not available"
        )
    
    try:
        orchestrator = get_orchestrator()
        return {
            "total_executions": len(orchestrator.execution_history),
            "recent_executions": orchestrator.get_execution_history(limit)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving history: {str(e)}")

@app.post("/api/agents/predict-waste")
def predict_waste_with_agent(data: dict):
    """
    Use waste prediction agent to analyze historical data and predict surplus
    
    Example input:
    {
        "historical_data": [
            {"date": "2024-01-01", "category": "vegetables", "quantity": 10},
            {"date": "2024-01-02", "category": "vegetables", "quantity": 12}
        ],
        "days_ahead": 7
    }
    """
    if not AGENTS_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Agent system not available"
        )
    
    try:
        orchestrator = get_orchestrator()
        
        response = orchestrator.execute_agent_task(
            agent_type=AgentType.WASTE_PREDICTION,
            task_description="Analyze historical food waste data and predict surplus for upcoming period",
            context=data
        )
        
        return response.dict()
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/api/agents/match-recipients")
def match_food_with_recipients(data: dict):
    """
    Use matching agent to find best recipients for surplus food
    
    Example input:
    {
        "food_item": {
            "name": "Vegetables",
            "quantity": 50,
            "unit": "kg",
            "category": "produce",
            "expiry_hours": 24
        },
        "recipient_pool": [
            {
                "id": 1,
                "name": "Hope Shelter",
                "distance": 5,
                "capacity_kg": 100,
                "preferred_categories": ["produce", "dairy"]
            }
        ]
    }
    """
    if not AGENTS_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Agent system not available"
        )
    
    try:
        orchestrator = get_orchestrator()
        
        response = orchestrator.execute_agent_task(
            agent_type=AgentType.MATCHING,
            task_description="Match surplus food with best recipients to maximize impact",
            context=data
        )
        
        return response.dict()
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matching error: {str(e)}")

@app.post("/api/agents/generate-recipes")
def generate_recipes_with_agent(data: dict):
    """
    Use recipe agent to generate utilization suggestions for surplus food
    
    Example input:
    {
        "food_items": ["tomatoes", "onions", "garlic"],
        "quantity_kg": 50
    }
    """
    if not AGENTS_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Agent system not available"
        )
    
    try:
        orchestrator = get_orchestrator()
        
        response = orchestrator.execute_agent_task(
            agent_type=AgentType.RECIPE,
            task_description="Generate creative recipes and utilization suggestions for surplus food",
            context=data
        )
        
        return response.dict()
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recipe generation error: {str(e)}")

@app.post("/api/agents/calculate-impact")
def calculate_impact_with_agent(data: dict):
    """
    Use impact agent to calculate environmental and social impact
    
    Example input:
    {
        "transaction": {
            "id": 1,
            "item_name": "Vegetables",
            "quantity": 50
        }
    }
    """
    if not AGENTS_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Agent system not available"
        )
    
    try:
        orchestrator = get_orchestrator()
        
        response = orchestrator.execute_agent_task(
            agent_type=AgentType.IMPACT,
            task_description="Calculate environmental and social impact of food waste reduction",
            context=data
        )
        
        return response.dict()
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Impact calculation error: {str(e)}")

@app.post("/api/agents/optimize-logistics")
def optimize_logistics_with_agent(data: dict):
    """
    Use logistics agent to optimize pickup and delivery routes
    
    Example input:
    {
        "food_item": {"id": 1, "location": "Restaurant A"},
        "recipient": {"id": 1, "location": "Shelter B"}
    }
    """
    if not AGENTS_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Agent system not available"
        )
    
    try:
        orchestrator = get_orchestrator()
        
        response = orchestrator.execute_agent_task(
            agent_type=AgentType.LOGISTICS,
            task_description="Schedule pickup and optimize delivery logistics",
            context=data
        )
        
        return response.dict()
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Logistics optimization error: {str(e)}")

# =================== DYNAMIC BENEFITS ENDPOINTS ===================

@app.get("/api/benefits/testimonials")
def get_testimonials(user_type: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Get dynamic testimonials based on user type
    - Providers see impact testimonials from recipients
    - Recipients see success testimonials from other recipients
    """
    try:
        # These would be fetched from a Testimonials table in production
        # For now, we'll generate contextual testimonials based on user type
        
        all_testimonials = {
            "provider": [
                {
                    "org": "Hope Shelter",
                    "people": 45,
                    "quote": "The donations from your business helped us serve 1,200+ meals this quarter.",
                    "icon": "🏠",
                    "verified": True
                },
                {
                    "org": "Community Food Bank",
                    "people": 120,
                    "quote": "Your consistent donations reduce our operating costs by 15% monthly.",
                    "icon": "🏦",
                    "verified": True
                },
                {
                    "org": "Youth Center",
                    "people": 85,
                    "quote": "Thanks to partners like you, we feed 300+ kids after school programs.",
                    "icon": "👶",
                    "verified": True
                },
                {
                    "org": "Senior Living Facility",
                    "people": 120,
                    "quote": "Your donations improved nutrition for our most vulnerable residents.",
                    "icon": "👴",
                    "verified": True
                }
            ],
            "recipient": [
                {
                    "org": "Our Program",
                    "people": 45,
                    "quote": "Receiving surplus food allowed us to expand our program to 3 new neighborhoods.",
                    "icon": "📈",
                    "verified": True
                },
                {
                    "org": "Client Success",
                    "people": 120,
                    "quote": "The variety and quality of food we receive helps us provide better nutrition education.",
                    "icon": "🎓",
                    "verified": True
                },
                {
                    "org": "Cost Savings",
                    "people": 85,
                    "quote": "We've redirected food purchase budget to other critical programs.",
                    "icon": "💚",
                    "verified": True
                },
                {
                    "org": "Sustainability",
                    "people": 120,
                    "quote": "Reducing food waste while feeding families - that's real impact.",
                    "icon": "♻️",
                    "verified": True
                }
            ]
        }
        
        requested_testimonials = all_testimonials.get(user_type, all_testimonials["provider"])
        return {"testimonials": requested_testimonials}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching testimonials: {str(e)}")

@app.get("/api/benefits/tips")
def get_personalized_tips(credentials: HTTPAuthorizationCredentials = Depends(security_optional), db: Session = Depends(get_db)):
    """
    Get personalized tips based on user's activity and profile
    """
    try:
        tips = {
            "provider": [
                {
                    "title": "Maximize Tax Benefits",
                    "description": "Keep detailed records of donations. FMV (Fair Market Value) documentation increases deductions.",
                    "priority": "high",
                    "icon": "📋"
                },
                {
                    "title": "Schedule Regular Pickups",
                    "description": "Consistent donations help recipients plan better. Set up recurring pickup times.",
                    "priority": "high",
                    "icon": "📅"
                },
                {
                    "title": "Share Your Impact Story",
                    "description": "Post about your donations on social media. Build brand reputation while inspiring others.",
                    "priority": "medium",
                    "icon": "📱"
                },
                {
                    "title": "Track Waste Patterns",
                    "description": "Use our analytics to identify when surplus happens most. Plan donations accordingly.",
                    "priority": "medium",
                    "icon": "📊"
                },
                {
                    "title": "Categorize Properly",
                    "description": "Accurate food categories help AI matching find the best recipients faster.",
                    "priority": "low",
                    "icon": "🏷️"
                }
            ],
            "recipient": [
                {
                    "title": "Plan Weekly Menus",
                    "description": "Set up recurring food requests to match available donations. It helps donors plan better.",
                    "priority": "high",
                    "icon": "🍽️"
                },
                {
                    "title": "Send Feedback to Donors",
                    "description": "Tell donors how their food is being used. Recognition drives more donations.",
                    "priority": "high",
                    "icon": "💌"
                },
                {
                    "title": "Use Your Analytics Dashboard",
                    "description": "Track food intake patterns to improve your program planning and budgeting.",
                    "priority": "medium",
                    "icon": "📈"
                },
                {
                    "title": "Optimize Pickup Times",
                    "description": "Coordinate pickups during your staff availability. It makes operations smoother.",
                    "priority": "medium",
                    "icon": "⏰"
                },
                {
                    "title": "Explore AI Matching",
                    "description": "Let our AI find donors that match your food needs. Better matches = more reliable supply.",
                    "priority": "low",
                    "icon": "🤖"
                }
            ]
        }
        
        # Get user type from token if available
        user_type = "provider"  # Default
        if credentials:
            try:
                user = db.query(User).filter(User.email == "demo@user.com").first()
                if user:
                    user_type = user.user_type
            except:
                pass
        
        requested_tips = tips.get(user_type, tips["provider"])
        return {"tips": requested_tips}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tips: {str(e)}")

@app.get("/api/benefits/success-stories")
def get_success_stories(user_type: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Get success stories from users similar to the requester
    """
    try:
        stories = {
            "provider": [
                {
                    "title": "Restaurant Saves $8,000 Annually",
                    "description": "A mid-size restaurant donated 2.5 tons of surplus food, saving on disposal and earning tax benefits.",
                    "metrics": {"donations": "2.5 tons", "taxBenefit": "$8,000", "timeframe": "1 year"},
                    "icon": "🍽️"
                },
                {
                    "title": "Grocery Store Builds Community Trust",
                    "description": "Weekly donations positioned store as community leader, attracting 200+ new customers.",
                    "metrics": {"donations": "50 tons", "impact": "200+ new customers", "timeframe": "6 months"},
                    "icon": "🏪"
                },
                {
                    "title": "Farm Reduces Waste by 40%",
                    "description": "Through surplus sharing, farm reduced disposal costs and improved public relations.",
                    "metrics": {"wasteReduced": "40%", "costSavings": "$12,000", "timeframe": "1 year"},
                    "icon": "🌾"
                }
            ],
            "recipient": [
                {
                    "title": "Shelter Serves 500% More Meals",
                    "description": "By accessing surplus food, shelter increased meal capacity without budget increase.",
                    "metrics": {"mealsIncrease": "500%", "beneficiaries": "450", "timeframe": "1 year"},
                    "icon": "🍲"
                },
                {
                    "title": "School Program Expands to 5 Schools",
                    "description": "Food surplus donations enabled expansion of nutrition program across district.",
                    "metrics": {"budgetSaved": "$45,000", "schoolsServing": "5", "students": "1,200"},
                    "icon": "🏫"
                },
                {
                    "title": "NGO Improves Nutrition Quality",
                    "description": "Consistent food donations improved nutrition diversity for vulnerable populations.",
                    "metrics": {"quality": "Improved", "recipients": "800", "satisfaction": "94%"},
                    "icon": "❤️"
                }
            ]
        }
        
        requested_stories = stories.get(user_type, stories["provider"])
        return {"stories": requested_stories}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching success stories: {str(e)}")

@app.get("/api/benefits/personalization")
def get_personalization_data(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    """
    Get personalization data based on user's actual activity
    Calculates dynamic insights specific to this user
    """
    try:
        # Extract user info from token (simplified)
        user_type = "provider"
        total_donations = 0
        
        # Get all transactions for this user to calculate metrics
        transactions = db.query(Transaction).all()
        
        for trans in transactions:
            # Parse quantity (format: "X kg")
            qty_str = str(trans.quantity).split()[0] if trans.quantity else "0"
            try:
                total_donations += float(qty_str)
            except:
                pass
        
        personalization = {
            "level": "Experienced" if total_donations > 500 else "Growing" if total_donations > 100 else "Starter",
            "nextMilestone": 1000 if total_donations < 1000 else 5000,
            "progressToMilestone": min(100, int((total_donations / (1000 if total_donations < 1000 else 5000)) * 100)),
            "badge": "🏆" if total_donations > 500 else "⭐" if total_donations > 100 else "🌱",
            "badgeText": "Sustainability Champion" if total_donations > 500 else "Community Partner" if total_donations > 100 else "Getting Started",
            "recommendations": [
                "Increase donation frequency to unlock 'Consistent Partner' badge",
                "Share your impact story to inspire other organizations",
                "Explore AI predictions to minimize future donations"
            ] if user_type == "provider" else [
                "Build relationships with top donors for better supply consistency",
                "Use analytics to optimize your program efficiency",
                "Send thank you messages to increase donor loyalty"
            ]
        }
        
        return personalization
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching personalization data: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)