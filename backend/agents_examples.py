"""
Agents Testing and Examples
Practical examples and test cases for the multi-agent system
"""

# ============================================================================
# EXAMPLE 1: Waste Prediction Agent
# ============================================================================

WASTE_PREDICTION_EXAMPLE = {
    "description": "Predict food surplus for a restaurant based on historical data",
    "endpoint": "POST /api/agents/predict-waste",
    "request": {
        "historical_data": [
            {"date": "2024-01-01", "category": "vegetables", "quantity": 15, "unit": "kg"},
            {"date": "2024-01-02", "category": "vegetables", "quantity": 18, "unit": "kg"},
            {"date": "2024-01-03", "category": "vegetables", "quantity": 20, "unit": "kg"},
            {"date": "2024-01-04", "category": "vegetables", "quantity": 22, "unit": "kg"},
            {"date": "2024-01-05", "category": "dairy", "quantity": 5, "unit": "kg"},
            {"date": "2024-01-06", "category": "dairy", "quantity": 6, "unit": "kg"},
            {"date": "2024-01-07", "category": "bakery", "quantity": 8, "unit": "kg"},
        ],
        "days_ahead": 7
    },
    "expected_output": {
        "predictions": [
            {
                "category": "vegetables",
                "predicted_quantity": 130.0,
                "confidence": 0.85
            },
            {
                "category": "dairy",
                "predicted_quantity": 35.0,
                "confidence": 0.80
            },
            {
                "category": "bakery",
                "predicted_quantity": 56.0,
                "confidence": 0.75
            }
        ],
        "recommendations": [
            "Implement dynamic pricing for vegetables",
            "Partner with food banks",
            "Adjust ordering patterns using AI predictions",
            "Launch food rescue program"
        ]
    }
}

# ============================================================================
# EXAMPLE 2: Recipient Matching Agent
# ============================================================================

MATCHING_EXAMPLE = {
    "description": "Match surplus vegetables with appropriate recipients",
    "endpoint": "POST /api/agents/match-recipients",
    "request": {
        "food_item": {
            "id": 101,
            "name": "Fresh Tomatoes & Cucumbers",
            "quantity": 80,
            "unit": "kg",
            "category": "produce",
            "expiry_hours": 36,
            "location": "Downtown Restaurant",
            "description": "Fresh produce from morning inventory"
        },
        "recipient_pool": [
            {
                "id": 1,
                "name": "Hope Community Shelter",
                "type": "shelter",
                "location": "Central District",
                "distance": 4,
                "capacity_kg": 150,
                "preferred_categories": ["produce", "dairy", "bakery"],
                "people_served": 200,
                "pickup_speed": "fast"
            },
            {
                "id": 2,
                "name": "City Food Bank",
                "type": "ngo",
                "location": "South district",
                "distance": 8,
                "capacity_kg": 500,
                "preferred_categories": ["all"],
                "people_served": 5000,
                "pickup_speed": "standard"
            },
            {
                "id": 3,
                "name": "Children's Nutrition Program",
                "type": "charity",
                "location": "North district",
                "distance": 15,
                "capacity_kg": 100,
                "preferred_categories": ["produce", "dairy"],
                "people_served": 300,
                "pickup_speed": "standard"
            },
            {
                "id": 4,
                "name": "Community Garden Collective",
                "type": "community_org",
                "location": "West district",
                "distance": 12,
                "capacity_kg": 80,
                "preferred_categories": ["produce"],
                "people_served": 150,
                "pickup_speed": "flexible"
            }
        ]
    },
    "expected_output": {
        "food_item": "Fresh Tomatoes & Cucumbers",
        "total_recipients_evaluated": 4,
        "matches": [
            {
                "recipient_id": 1,
                "recipient_name": "Hope Community Shelter",
                "score": 92,
                "reason": "Perfect match - nearby, suitable capacity, prefers produce, fast pickup",
                "distance_km": 4,
                "estimated_meals": 200
            },
            {
                "recipient_id": 2,
                "recipient_name": "City Food Bank",
                "score": 85,
                "reason": "Excellent match - large capacity, serves all produce, central location",
                "distance_km": 8,
                "estimated_meals": 800
            },
            {
                "recipient_id": 3,
                "recipient_name": "Children's Nutrition Program",
                "score": 78,
                "reason": "Good match - prefers produce, serves vulnerable population",
                "distance_km": 15,
                "estimated_meals": 300
            }
        ]
    }
}

# ============================================================================
# EXAMPLE 3: Recipe and Utilization Agent
# ============================================================================

RECIPE_EXAMPLE = {
    "description": "Generate recipes and utilization ideas for surplus vegetables",
    "endpoint": "POST /api/agents/generate-recipes",
    "request": {
        "food_items": [
            "tomatoes",
            "onions",
            "garlic",
            "bell peppers",
            "zucchini",
            "basil",
            "olive oil"
        ],
        "quantity_kg": 100
    },
    "expected_output": {
        "available_items": [
            "tomatoes", "onions", "garlic", "bell peppers", "zucchini", "basil", "olive oil"
        ],
        "quantity_kg": 100,
        "recipes": [
            {
                "id": 1,
                "name": "Community Soup (Minestrone)",
                "servings": 300,
                "difficulty": "Easy",
                "prep_time_hours": 2,
                "equipment_needed": ["Large pots (3)", "Ladles", "Containers"],
                "estimated_value_added": "$450.00",
                "instructions": "Chop vegetables, sauté aromatics, add broth and simmer...",
                "preservation": "Freeze in portions"
            },
            {
                "id": 2,
                "name": "Roasted Vegetable Preservation",
                "servings": 200,
                "difficulty": "Medium",
                "prep_time_hours": 4,
                "equipment_needed": ["Oven", "Jars", "Sterilizer"],
                "estimated_value_added": "$600.00",
                "instructions": "Roast vegetables, pack in jars, preserve using hot water bath...",
                "preservation": "Shelf-stable for 6 months"
            },
            {
                "id": 3,
                "name": "Fresh Vegetable Juice/Puree",
                "servings": 400,
                "difficulty": "Easy",
                "prep_time_hours": 1.5,
                "equipment_needed": ["Industrial blender", "Strainer", "Freezer containers"],
                "estimated_value_added": "$250.00",
                "instructions": "Blend vegetables, strain if needed, freeze in portions...",
                "preservation": "Frozen for up to 3 months"
            }
        ]
    }
}

# ============================================================================
# EXAMPLE 4: Impact Calculation Agent
# ============================================================================

IMPACT_EXAMPLE = {
    "description": "Calculate environmental and social impact of food donation",
    "endpoint": "POST /api/agents/calculate-impact",
    "request": {
        "transaction": {
            "id": 1001,
            "item_name": "Fresh Vegetables",
            "category": "produce",
            "quantity": 80,
            "unit": "kg",
            "recipient": "Hope Community Shelter",
            "donor": "Downtown Restaurant",
            "date": "2024-01-15"
        }
    },
    "expected_output": {
        "transaction_id": 1001,
        "food_item": "Fresh Vegetables",
        "quantity_kg": 80,
        "impact_metrics": {
            "co2_saved_kg": 200,
            "water_saved_liters": 20000,
            "meals_provided": 160,
            "money_saved": "$400.00",
            "landfill_diversion_kg": 80,
            "equivalent_impact": {
                "trees_needed_to_offset_co2": 3,
                "car_miles_not_driven": 500,
                "equivalent_family_days_food": 32
            }
        }
    }
}

# ============================================================================
# EXAMPLE 5: Logistics Optimization Agent
# ============================================================================

LOGISTICS_EXAMPLE = {
    "description": "Optimize food pickup and delivery for multiple locations",
    "endpoint": "POST /api/agents/optimize-logistics",
    "request": {
        "food_item": {
            "id": 501,
            "name": "Fresh Bakery Items",
            "location": "Downtown Bakery",
            "latitude": 37.7749,
            "longitude": -122.4194,
            "quantity": 150,
            "special_requirements": "Keep refrigerated, 2-hour delivery window"
        },
        "pickups": [
            {
                "recipient_id": 1,
                "recipient_name": "Hope Shelter",
                "location": "Central District",
                "latitude": 37.7800,
                "longitude": -122.4180,
                "quantity": 50,
                "pickup_time_window": "14:00-15:00"
            },
            {
                "recipient_id": 2,
                "recipient_name": "Food Bank",
                "location": "South District",
                "latitude": 37.7650,
                "longitude": -122.4250,
                "quantity": 60,
                "pickup_time_window": "15:30-16:30"
            },
            {
                "recipient_id": 3,
                "recipient_name": "Children's Program",
                "location": "North District",
                "latitude": 37.7900,
                "longitude": -122.4100,
                "quantity": 40,
                "pickup_time_window": "17:00-18:00"
            }
        ]
    },
    "expected_output": {
        "optimization_status": "success",
        "total_stops": 3,
        "route_optimization": "Nearest neighbor algorithm",
        "estimated_distance_km": 18.5,
        "estimated_time_hours": 1.5,
        "fuel_cost_estimate": "$12.50",
        "carbon_footprint_kg": 5.2,
        "optimized_route": [
            {
                "stop": 1,
                "recipient_id": 1,
                "location": "Hope Shelter",
                "arrival_time": "14:15",
                "quantity": 50
            },
            {
                "stop": 2,
                "recipient_id": 3,
                "location": "Children's Program",
                "arrival_time": "16:00",
                "quantity": 40
            },
            {
                "stop": 3,
                "recipient_id": 2,
                "location": "Food Bank",
                "arrival_time": "17:15",
                "quantity": 60
            }
        ],
        "savings_vs_naive_route": {
            "distance_saved_km": 8.2,
            "time_saved_hours": 0.45,
            "cost_saved": "$8.50"
        }
    }
}

# ============================================================================
# EXAMPLE 6: Complex Workflow
# ============================================================================

WORKFLOW_EXAMPLE = {
    "description": "Complete workflow for processing surplus food",
    "endpoint": "POST /api/agents/workflow",
    "request": {
        "workflow_name": "food_surplus_workflow",
        "input_data": {
            "food_item": {
                "id": 301,
                "name": "Mixed Vegetables",
                "quantity": 200,
                "unit": "kg",
                "category": "produce",
                "expiry_hours": 24,
                "location": "Restaurant Chain Distribution Center",
                "quality": "Grade A - Slightly cosmetic imperfections"
            },
            "recipient_pool": [
                {
                    "id": 1,
                    "name": "Hope Community Shelter",
                    "distance": 5,
                    "capacity_kg": 150,
                    "preferred_categories": ["produce"],
                    "people_served": 200
                },
                {
                    "id": 2,
                    "name": "City Food Bank",
                    "distance": 10,
                    "capacity_kg": 500,
                    "preferred_categories": ["all"],
                    "people_served": 5000
                },
                {
                    "id": 3,
                    "name": "Community Kitchen",
                    "distance": 8,
                    "capacity_kg": 200,
                    "preferred_categories": ["produce"],
                    "people_served": 300
                }
            ]
        }
    },
    "expected_output": {
        "workflow": "food_surplus_workflow",
        "description": "Complete workflow for processing surplus food",
        "started_at": "2024-01-15T10:30:00Z",
        "completed_at": "2024-01-15T10:45:00Z",
        "steps": [
            {
                "agent": "waste_prediction",
                "task": "Analyze the surplus food context",
                "result": {
                    "analysis": "Large quantity of produce, urgent processing needed",
                    "trend": "increasing",
                    "priority": "high"
                },
                "success": True
            },
            {
                "agent": "recipe",
                "task": "Generate utilization suggestions",
                "result": {
                    "recipes": 3,
                    "suggestions": [
                        "Community soup preparation",
                        "Vegetable preservation",
                        "Donations to food programs"
                    ]
                },
                "success": True
            },
            {
                "agent": "matching",
                "task": "Find best recipients",
                "result": {
                    "top_match": "Hope Community Shelter",
                    "score": 95,
                    "matches": 3
                },
                "success": True
            },
            {
                "agent": "logistics",
                "task": "Plan logistics",
                "result": {
                    "route": "Optimized for 3 stops",
                    "estimated_time": "1.5 hours",
                    "feasible": True
                },
                "success": True
            },
            {
                "agent": "coordinator",
                "task": "Synthesize and present solution",
                "result": {
                    "recommendation": "Distribute 150kg to Shelter, 50kg to Community Kitchen",
                    "impact": "400 meals provided, 500kg CO2 saved",
                    "status": "ready for execution"
                },
                "success": True
            }
        ],
        "final_output": {
            "distribution_plan": {
                "main_recipient": "Hope Community Shelter (150kg)",
                "secondary_recipient": "Community Kitchen (50kg)",
                "processing_method": "Fresh donation with community cooking program"
            },
            "impact": {
                "meals_provided": 400,
                "co2_saved_kg": 500,
                "money_saved": "$1000",
                "landfill_diversion_kg": 200
            },
            "timeline": {
                "start": "Today 11:00 AM",
                "completion": "Today 6:00 PM",
                "status": "ready"
            }
        },
        "success": True
    }
}

# ============================================================================
# TESTING SCENARIOS
# ============================================================================

TEST_SCENARIOS = {
    "scenario_1": {
        "name": "Small Restaurant Surplus",
        "description": "Local restaurant with daily vegetable surplus",
        "agents": ["waste_prediction", "recipe", "matching"],
        "expected_outcomes": [
            "Identify daily pattern",
            "Find local recipients",
            "Reduce waste by 30%"
        ]
    },
    "scenario_2": {
        "name": "Large Scale Event Leftovers",
        "description": "Conference catering company with large surplus",
        "agents": ["matching", "logistics", "impact"],
        "expected_outcomes": [
            "Distribute to 5+ recipients",
            "Minimize logistics costs",
            "Document impact"
        ]
    },
    "scenario_3": {
        "name": "Seasonal Produce Peak",
        "description": "Farmer's market during peak season",
        "agents": ["waste_prediction", "recipe", "coordinator"],
        "expected_outcomes": [
            "Predict peak times",
            "Generate value-added products",
            "Optimize utilization"
        ]
    },
    "scenario_4": {
        "name": "Emergency Response",
        "description": "Rapid response to large surplus discovery",
        "agents": ["coordinator", "matching", "logistics"],
        "expected_outcomes": [
            "Quick recipient identification",
            "Fast logistics coordination",
            "Timely distribution"
        ]
    },
    "scenario_5": {
        "name": "Network Optimization",
        "description": "Continuous improvement of entire food network",
        "agents": ["waste_prediction", "impact", "coordinator"],
        "expected_outcomes": [
            "Identify inefficiencies",
            "Quantify improvements",
            "Plan optimizations"
        ]
    }
}

# ============================================================================
# CURL EXAMPLES FOR TESTING
# ============================================================================

CURL_EXAMPLES = {
    "predict_waste": """
curl -X POST http://localhost:8000/api/agents/predict-waste \\
  -H "Content-Type: application/json" \\
  -d '{
    "historical_data": [
      {"date": "2024-01-01", "category": "vegetables", "quantity": 15},
      {"date": "2024-01-02", "category": "vegetables", "quantity": 18}
    ],
    "days_ahead": 7
  }'
    """,
    
    "match_recipients": """
curl -X POST http://localhost:8000/api/agents/match-recipients \\
  -H "Content-Type: application/json" \\
  -d '{
    "food_item": {
      "name": "Fresh Vegetables",
      "quantity": 50,
      "category": "produce"
    },
    "recipient_pool": [
      {"id": 1, "name": "Shelter A", "distance": 5, "capacity_kg": 100}
    ]
  }'
    """,
    
    "execute_workflow": """
curl -X POST http://localhost:8000/api/agents/workflow \\
  -H "Content-Type: application/json" \\
  -d '{
    "workflow_name": "food_surplus_workflow",
    "input_data": {
      "food_item": {"name": "Vegetables", "quantity": 100},
      "recipient_pool": []
    }
  }'
    """,
    
    "get_agent_info": """
curl -X GET http://localhost:8000/api/agents/info
    """,
    
    "get_history": """
curl -X GET "http://localhost:8000/api/agents/history?limit=10"
    """
}

# ============================================================================
# PERFORMANCE METRICS TEST
# ============================================================================

PERFORMANCE_TEST_CASES = {
    "small_dataset": {
        "recipients_count": 5,
        "food_items_count": 1,
        "expected_execution_time_seconds": 5
    },
    "medium_dataset": {
        "recipients_count": 50,
        "food_items_count": 10,
        "expected_execution_time_seconds": 15
    },
    "large_dataset": {
        "recipients_count": 500,
        "food_items_count": 100,
        "expected_execution_time_seconds": 45
    }
}

if __name__ == "__main__":
    print("Agent Examples and Test Cases")
    print("=" * 60)
    print("\\nUse these examples to test the multi-agent system")
    print("\\nAvailable examples:")
    print("- WASTE_PREDICTION_EXAMPLE")
    print("- MATCHING_EXAMPLE")
    print("- RECIPE_EXAMPLE")
    print("- IMPACT_EXAMPLE")
    print("- LOGISTICS_EXAMPLE")
    print("- WORKFLOW_EXAMPLE")
    print("\\nSee curl examples in CURL_EXAMPLES dict")
