# ✨ Multi-Agent System for Food Waste Network

## Overview

This document provides comprehensive information about the multi-agent AI system integrated into the Food Waste Network project. Powered by CrewAI and Google Gemini, this system enables intelligent automation of food waste reduction operations.

## Architecture

### Agent Types

The system includes 6 specialized agents, each with distinct roles and capabilities:

#### 1. **Waste Prediction Agent** 📊
- **Role:** Data Analyst & Waste Pattern Expert
- **Goal:** Analyze food waste patterns and predict surplus
- **Key Capabilities:**
  - Historical data analysis
  - Trend identification
  - Surplus quantity forecasting
  - Actionable waste reduction recommendations

**Available Tools:**
- `analyze_historical_data`: Identify patterns in food waste
- `predict_surplus`: Forecast surplus for upcoming periods
- `generate_recommendations`: Suggest waste reduction strategies

**Example Usage:**
```json
POST /api/agents/predict-waste
{
    "historical_data": [
        {"date": "2024-01-01", "category": "vegetables", "quantity": 10},
        {"date": "2024-01-02", "category": "vegetables", "quantity": 12},
        {"date": "2024-01-03", "category": "vegetables", "quantity": 11}
    ],
    "days_ahead": 7
}
```

#### 2. **Recipient Matching Agent** 🎯
- **Role:** Supply-Demand Optimizer
- **Goal:** Match surplus food with most appropriate recipients
- **Key Capabilities:**
  - Intelligent matching based on multiple criteria
  - Distance and capacity optimization
  - Impact maximization
  - Recipient scoring (0-100%)

**Available Tools:**
- `match_recipients`: Find suitable recipient organizations
- `calculate_match_score`: Evaluate compatibility
- `optimize_distribution`: Maximize impact distribution

**Example Usage:**
```json
POST /api/agents/match-recipients
{
    "food_item": {
        "name": "Fresh Vegetables",
        "quantity": 50,
        "unit": "kg",
        "category": "produce",
        "expiry_hours": 24,
        "location": "Restaurant Downtown"
    },
    "recipient_pool": [
        {
            "id": 1,
            "name": "Hope Shelter",
            "distance": 5,
            "capacity_kg": 100,
            "preferred_categories": ["produce", "dairy"],
            "pickup_speed": "fast"
        },
        {
            "id": 2,
            "name": "Community Food Bank",
            "distance": 12,
            "capacity_kg": 500,
            "preferred_categories": ["all"],
            "pickup_speed": "standard"
        }
    ]
}
```

#### 3. **Recipe & Utilization Agent** 🍳
- **Role:** Culinary & Food Innovation Specialist
- **Goal:** Generate creative recipes and alternative uses for surplus
- **Key Capabilities:**
  - Recipe generation from available ingredients
  - Food preservation technique suggestions
  - Value-added processing recommendations
  - Preparation complexity assessment

**Available Tools:**
- `generate_recipes`: Create recipes from surplus items
- `suggest_usages`: Propose alternative uses
- `calculate_value_added`: Evaluate processing value

**Example Usage:**
```json
POST /api/agents/generate-recipes
{
    "food_items": ["tomatoes", "onions", "garlic", "herbs"],
    "quantity_kg": 50
}
```

#### 4. **Logistics Coordinator Agent** 🚚
- **Role:** Supply Chain & Pickup Coordinator
- **Goal:** Coordinate food distribution with optimal logistics
- **Key Capabilities:**
  - Pickup scheduling and coordination
  - Route optimization
  - Cold chain management
  - Feasibility assessment

**Available Tools:**
- `schedule_pickup`: Plan pickup operations
- `optimize_routes`: Minimize delivery distances
- `check_logistics_feasibility`: Assess delivery viability

**Example Usage:**
```json
POST /api/agents/optimize-logistics
{
    "food_item": {
        "id": 1,
        "name": "Perishable Items",
        "location": "Restaurant A",
        "quantity": 50
    },
    "recipient": {
        "id": 1,
        "name": "Shelter B",
        "location": "Downtown",
        "distance": 8
    }
}
```

#### 5. **Impact & Sustainability Agent** 📈
- **Role:** Impact Measurement & Sustainability Analyst
- **Goal:** Track and report on environmental/social impact
- **Key Capabilities:**
  - Impact metrics calculation (CO2, meals, money saved)
  - Sustainability reporting
  - Trend analysis
  - Engagement increase strategies

**Available Tools:**
- `calculate_impact`: Compute environmental metrics
- `track_metrics`: Aggregate impact data over periods
- `generate_reports`: Create comprehensive impact reports

**Example Usage:**
```json
POST /api/agents/calculate-impact
{
    "transaction": {
        "id": 1,
        "item_name": "Surplus Vegetables",
        "quantity": 50
    }
}
```

#### 6. **Coordinator Agent** 🎭
- **Role:** Multi-Agent Orchestrator & Decision Maker
- **Goal:** Orchestrate specialized agents for complex problems
- **Capabilities:**
  - Complex problem decomposition
  - Multi-agent delegation
  - Insight synthesis
  - Strategic decision making

**Available Tools:**
- `delegate_task`: Assign tasks to specialized agents
- `synthesize_insights`: Combine insights from multiple agents
- `make_decisions`: Execute optimal decisions

---

## API Endpoints

### 1. Execute Agent Task
```
POST /api/agents/execute
```

Execute a task using a specific agent directly.

**Request Body:**
```json
{
    "agent_type": "waste_prediction",
    "task_description": "Analyze our surplus food patterns from last month",
    "context": {
        "historical_data": [...],
        "days_ahead": 7
    }
}
```

**Response:**
```json
{
    "agent_name": "Waste Prediction Agent",
    "agent_type": "waste_prediction",
    "task": "Analyze our surplus food patterns from last month",
    "result": {
        "trend": "increasing",
        "predictions": [...]
    },
    "timestamp": "2024-01-15T10:30:00",
    "success": true
}
```

### 2. Execute Workflow
```
POST /api/agents/workflow
```

Execute a predefined multi-agent workflow.

**Available Workflows:**

1. **food_surplus_workflow**
   - Analyze surplus food context
   - Generate utilization suggestions
   - Find best recipients
   - Plan logistics
   - Present synthesized solution

2. **impact_analysis_workflow**
   - Collect impact data
   - Analyze trends
   - Generate comprehensive report

3. **optimization_workflow**
   - Identify optimization opportunities
   - Optimize distribution routes
   - Quantify improvements
   - Create action plan

**Request Body:**
```json
{
    "workflow_name": "food_surplus_workflow",
    "input_data": {
        "food_item": {
            "name": "Fresh Vegetables",
            "quantity": 100,
            "category": "produce"
        },
        "recipient_pool": [...]
    }
}
```

**Response:**
```json
{
    "workflow": "food_surplus_workflow",
    "description": "Complete workflow for processing surplus food",
    "started_at": "2024-01-15T10:30:00",
    "completed_at": "2024-01-15T10:35:00",
    "steps": [
        {
            "agent": "waste_prediction",
            "task": "Analyze the surplus food context",
            "result": {...},
            "success": true
        },
        ...
    ],
    "final_output": {...},
    "success": true
}
```

### 3. Get Agent Information
```
GET /api/agents/info
```

Retrieve information about all agents and their capabilities.

**Response:**
```json
{
    "agents": {
        "waste_prediction": {
            "name": "Waste Prediction Agent",
            "role": "Data Analyst & Waste Pattern Expert",
            "goal": "Analyze historical food waste data...",
            "tools": ["analyze_historical_data", "predict_surplus", "generate_recommendations"]
        },
        ...
    },
    "total_agents": 6,
    "available_workflows": ["food_surplus_workflow", "impact_analysis_workflow", "optimization_workflow"]
}
```

### 4. Get Execution History
```
GET /api/agents/history?limit=10
```

Retrieve recent agent execution history.

**Response:**
```json
{
    "total_executions": 145,
    "recent_executions": [
        {
            "agent": "Waste Prediction Agent",
            "agent_type": "waste_prediction",
            "task": "Analyze historical data",
            "success": true,
            "timestamp": "2024-01-15T10:30:00"
        },
        ...
    ]
}
```

### 5. Specialized Agent Endpoints

#### Predict Waste
```
POST /api/agents/predict-waste
```

#### Match Recipients
```
POST /api/agents/match-recipients
```

#### Generate Recipes
```
POST /api/agents/generate-recipes
```

#### Calculate Impact
```
POST /api/agents/calculate-impact
```

#### Optimize Logistics
```
POST /api/agents/optimize-logistics
```

---

## Workflows

### Food Surplus Workflow

This workflow handles the complete process of dealing with surplus food:

1. **Waste Prediction Agent** analyzes the surplus context
2. **Recipe Agent** generates utilization suggestions
3. **Matching Agent** identifies best recipient matches
4. **Logistics Agent** plans pickup and delivery
5. **Coordinator Agent** synthesizes all insights and presents solution

**Example:**
```json
POST /api/agents/workflow
{
    "workflow_name": "food_surplus_workflow",
    "input_data": {
        "food_item": {
            "name": "Vegetables",
            "quantity": 100,
            "category": "produce",
            "expiry_hours": 24
        },
        "recipient_pool": [
            {"id": 1, "name": "Shelter A", "distance": 5},
            {"id": 2, "name": "Food Bank B", "distance": 12}
        ]
    }
}
```

### Impact Analysis Workflow

Comprehensive analysis of network impact:

1. **Impact Agent** collects and aggregates impact data
2. **Waste Prediction Agent** performs trend analysis
3. **Coordinator Agent** generates comprehensive report

### Optimization Workflow

Identifies and implements operational improvements:

1. **Waste Prediction Agent** finds optimization opportunities
2. **Logistics Agent** optimizes distribution routes
3. **Impact Agent** quantifies improvements
4. **Coordinator Agent** creates action plan

---

## Configuration

### System Config (agents_config.py)

```python
SYSTEM_CONFIG = {
    "model": "gemini-2.5-flash",
    "temperature": 0.7,
    "max_iterations": 15,
    "timeout_seconds": 300,
    "verbose": True,
    "memory_enabled": True,
    "log_agents": True,
}
```

### Agent Customization

Each agent has configurable parameters:

```python
AgentConfig(
    name="Custom Agent",
    role="Agent Role",
    goal="Agent Goal",
    backstory="Agent Background Story",
    agent_type=AgentType.COORDINATOR,
    tools=["tool1", "tool2"],
    temperature=0.7,
    max_tokens=2048
)
```

---

## Tools Reference

### Tool Types

#### Data Analysis Tools
- `analyze_historical_data`: Parse and analyze historical records
- `predict_surplus`: Generate forecasts
- `track_metrics`: Aggregate metrics

#### Matching Tools
- `match_recipients`: Find compatible recipients
- `calculate_match_score`: Evaluate compatibility (0-100)
- `optimize_distribution`: Maximize impact

#### Recipe Tools
- `generate_recipes`: Create recipes from ingredients
- `suggest_usages`: Propose alternative uses
- `calculate_value_added`: Evaluate value increase

#### Logistics Tools
- `schedule_pickup`: Plan pickups
- `optimize_routes`: Minimize distances
- `check_logistics_feasibility`: Verify feasibility

#### Impact Tools
- `calculate_impact`: Compute metrics
- `track_metrics`: Aggregate data
- `generate_reports`: Create reports

#### Coordination Tools
- `delegate_task`: Assign tasks
- `synthesize_insights`: Combine insights
- `make_decisions`: Make optimal decisions

---

## Integration Examples

### Python Integration

```python
from agents import get_orchestrator
from agents_config import AgentType

# Get orchestrator instance
orchestrator = get_orchestrator()

# Execute agent task
response = orchestrator.execute_agent_task(
    agent_type=AgentType.WASTE_PREDICTION,
    task_description="Predict surplus for next week",
    context={
        "historical_data": [...],
        "days_ahead": 7
    }
)

print(response.result)
```

### JavaScript/Frontend Integration

```javascript
// Execute agent task
const response = await fetch('/api/agents/execute', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        agent_type: 'matching',
        task_description: 'Find best recipients for vegetables',
        context: {
            food_item: {...},
            recipient_pool: [...]
        }
    })
});

const result = await response.json();
console.log(result);
```

### Execute Workflow Example

```javascript
const response = await fetch('/api/agents/workflow', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        workflow_name: 'food_surplus_workflow',
        input_data: {
            food_item: {
                name: 'Vegetables',
                quantity: 100,
                category: 'produce'
            },
            recipient_pool: [...]
        }
    })
});

const result = await response.json();
console.log('Workflow completed:', result);
```

---

## Performance Considerations

### Agent Execution Time
- Average single agent execution: 5-30 seconds
- Workflow execution: 30-120 seconds depending on complexity
- Tool execution: < 1 second (fallback implementation)

### Optimization Tips
1. Provide detailed context for better results
2. Use specific agent types for targeted tasks
3. Leverage workflows for complex operations
4. Monitor execution history for patterns

### Scaling
- Agents are stateless and can be parallelized
- Use coordinator agent for complex multi-step tasks
- Implement caching for frequently used predictions
- Consider async execution for long-running workflows

---

## Error Handling

### Common Errors

**503 - Agent System Not Available**
```json
{
    "detail": "Agent system not available"
}
```
Solution: Ensure CrewAI and dependencies are installed

**400 - Invalid Agent Type**
```json
{
    "detail": "Invalid agent type. Available: [list of valid agents]"
}
```
Solution: Use valid agent type from available list

**500 - Agent Execution Error**
```json
{
    "detail": "Agent execution error: [error message]"
}
```
Solution: Check context data validity and agent configuration

---

## Troubleshooting

### Agents Not Initializing

1. Check Gemini API key is set in `.env`
2. Verify all dependencies installed: `pip install -r requirements.txt`
3. Check logs for initialization errors
4. Fallback implementation will be used if CrewAI not available

### Task Execution Failures

1. Validate input context data
2. Check agent type is correctly specified
3. Review execution history: `GET /api/agents/history`
4. Ensure GEMINI_API_KEY is valid

### Workflow Issues

1. Verify workflow name exists
2. Check input_data matches workflow expectations
3. Review step-by-step results in response
4. Check execution history for errors

---

## Future Enhancements

1. **Advanced Learning**: Agents learn from past interactions
2. **Multi-Language Support**: Agents respond in multiple languages
3. **Real-time Analytics**: Live performance monitoring
4. **Custom Workflows**: User-defined agent workflows
5. **Integration APIs**: Connect with external services
6. **Predictive Improvements**: ML-based accuracy enhancement
7. **Blockchain Integration**: Immutable transaction records
8. **Mobile Agents**: Lightweight agents for mobile devices

---

## Contributing

To add new agents or tools:

1. Define agent configuration in `agents_config.py`
2. Implement tools in `agent_tools.py`
3. Register tools in `TOOL_REGISTRY`
4. Add API endpoint in `main.py`
5. Test with example workflows
6. Update documentation

---

## Support

For issues, questions, or suggestions:
- Check documentation first
- Review execution history
- Check agent info endpoint
- Enable verbose logging
- Contact development team

---

## License

This multi-agent system is part of the Food Waste Network project and follows the same licensing terms.
