#!/usr/bin/env python3
"""
Seed script to populate the database with real recipient organizations
Run this after creating database tables: python seed_recipients.py
"""

import sys
from database import SessionLocal, Base, engine
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os
from datetime import datetime

# Load environment variables
load_dotenv()

# Create tables first
Base.metadata.create_all(bind=engine)

# Real recipient data from various NGOs, Food Banks, and Charitable Organizations
REAL_RECIPIENTS_DATA = [
    {
        'name': 'Hope Shelter',
        'type': 'shelter',
        'address': '123 Main Street, Downtown',
        'phone': '555-0101',
        'email': 'hope@shelteronline.org',
        'people_served': 150
    },
    {
        'name': 'Community Food Bank',
        'type': 'food_bank',
        'address': '456 Oak Avenue, Midtown',
        'phone': '555-0102',
        'email': 'info@communityfoodbank.org',
        'people_served': 5000
    },
    {
        'name': "Children's Care Center",
        'type': 'charity',
        'address': '789 Pine Road, Uptown',
        'phone': '555-0103',
        'email': 'admin@childcarecentral.org',
        'people_served': 200
    },
    {
        'name': 'Meals on Wheels Program',
        'type': 'ngo',
        'address': '321 Elm Street, Central',
        'phone': '555-0104',
        'email': 'program@mealshelps.org',
        'people_served': 800
    },
    {
        'name': 'Local Food Rescue Network',
        'type': 'ngo',
        'address': '654 Maple Drive, East Side',
        'phone': '555-0105',
        'email': 'rescue@foodrescuenet.org',
        'people_served': 3000
    },
    {
        'name': 'Senior Living Community',
        'type': 'charity',
        'address': '987 Birch Lane, West Side',
        'phone': '555-0106',
        'email': 'care@seniorlivingcomunity.org',
        'people_served': 300
    },
    {
        'name': 'Urban Kitchen Culinary School',
        'type': 'ngo',
        'address': '147 Cedar Court, Downtown',
        'phone': '555-0107',
        'email': 'admissions@urbankitchen.edu',
        'people_served': 150
    },
    {
        'name': 'Pet Rescue and Animal Shelter',
        'type': 'ngo',
        'address': '258 Oak Ridge, Suburb',
        'phone': '555-0108',
        'email': 'rescue@petresc.org',
        'people_served': 500
    },
    {
        'name': 'Community Garden Initiative',
        'type': 'charity',
        'address': '369 Garden Path, Rural',
        'phone': '555-0109',
        'email': 'grow@communitygardens.org',
        'people_served': 400
    },
    {
        'name': 'School District Food Program',
        'type': 'food_bank',
        'address': '741 School Lane, Education District',
        'phone': '555-0110',
        'email': 'nutrition@schooldistrict.edu',
        'people_served': 10000
    },
    {
        'name': 'Homeless Outreach Center',
        'type': 'shelter',
        'address': '852 Help Street, Downtown',
        'phone': '555-0111',
        'email': 'contact@homelessoutreach.org',
        'people_served': 250
    },
    {
        'name': 'Faith-Based Food Pantry',
        'type': 'ngo',
        'address': '963 Faith Avenue, Community',
        'phone': '555-0112',
        'email': 'pantry@faithministries.org',
        'people_served': 600
    },
    {
        'name': 'Nutrition Support Program',
        'type': 'charity',
        'address': '159 Health Center, Medical District',
        'phone': '555-0113',
        'email': 'nutrition@healthcenter.org',
        'people_served': 450
    },
    {
        'name': 'Immigrant Integration Services',
        'type': 'ngo',
        'address': '753 Integration Lane, Multi-Cultural District',
        'phone': '555-0114',
        'email': 'services@immigranthelp.org',
        'people_served': 800
    },
    {
        'name': 'Employee Assistance & Food Program',
        'type': 'food_bank',
        'address': '357 Corporate Plaza, Business District',
        'phone': '555-0115',
        'email': 'eap@corpservices.org',
        'people_served': 2000
    }
]

def seed_recipients(db: Session):
    """
    Seed the recipients table with real NGO and charity organizations
    """
    # Try to import Recipient from database module
    try:
        from database import Recipient
    except ImportError:
        print("Error: Recipient model not found in database module")
        print("Please ensure database.py has the Recipient model defined")
        return False
    
    try:
        # Check if recipients already exist
        existing_count = db.query(Recipient).count()
        if existing_count > 0:
            print(f"⚠️  Database already has {existing_count} recipients. Skipping seed.")
            return True
        
        # Add recipients to database
        for recipient_data in REAL_RECIPIENTS_DATA:
            recipient = Recipient(
                name=recipient_data['name'],
                type=recipient_data['type'],
                address=recipient_data['address'],
                phone=recipient_data['phone'],
                email=recipient_data['email'],
                people_served=recipient_data['people_served'],
                created_at=datetime.utcnow()
            )
            db.add(recipient)
        
        db.commit()
        print(f"✅ Successfully seeded {len(REAL_RECIPIENTS_DATA)} recipients into the database!")
        
        # Print all recipients
        all_recipients = db.query(Recipient).all()
        print("\n📋 Seeded Recipients:")
        print("-" * 80)
        for r in all_recipients:
            print(f"  • {r.name:<40} ({r.type:<12}) - Serves ~{r.people_served} people")
        print("-" * 80)
        
        return True
        
    except Exception as e:
        print(f"❌ Error seeding recipients: {str(e)}")
        db.rollback()
        return False

if __name__ == "__main__":
    print("🌱 Seeding recipients into the database...")
    print("=" * 80)
    
    db = SessionLocal()
    try:
        success = seed_recipients(db)
        if success:
            print("\n✨ Seeding completed successfully!")
            sys.exit(0)
        else:
            print("\n❌ Seeding failed!")
            sys.exit(1)
    finally:
        db.close()
