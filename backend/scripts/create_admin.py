"""
Create Admin User Script
Location: backend/scripts/create_admin.py

This script creates an admin user for the Food Waste Reduction Network.
Run this after setting up the database to create your first user.
"""

import sys
import os

# Add parent directory to path to import models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from passlib.context import CryptContext
from models import SessionLocal, User, UserType, init_db
from datetime import datetime
from sqlalchemy.exc import IntegrityError

# Password hashing context
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

def create_admin_user(email=None, password=None, name=None):
    """
    Create an admin user in the database
    
    Args:
        email: Admin email (default: admin@foodwaste.com)
        password: Admin password (default: admin123)
        name: Admin name (default: Admin User)
    """
    # Default values
    if email is None:
        email = 'admin@foodwaste.com'
    if password is None:
        password = 'admin123'
    if name is None:
        name = 'Admin Restaurant'
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Check if admin user already exists
        existing_user = db.query(User).filter(User.email == email).first()
        
        if existing_user:
            print(f"⚠️  User with email '{email}' already exists!")
            print(f"   Name: {existing_user.name}")
            print(f"   Type: {existing_user.user_type.value}")
            print(f"   Verified: {existing_user.verified}")
            
            # Ask if user wants to update password
            response = input("\nDo you want to reset the password? (yes/no): ").strip().lower()
            if response in ['yes', 'y']:
                existing_user.hashed_password = pwd_context.hash(password)
                db.commit()
                print(f"✅ Password updated for {email}")
                print(f"   New password: {password}")
            else:
                print("   Password not changed.")
            
            return existing_user
        
        # Create new admin user
        admin = User(
            email=email,
            hashed_password=pwd_context.hash(password),
            name=name,
            user_type=UserType.RESTAURANT,
            phone='+1-555-0100',
            address='123 Main Street, San Francisco, CA 94102',
            latitude=37.7749,
            longitude=-122.4194,
            verified=True,
            active=True,
            business_name='Admin Restaurant',
            capacity_kg=500.0,
            operating_hours='9:00 AM - 10:00 PM',
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        # Add to database
        db.add(admin)
        db.commit()
        db.refresh(admin)
        
        # Success message
        print("\n" + "="*60)
        print("✅ ADMIN USER CREATED SUCCESSFULLY!")
        print("="*60)
        print(f"📧 Email:    {email}")
        print(f"🔑 Password: {password}")
        print(f"👤 Name:     {name}")
        print(f"🏢 Type:     {admin.user_type.value}")
        print(f"✓  Verified: {admin.verified}")
        print(f"📍 Location: San Francisco, CA")
        print("="*60)
        print("\n⚠️  IMPORTANT: Please change the password after first login!")
        print("   You can log in at: http://localhost:3000\n")
        
        return admin
        
    except IntegrityError as e:
        db.rollback()
        print(f"\n❌ Database Error: {str(e)}")
        print("   This usually means the user already exists or there's a constraint violation.")
        return None
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Error creating admin user: {str(e)}")
        return None
        
    finally:
        db.close()

def create_sample_users():
    """Create additional sample users for testing"""
    db = SessionLocal()
    
    sample_users = [
        {
            'email': 'restaurant@example.com',
            'password': 'restaurant123',
            'name': 'Green Valley Restaurant',
            'user_type': UserType.RESTAURANT,
            'address': '456 Oak Ave, San Francisco, CA',
            'latitude': 37.7849,
            'longitude': -122.4094
        },
        {
            'email': 'ngo@example.com',
            'password': 'ngo123',
            'name': 'Hope Food Bank',
            'user_type': UserType.NGO,
            'address': '789 Pine St, San Francisco, CA',
            'latitude': 37.7949,
            'longitude': -122.3994
        },
        {
            'email': 'store@example.com',
            'password': 'store123',
            'name': 'Fresh Mart Grocery',
            'user_type': UserType.STORE,
            'address': '321 Market St, San Francisco, CA',
            'latitude': 37.7649,
            'longitude': -122.4294
        }
    ]
    
    created_count = 0
    
    try:
        for user_data in sample_users:
            # Check if user exists
            existing = db.query(User).filter(User.email == user_data['email']).first()
            if existing:
                print(f"⚠️  {user_data['email']} already exists, skipping...")
                continue
            
            # Create user
            user = User(
                email=user_data['email'],
                hashed_password=pwd_context.hash(user_data['password']),
                name=user_data['name'],
                user_type=user_data['user_type'],
                address=user_data['address'],
                latitude=user_data['latitude'],
                longitude=user_data['longitude'],
                verified=True,
                active=True,
                created_at=datetime.utcnow()
            )
            
            db.add(user)
            created_count += 1
            print(f"✅ Created: {user_data['name']} ({user_data['email']})")
        
        db.commit()
        
        if created_count > 0:
            print(f"\n✅ Successfully created {created_count} sample user(s)!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating sample users: {str(e)}")
    finally:
        db.close()

def main():
    """Main function"""
    print("\n🌍 Food Waste Reduction Network - Admin User Setup\n")
    
    # Initialize database tables if they don't exist
    try:
        print("📊 Checking database connection...")
        init_db()
        print("✅ Database connection successful!\n")
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
        print("\nPlease ensure:")
        print("  1. MySQL is running")
        print("  2. Database 'foodwaste' exists")
        print("  3. .env file has correct DATABASE_URL")
        print("  4. Required packages are installed (pip install -r requirements.txt)")
        return
    
    # Interactive mode
    print("Choose an option:")
    print("1. Create admin user (default credentials)")
    print("2. Create admin user (custom credentials)")
    print("3. Create sample users for testing")
    print("4. Create all (admin + sample users)")
    
    choice = input("\nEnter your choice (1-4): ").strip()
    
    if choice == '1':
        create_admin_user()
        
    elif choice == '2':
        print("\n📝 Enter custom credentials:")
        email = input("Email (default: admin@foodwaste.com): ").strip() or 'admin@foodwaste.com'
        password = input("Password (default: admin123): ").strip() or 'admin123'
        name = input("Name (default: Admin Restaurant): ").strip() or 'Admin Restaurant'
        create_admin_user(email, password, name)
        
    elif choice == '3':
        create_sample_users()
        
    elif choice == '4':
        create_admin_user()
        print("\n" + "-"*60 + "\n")
        create_sample_users()
        
    else:
        print("❌ Invalid choice. Exiting...")

if __name__ == "__main__":
    main()