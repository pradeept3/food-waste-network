#!/usr/bin/env python3
"""
Setup script to initialize MySQL database for Food Waste Network
Run this ONCE to set up your database
"""

import mysql.connector
from mysql.connector import Error
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Your MySQL credentials
config = {
    'host': os.getenv('MYSQL_HOST', 'localhost'),
    'user': os.getenv('MYSQL_USER', 'root'),
    'password': os.getenv('MYSQL_PASSWORD', 'password')
}

def create_database():
    """Create the foodwaste database"""
    try:
        connection = mysql.connector.connect(**config)
        cursor = connection.cursor()
        
        # Create database if it doesn't exist
        print("📁 Creating database 'foodwaste'...")
        cursor.execute("CREATE DATABASE IF NOT EXISTS foodwaste CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        print("✅ Database 'foodwaste' created successfully!")
        
        cursor.close()
        connection.close()
        
    except Error as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

def create_tables():
    """Create tables in the database"""
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='password',
            database='foodwaste'
        )
        cursor = connection.cursor()
        
        print("\n📊 Creating tables...")
        
        # Users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                user_type VARCHAR(50),
                phone VARCHAR(20),
                address VARCHAR(255),
                latitude DECIMAL(10, 8),
                longitude DECIMAL(11, 8),
                verified BOOLEAN DEFAULT FALSE,
                is_admin BOOLEAN DEFAULT FALSE,
                is_active BOOLEAN DEFAULT TRUE,
                password_hash VARCHAR(255),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        print("✅ Users table created")
        
        # Food items table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS food_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                name VARCHAR(100) NOT NULL,
                quantity FLOAT NOT NULL,
                unit VARCHAR(50),
                category VARCHAR(50),
                description TEXT,
                status VARCHAR(50) DEFAULT 'available',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                expires_at DATETIME,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)
        print("✅ Food items table created")
        
        # Recipients table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS recipients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                type VARCHAR(50),
                address VARCHAR(255),
                phone VARCHAR(20),
                email VARCHAR(100),
                people_served INT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        print("✅ Recipients table created")
        
        # Transactions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                food_id INT NOT NULL,
                from_user_id INT NOT NULL,
                to_recipient_id INT,
                quantity FLOAT,
                status VARCHAR(50) DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (food_id) REFERENCES food_items(id),
                FOREIGN KEY (from_user_id) REFERENCES users(id),
                FOREIGN KEY (to_recipient_id) REFERENCES recipients(id)
            )
        """)
        print("✅ Transactions table created")
        
        # Predictions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS predictions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                predicted_surplus FLOAT,
                trend VARCHAR(50),
                confidence FLOAT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)
        print("✅ Predictions table created")
        
        connection.commit()
        cursor.close()
        connection.close()
        
        print("\n✅ All tables created successfully!")
        
    except Error as e:
        print(f"❌ Error creating tables: {e}")
        sys.exit(1)

def insert_demo_data():
    """Insert demo data"""
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='password',
            database='foodwaste'
        )
        cursor = connection.cursor()
        
        print("\n📝 Inserting demo data...")
        
        # Check if demo users already exist
        cursor.execute("SELECT COUNT(*) FROM users WHERE email = 'admin@foodwaste.com'")
        if cursor.fetchone()[0] == 0:
            # Insert admin user
            cursor.execute("""
                INSERT INTO users (email, name, user_type, phone, address, latitude, longitude, verified, is_admin, is_active, password_hash)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, ('admin@foodwaste.com', 'Admin User', 'restaurant', '555-0000', 'Admin Office', 37.7749, -122.4194, True, True, True, 'admin123'))
            
            # Insert demo user
            cursor.execute("""
                INSERT INTO users (email, name, user_type, phone, address, latitude, longitude, verified, is_admin, is_active, password_hash)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, ('demo@foodwaste.com', 'Demo User', 'restaurant', '555-0001', 'Demo Location', 37.7749, -122.4194, True, False, True, 'password123'))
            
            print("✅ Demo users created")
        
        # Check if demo recipients exist
        cursor.execute("SELECT COUNT(*) FROM recipients WHERE name = 'Hope Shelter'")
        if cursor.fetchone()[0] == 0:
            # Insert recipients
            cursor.execute("""
                INSERT INTO recipients (name, type, address, phone, email, people_served)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, ('Hope Shelter', 'shelter', '123 Main St, Downtown', '555-0101', 'hope@example.com', 150))
            
            cursor.execute("""
                INSERT INTO recipients (name, type, address, phone, email, people_served)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, ('Community Food Bank', 'ngo', '456 Oak Ave, Midtown', '555-0102', 'food@example.com', 500))
            
            cursor.execute("""
                INSERT INTO recipients (name, type, address, phone, email, people_served)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, ('City Soup Kitchen', 'ngo', '789 Pine Rd, Uptown', '555-0103', 'soup@example.com', 300))
            
            print("✅ Demo recipients created")
        
        connection.commit()
        cursor.close()
        connection.close()
        
        print("\n✅ Demo data inserted successfully!")
        
    except Error as e:
        print(f"❌ Error inserting data: {e}")
        sys.exit(1)

if __name__ == "__main__":
    print("🚀 Food Waste Network - Database Setup\n")
    print("=" * 50)
    
    create_database()
    create_tables()
    insert_demo_data()
    
    print("\n" + "=" * 50)
    print("\n✅ Database setup completed successfully!")
    print("\n📝 Default credentials:")
    print("   Admin Email: admin@foodwaste.com")
    print("   Admin Password: admin123")
    print("   Demo Email: demo@foodwaste.com")
    print("   Demo Password: password123")
    print("\n🎉 You can now start the backend server!")
