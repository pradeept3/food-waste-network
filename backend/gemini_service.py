"""
Gemini AI Service for Food Waste Network
Provides AI-powered features for matching, predictions, and recommendations
"""

import os
import json
from typing import Optional, List
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini with your API key
# Store API key in environment variable: GEMINI_API_KEY
def initialize_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        print("⚠️  Warning: GEMINI_API_KEY environment variable not set")
        print("   1. Get your API key from: https://aistudio.google.com/app/apikey")
        print("   2. Add it to backend/.env file: GEMINI_API_KEY=your_key")
        print("   3. Restart the server")
        return False
    try:
        genai.configure(api_key=api_key)
        print("✓ Gemini AI configured successfully!")
        return True
    except Exception as e:
        print(f"✗ Error configuring Gemini: {e}")
        return False

def match_recipients_with_surplus(surplus_food: dict, recipients: List[dict]) -> dict:
    """
    Use Gemini to intelligently match surplus food with recipients
    
    Args:
        surplus_food: {"item": str, "quantity": int, "unit": str, "category": str}
        recipients: List of recipient profiles
    
    Returns:
        {
            "matches": [{"recipient_id": int, "score": float, "reason": str}],
            "summary": str
        }
    """
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = f"""
        You are a food waste network AI assistant. Match the following surplus food with the best recipient(s).
        
        SURPLUS FOOD:
        - Item: {surplus_food.get('item')}
        - Quantity: {surplus_food.get('quantity')} {surplus_food.get('unit')}
        - Category: {surplus_food.get('category')}
        - Description: {surplus_food.get('description', 'N/A')}
        
        AVAILABLE RECIPIENTS:
        {json.dumps(recipients, indent=2)}
        
        Analyze and provide:
        1. The 3 best matching recipients with scores (0-100)
        2. Reason for each match
        3. Overall summary
        
        Return as JSON:
        {{
            "matches": [
                {{"recipient_id": int, "score": int, "reason": "string"}}
            ],
            "summary": "string"
        }}
        """
        
        response = model.generate_content(prompt)
        
        # Parse JSON response
        response_text = response.text
        # Find JSON in response
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        if json_start != -1 and json_end > json_start:
            json_str = response_text[json_start:json_end]
            return json.loads(json_str)
        else:
            return {"matches": [], "summary": response_text}
    
    except Exception as e:
        print(f"Error in recipient matching: {e}")
        return {"matches": [], "summary": f"Error: {str(e)}", "error": True}

def generate_waste_predictions(historical_data: List[dict]) -> dict:
    """
    Use Gemini to analyze waste patterns and generate predictions
    
    Args:
        historical_data: List of historical waste records
    
    Returns:
        {
            "predictions": str,
            "recommendations": [str],
            "trend": str
        }
    """
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Convert datetime objects to strings for JSON serialization
        serializable_data = []
        for item in historical_data:
            clean_item = {}
            for key, value in item.items():
                # Convert datetime to ISO format string
                if hasattr(value, 'isoformat'):
                    clean_item[key] = value.isoformat()
                else:
                    clean_item[key] = value
            serializable_data.append(clean_item)
        
        prompt = f"""
        Analyze the following food waste data and provide predictions and recommendations.
        
        HISTORICAL DATA:
        {json.dumps(serializable_data, indent=2)}
        
        Provide:
        1. Waste trend analysis (increasing/decreasing/stable)
        2. Predicted waste for next period
        3. 3-4 actionable recommendations to reduce waste
        
        Return as JSON:
        {{
            "predictions": "string (prediction for next period)",
            "trend": "string (increasing/decreasing/stable)",
            "recommendations": ["recommendation 1", "recommendation 2", ...],
            "analysis": "string (brief analysis)"
        }}
        """
        
        response = model.generate_content(prompt)
        response_text = response.text
        
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        if json_start != -1 and json_end > json_start:
            json_str = response_text[json_start:json_end]
            return json.loads(json_str)
        else:
            return {"predictions": response_text, "trend": "unknown", "recommendations": []}
    
    except Exception as e:
        print(f"Error in waste prediction: {e}")
        return {"error": True, "predictions": f"Error: {str(e)}", "recommendations": []}

def generate_recipe_suggestions(food_item: str, quantity: str) -> dict:
    """
    Use Gemini to suggest creative uses and recipes for surplus food
    
    Args:
        food_item: Name of the food item (e.g., "tomatoes")
        quantity: Quantity available (e.g., "50 kg")
    
    Returns:
        {
            "recipes": [{"name": str, "servings": int, "difficulty": str}],
            "other_uses": [str],
            "summary": str
        }
    """
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = f"""
        Suggest creative ways to use {quantity} of {food_item}.
        
        Provide:
        1. 3-4 recipes that can use large quantities
        2. 2-3 other creative uses (sauces, preserves, donations, etc.)
        3. Brief explanation why these are good options
        
        Return as JSON:
        {{
            "recipes": [
                {{"name": "string", "servings": int, "difficulty": "easy/medium/hard"}}
            ],
            "other_uses": ["use 1", "use 2", ...],
            "summary": "string"
        }}
        """
        
        response = model.generate_content(prompt)
        response_text = response.text
        
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        if json_start != -1 and json_end > json_start:
            json_str = response_text[json_start:json_end]
            return json.loads(json_str)
        else:
            return {"recipes": [], "other_uses": [], "summary": response_text}
    
    except Exception as e:
        print(f"Error in recipe generation: {e}")
        return {"error": True, "recipes": [], "other_uses": [], "summary": f"Error: {str(e)}"}

def chat_with_ai(user_message: str, context: Optional[str] = None) -> str:
    """
    General chat with Gemini for user support
    
    Args:
        user_message: User's question
        context: Optional context about the user or app state
    
    Returns:
        AI response string
    """
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        system_prompt = """
        You are a helpful AI assistant for a Food Waste Reduction Network.
        You help users:
        - Find ways to reduce food waste
        - Understand food storage and preservation
        - Connect with food recipients and donors
        - Make sustainable choices
        
        Be friendly, concise, and practical in your responses.
        """
        
        if context:
            full_prompt = f"{system_prompt}\n\nContext: {context}\n\nUser: {user_message}"
        else:
            full_prompt = f"{system_prompt}\n\nUser: {user_message}"
        
        response = model.generate_content(full_prompt)
        return response.text
    
    except Exception as e:
        print(f"Error in chat: {e}")
        return f"Sorry, I encountered an error: {str(e)}"

# Initialize on import
gemini_available = initialize_gemini()
