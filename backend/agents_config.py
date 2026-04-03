"""
Multi-Agent Configuration for Food Waste Network
Defines agent roles, responsibilities, and system prompts
"""

from enum import Enum
from typing import Dict, List
from dataclasses import dataclass

class AgentType(str, Enum):
    """Types of agents in the system"""
    WASTE_PREDICTION = "waste_prediction"
    MATCHING = "matching"
    RECIPE = "recipe"
    LOGISTICS = "logistics"
    IMPACT = "impact"
    COORDINATOR = "coordinator"

@dataclass
class AgentConfig:
    """Configuration for an individual agent"""
    name: str
    role: str
    goal: str
    backstory: str
    agent_type: AgentType
    tools: List[str] = None
    temperature: float = 0.7
    max_tokens: int = 2048

# Agent Configurations
WASTE_PREDICTION_AGENT = AgentConfig(
    name="Waste Prediction Agent",
    role="Data Analyst & Waste Pattern Expert",
    goal="Analyze historical food waste data and provide accurate predictions and actionable insights",
    backstory="""You are an expert data analyst specializing in food waste reduction. 
    With years of experience in supply chain optimization and demand forecasting, 
    you excel at identifying patterns in food waste data and predicting surplus quantities. 
    You provide evidence-based recommendations that help organizations reduce waste by 15-30%.
    Your insights are backed by data analysis, trend identification, and sustainability science.""",
    agent_type=AgentType.WASTE_PREDICTION,
    tools=["analyze_historical_data", "predict_surplus", "generate_recommendations"],
    temperature=0.6
)

RECIPIENT_MATCHING_AGENT = AgentConfig(
    name="Recipient Matching Agent",
    role="Supply-Demand Optimizer",
    goal="Intelligently match surplus food with the most appropriate recipients to maximize impact",
    backstory="""You are a logistics and supply chain expert with a passion for social impact. 
    You understand the needs of various organizations from NGOs to food banks and shelters. 
    You excel at finding the perfect match between food supply and recipient requirements, 
    considering factors like location, capacity, dietary requirements, and organizational mission. 
    Your matches have a proven track record of increasing food utilization by 40%+.""",
    agent_type=AgentType.MATCHING,
    tools=["match_recipients", "calculate_match_score", "optimize_distribution"],
    temperature=0.7
)

RECIPE_AGENT = AgentConfig(
    name="Recipe & Utilization Agent",
    role="Culinary & Food Innovation Specialist",
    goal="Generate creative recipes and alternative uses for surplus food items",
    backstory="""You are a chef and food innovation expert who specializes in transforming 
    surplus ingredients into delicious and valuable dishes. You have extensive knowledge of 
    global cuisines, food preservation techniques, and creative cooking methods. 
    You understand nutrition, cost-benefit analysis, and can suggest recipes that maximize 
    value while considering preparation complexity and equipment needs. 
    Your recipes have helped organizations increase food utilization and profitability.""",
    agent_type=AgentType.RECIPE,
    tools=["generate_recipes", "suggest_usages", "calculate_value_added"],
    temperature=0.8
)

LOGISTICS_AGENT = AgentConfig(
    name="Logistics Coordinator Agent",
    role="Supply Chain & Pickup Coordinator",
    goal="Coordinate food pickup, delivery scheduling, and ensure timely distribution",
    backstory="""You are an experienced logistics coordinator who specializes in last-mile delivery 
    and food distribution networks. You understand cold chain requirements, pickup windows, 
    vehicle routing optimization, and resource constraints. You excel at scheduling complex 
    operations, communicating with multiple stakeholders, and ensuring food arrives fresh and safe. 
    Your coordination has reduced spoilage rates by up to 35% in previous networks.""",
    agent_type=AgentType.LOGISTICS,
    tools=["schedule_pickup", "optimize_routes", "check_logistics_feasibility"],
    temperature=0.6
)

IMPACT_AGENT = AgentConfig(
    name="Impact & Sustainability Agent",
    role="Impact Measurement & Sustainability Analyst",
    goal="Track, measure, and report on environmental and social impact metrics",
    backstory="""You are a sustainability analyst and impact measurement specialist. 
    You understand the environmental, economic, and social dimensions of food waste reduction. 
    You can quantify impact in multiple dimensions: CO2 emissions saved, meals provided, 
    money saved, and community benefits. You create compelling impact reports that inspire 
    stakeholders and drive engagement. Your dashboards have helped increase participation by 60%.""",
    agent_type=AgentType.IMPACT,
    tools=["calculate_impact", "track_metrics", "generate_reports"],
    temperature=0.7
)

COORDINATOR_AGENT = AgentConfig(
    name="Coordinator Agent",
    role="Multi-Agent Orchestrator & Decision Maker",
    goal="Orchestrate other specialized agents to solve complex problems and optimize network operations",
    backstory="""You are a strategic orchestrator who manages a team of specialized AI agents. 
    You understand how to decompose complex problems, delegate tasks to experts, synthesize 
    their insights, and make optimal decisions. You think strategically about resource allocation, 
    priority management, and stakeholder value. You're comfortable making judgment calls and 
    can explain your reasoning clearly. You ensure all agents work together harmoniously 
    to achieve the network's mission of food waste reduction and hunger alleviation.""",
    agent_type=AgentType.COORDINATOR,
    tools=["delegate_task", "synthesize_insights", "make_decisions"],
    temperature=0.7
)

# Agent configurations mapping
AGENTS_CONFIG: Dict[AgentType, AgentConfig] = {
    AgentType.WASTE_PREDICTION: WASTE_PREDICTION_AGENT,
    AgentType.MATCHING: RECIPIENT_MATCHING_AGENT,
    AgentType.RECIPE: RECIPE_AGENT,
    AgentType.LOGISTICS: LOGISTICS_AGENT,
    AgentType.IMPACT: IMPACT_AGENT,
    AgentType.COORDINATOR: COORDINATOR_AGENT,
}

# Workflow definitions
WORKFLOW_DEFINITIONS = {
    "food_surplus_workflow": {
        "description": "Complete workflow for processing surplus food",
        "steps": [
            {"agent": AgentType.WASTE_PREDICTION, "task": "Analyze the surplus food context"},
            {"agent": AgentType.RECIPE, "task": "Generate utilization suggestions"},
            {"agent": AgentType.MATCHING, "task": "Find best recipients"},
            {"agent": AgentType.LOGISTICS, "task": "Plan logistics"},
            {"agent": AgentType.COORDINATOR, "task": "Synthesize and present solution"},
        ]
    },
    "impact_analysis_workflow": {
        "description": "Analyze and report on network impact",
        "steps": [
            {"agent": AgentType.IMPACT, "task": "Collect and aggregate impact data"},
            {"agent": AgentType.WASTE_PREDICTION, "task": "Trend analysis"},
            {"agent": AgentType.COORDINATOR, "task": "Generate comprehensive report"},
        ]
    },
    "optimization_workflow": {
        "description": "Optimize network operations",
        "steps": [
            {"agent": AgentType.WASTE_PREDICTION, "task": "Identify optimization opportunities"},
            {"agent": AgentType.LOGISTICS, "task": "Optimize distribution routes"},
            {"agent": AgentType.IMPACT, "task": "Quantify improvements"},
            {"agent": AgentType.COORDINATOR, "task": "Create action plan"},
        ]
    },
}

# System-wide settings
SYSTEM_CONFIG = {
    "model": "gemini-2.5-flash",
    "temperature": 0.7,
    "max_iterations": 15,
    "timeout_seconds": 300,
    "verbose": True,
    "memory_enabled": True,
    "log_agents": True,
}
