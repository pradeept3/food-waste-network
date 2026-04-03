from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Enum, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

class UserType(enum.Enum):
    RESTAURANT = "restaurant"
    STORE = "store"
    FARM = "farm"
    NGO = "ngo"
    SHELTER = "shelter"
    BUYER = "buyer"

class FoodStatus(enum.Enum):
    AVAILABLE = "available"
    RESERVED = "reserved"
    COLLECTED = "collected"
    EXPIRED = "expired"

class TransactionStatus(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    IN_TRANSIT = "in_transit"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    user_type = Column(Enum(UserType), nullable=False)
    phone = Column(String)
    address = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    verified = Column(Boolean, default=False)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Business-specific fields
    business_name = Column(String)
    business_license = Column(String)
    capacity_kg = Column(Float)
    operating_hours = Column(Text)
    
    # Relationships
    food_items = relationship("FoodItem", back_populates="provider", foreign_keys="FoodItem.provider_id")
    provided_transactions = relationship("Transaction", back_populates="provider", foreign_keys="Transaction.provider_id")
    received_transactions = relationship("Transaction", back_populates="receiver", foreign_keys="Transaction.receiver_id")
    preferences = relationship("UserPreference", back_populates="user", uselist=False)
    notifications = relationship("Notification", back_populates="user")

class UserPreference(Base):
    __tablename__ = "user_preferences"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    # Food preferences
    preferred_categories = Column(Text)  # JSON array
    min_quantity = Column(Float)
    max_distance_km = Column(Float, default=25)
    
    # Notification preferences
    email_notifications = Column(Boolean, default=True)
    sms_notifications = Column(Boolean, default=False)
    push_notifications = Column(Boolean, default=True)
    
    # Availability schedule
    pickup_days = Column(Text)  # JSON array of days
    pickup_time_start = Column(String)
    pickup_time_end = Column(String)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="preferences")

class FoodItem(Base):
    __tablename__ = "food_items"
    
    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    name = Column(String, nullable=False)
    description = Column(Text)
    category = Column(String, nullable=False, index=True)
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False)
    
    estimated_value = Column(Float)
    status = Column(Enum(FoodStatus), default=FoodStatus.AVAILABLE, index=True)
    
    # Dates
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    expiry_date = Column(DateTime, nullable=False, index=True)
    reserved_at = Column(DateTime)
    collected_at = Column(DateTime)
    
    # Location
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    pickup_instructions = Column(Text)
    
    # Media
    image_url = Column(String)
    
    # Quality indicators
    freshness_score = Column(Float)  # 0-1 scale
    quality_notes = Column(Text)
    
    # Relationships
    provider = relationship("User", back_populates="food_items", foreign_keys=[provider_id])
    transactions = relationship("Transaction", back_populates="food_item")

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    food_item_id = Column(Integer, ForeignKey("food_items.id"), nullable=False)
    provider_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    quantity = Column(Float, nullable=False)
    transaction_fee = Column(Float, default=0)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.PENDING, index=True)
    
    # Scheduling
    scheduled_pickup = Column(DateTime, nullable=False)
    actual_pickup = Column(DateTime)
    estimated_delivery = Column(DateTime)
    actual_delivery = Column(DateTime)
    
    # Logistics
    distance_km = Column(Float)
    estimated_co2_saved = Column(Float)
    
    # Notes
    provider_notes = Column(Text)
    receiver_notes = Column(Text)
    cancellation_reason = Column(Text)
    
    # Ratings
    provider_rating = Column(Integer)  # 1-5
    receiver_rating = Column(Integer)  # 1-5
    
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    food_item = relationship("FoodItem", back_populates="transactions")
    provider = relationship("User", back_populates="provided_transactions", foreign_keys=[provider_id])
    receiver = relationship("User", back_populates="received_transactions", foreign_keys=[receiver_id])

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    predicted_date = Column(DateTime, nullable=False, index=True)
    predicted_surplus_kg = Column(Float, nullable=False)
    confidence_score = Column(Float, nullable=False)
    
    # Breakdown by category
    category_breakdown = Column(Text)  # JSON
    
    # Reasoning
    reasoning = Column(Text)
    recommendations = Column(Text)  # JSON array
    
    # Actual outcome (for model improvement)
    actual_surplus_kg = Column(Float)
    accuracy_score = Column(Float)
    
    created_at = Column(DateTime, default=datetime.utcnow)

class WasteLog(Base):
    __tablename__ = "waste_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    date = Column(DateTime, nullable=False, index=True)
    category = Column(String, nullable=False)
    quantity_kg = Column(Float, nullable=False)
    estimated_value = Column(Float)
    
    # Reason for waste
    reason = Column(String)  # expired, spoiled, overproduction, etc.
    
    # Prevention potential
    preventable = Column(Boolean, default=True)
    prevention_notes = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)

class ImpactMetric(Base):
    __tablename__ = "impact_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime, nullable=False, index=True)
    
    # Food metrics
    food_saved_kg = Column(Float, default=0)
    food_donated_kg = Column(Float, default=0)
    meals_provided = Column(Integer, default=0)
    
    # Environmental metrics
    co2_saved_kg = Column(Float, default=0)
    water_saved_liters = Column(Float, default=0)
    
    # Financial metrics
    cost_savings = Column(Float, default=0)
    revenue_generated = Column(Float, default=0)
    transaction_fees_paid = Column(Float, default=0)
    
    # Social metrics
    ngos_helped = Column(Integer, default=0)
    people_fed = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String, index=True)  # match, prediction, transaction, alert
    
    # Related entities
    related_food_item_id = Column(Integer, ForeignKey("food_items.id"))
    related_transaction_id = Column(Integer, ForeignKey("transactions.id"))
    
    read = Column(Boolean, default=False)
    sent_at = Column(DateTime, default=datetime.utcnow)
    read_at = Column(DateTime)
    
    # Relationships
    user = relationship("User", back_populates="notifications")

class Match(Base):
    __tablename__ = "matches"
    
    id = Column(Integer, primary_key=True, index=True)
    food_item_id = Column(Integer, ForeignKey("food_items.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    match_score = Column(Float, nullable=False)
    distance_km = Column(Float, nullable=False)
    
    # Match factors
    category_match = Column(Float)
    capacity_match = Column(Float)
    distance_score = Column(Float)
    urgency_score = Column(Float)
    
    # Status
    notified = Column(Boolean, default=False)
    viewed = Column(Boolean, default=False)
    accepted = Column(Boolean)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)

# Database setup functions
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://user:password@localhost/foodwaste"
# For development, use SQLite:
# DATABASE_URL = "sqlite:///./foodwaste.db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Database session dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()