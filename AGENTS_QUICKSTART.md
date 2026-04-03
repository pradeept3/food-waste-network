# 🚀 Multi-Agent System Quick Start Guide

## Installation

### 1. Update Dependencies

```bash
cd backend
pip install -r requirements.txt
```

Key new packages:
- `crewai`: Multi-agent framework
- `langchain`: LLM integration
- `langgraph`: Agent workflows
- `pydantic-ai`: Type-safe agents

### 2. Set Environment Variables

Create or update `.env` in the backend directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DB=food_waste_network
```

Get your Gemini API key from: https://aistudio.google.com/app/apikey

---

## Quick Start

### 1. Start the Backend Server

```bash
cd backend
python -m uvicorn main:app --reload
```

The server will start at `http://localhost:8000`

### 2. Access API Documentation

Open in browser: `http://localhost:8000/docs`

You'll see all API endpoints with interactive documentation.

---

## Using the Agents

### Method 1: Direct API Calls

#### A. Predict Waste

```bash
curl -X POST http://localhost:8000/api/agents/predict-waste \
  -H "Content-Type: application/json" \
  -d '{
    "historical_data": [
      {"date": "2024-01-01", "category": "vegetables", "quantity": 15},
      {"date": "2024-01-02", "category": "vegetables", "quantity": 18},
      {"date": "2024-01-03", "category": "vegetables", "quantity": 20}
    ],
    "days_ahead": 7
  }'
```

#### B. Match Recipients

```bash
curl -X POST http://localhost:8000/api/agents/match-recipients \
  -H "Content-Type: application/json" \
  -d '{
    "food_item": {
      "name": "Fresh Vegetables",
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
        "preferred_categories": ["produce"]
      },
      {
        "id": 2,
        "name": "Food Bank",
        "distance": 12,
        "capacity_kg": 500,
        "preferred_categories": ["all"]
      }
    ]
  }'
```

#### C. Generate Recipes

```bash
curl -X POST http://localhost:8000/api/agents/generate-recipes \
  -H "Content-Type: application/json" \
  -d '{
    "food_items": ["tomatoes", "onions", "garlic", "basil"],
    "quantity_kg": 50
  }'
```

#### D. Execute Full Workflow

```bash
curl -X POST http://localhost:8000/api/agents/workflow \
  -H "Content-Type: application/json" \
  -d '{
    "workflow_name": "food_surplus_workflow",
    "input_data": {
      "food_item": {
        "name": "Vegetables",
        "quantity": 100,
        "category": "produce"
      },
      "recipient_pool": [
        {"id": 1, "name": "Shelter A", "distance": 5, "capacity_kg": 150}
      ]
    }
  }'
```

### Method 2: Python Code

```python
from agents import get_orchestrator
from agents_config import AgentType

# Initialize
orchestrator = get_orchestrator()

# Example: Predict waste
response = orchestrator.execute_agent_task(
    agent_type=AgentType.WASTE_PREDICTION,
    task_description="Predict vegetable surplus for next week",
    context={
        "historical_data": [
            {"date": "2024-01-01", "category": "vegetables", "quantity": 15},
            {"date": "2024-01-02", "category": "vegetables", "quantity": 18},
        ],
        "days_ahead": 7
    }
)

print(response.result)
```

### Method 3: Frontend (JavaScript/React)

```javascript
// Execute agent task
async function predictWaste() {
    const response = await fetch('/api/agents/predict-waste', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            historical_data: [
                {date: "2024-01-01", category: "vegetables", quantity: 15},
                {date: "2024-01-02", category: "vegetables", quantity: 18}
            ],
            days_ahead: 7
        })
    });
    
    const result = await response.json();
    console.log('Prediction:', result);
}

// Execute workflow
async function executeWorkflow() {
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
                recipient_pool: [
                    {id: 1, name: 'Shelter A', distance: 5, capacity_kg: 150}
                ]
            }
        })
    });
    
    const result = await response.json();
    console.log('Workflow result:', result);
}
```

---

## Agent Reference

### Waste Prediction Agent 📊
**Best for:** Forecasting surplus, trend analysis, recommendations

```bash
curl -X POST http://localhost:8000/api/agents/execute \
  -H "Content-Type: application/json" \
  -d '{
    "agent_type": "waste_prediction",
    "task_description": "Analyze our surplus patterns",
    "context": {"historical_data": [...]}
  }'
```

### Matching Agent 🎯
**Best for:** Finding recipients, optimizing impact

```bash
curl -X POST http://localhost:8000/api/agents/execute \
  -H "Content-Type: application/json" \
  -d '{
    "agent_type": "matching",
    "task_description": "Find best recipients for vegetables",
    "context": {"food_item": {...}, "recipient_pool": [...]}
  }'
```

### Recipe Agent 🍳
**Best for:** Value-added uses, preservation ideas

```bash
curl -X POST http://localhost:8000/api/agents/execute \
  -H "Content-Type: application/json" \
  -d '{
    "agent_type": "recipe",
    "task_description": "Generate recipes for vegetables",
    "context": {"food_items": [...], "quantity_kg": 50}
  }'
```

### Logistics Agent 🚚
**Best for:** Scheduling, route optimization

```bash
curl -X POST http://localhost:8000/api/agents/execute \
  -H "Content-Type: application/json" \
  -d '{
    "agent_type": "logistics",
    "task_description": "Schedule pickups and optimize routes",
    "context": {"food_item": {...}, "recipient": {...}}
  }'
```

### Impact Agent 📈
**Best for:** Measuring impact, reporting

```bash
curl -X POST http://localhost:8000/api/agents/execute \
  -H "Content-Type: application/json" \
  -d '{
    "agent_type": "impact",
    "task_description": "Calculate impact of food rescue",
    "context": {"transaction": {...}}
  }'
```

### Coordinator Agent 🎭
**Best for:** Complex problems, multi-step solutions

```bash
curl -X POST http://localhost:8000/api/agents/execute \
  -H "Content-Type: application/json" \
  -d '{
    "agent_type": "coordinator",
    "task_description": "Orchestrate entire food rescue operation",
    "context": {
      "food_item": {...},
      "recipient_pool": [...],
      "logistics_data": {...}
    }
  }'
```

---

## Available Workflows

### 1. Food Surplus Workflow

Process surplus food from start to finish:

1. **Waste Prediction**: Analyze context
2. **Recipe Agent**: Generate utilization ideas
3. **Matching Agent**: Find recipients
4. **Logistics Agent**: Plan delivery
5. **Coordinator**: Synthesize solution

```bash
curl -X POST http://localhost:8000/api/agents/workflow \
  -H "Content-Type: application/json" \
  -d '{
    "workflow_name": "food_surplus_workflow",
    "input_data": {...}
  }'
```

### 2. Impact Analysis Workflow

Analyze and report impact:

1. **Impact Agent**: Collect data
2. **Waste Prediction Agent**: Trend analysis
3. **Coordinator**: Generate report

### 3. Optimization Workflow

Improve operations:

1. **Waste Prediction**: Find opportunities
2. **Logistics**: Optimize routes
3. **Impact**: Quantify improvements
4. **Coordinator**: Create action plan

---

## Common Use Cases

### Use Case 1: Restaurant Surplus Management

```javascript
const restaurantData = {
    workflow_name: 'food_surplus_workflow',
    input_data: {
        food_item: {
            name: 'Daily Surplus',
            quantity: 50,
            category: 'mixed',
            location: 'Restaurant Downtown'
        },
        recipient_pool: [
            {id: 1, name: 'Local Food Bank', distance: 3},
            {id: 2, name: 'Community Shelter', distance: 8}
        ]
    }
};

// Execute workflow
```

### Use Case 2: Farm Produce Prediction

```javascript
const farmData = {
    agent_type: 'waste_prediction',
    task_description: 'Predict seasonal produce surplus',
    context: {
        historical_data: [
            // Last year's daily production
        ],
        days_ahead: 30
    }
};
```

### Use Case 3: Value-Added Processing

```javascript
const processingData = {
    agent_type: 'recipe',
    task_description: 'Generate preservation recipes',
    context: {
        food_items: ['tomatoes', 'peppers', 'onions'],
        quantity_kg: 200
    }
};
```

---

## Monitoring & Debugging

### Check Agent Status

```bash
curl http://localhost:8000/api/agents/info
```

### View Execution History

```bash
curl "http://localhost:8000/api/agents/history?limit=20"
```

### Enable Verbose Logging

Edit `agents_config.py`:
```python
SYSTEM_CONFIG = {
    "verbose": True,  # Enable detailed logging
    "log_agents": True,
}
```

---

## Troubleshooting

### Issue: "Agent system not available"

**Solution:**
```bash
# Check if all packages installed
pip install -r requirements.txt

# Verify API key
echo $GEMINI_API_KEY

# Restart server
```

### Issue: Slow responses

**Solution:**
- Check context data - remove unnecessary fields
- Reduce dataset size for initial testing
- Use specific agents instead of coordinator

### Issue: Invalid agent type error

**Solution:**
```bash
# Valid agent types:
# - waste_prediction
# - matching
# - recipe
# - logistics
# - impact
# - coordinator

# Check spelling and capitalization
```

---

## Performance Tips

1. **Batch Operations**: Group multiple items
2. **Simplified Context**: Remove unnecessary details
3. **Agent Selection**: Use specific agents for targeted tasks
4. **Async Execution**: Use background tasks for long workflows

---

## Testing

Test the agents using provided examples:

```bash
cd backend
python agents_examples.py
```

Run specific examples:

```python
from agents_examples import WASTE_PREDICTION_EXAMPLE, MATCHING_EXAMPLE

# Use WASTE_PREDICTION_EXAMPLE['request'] for testing
# Use MATCHING_EXAMPLE['request'] for testing
```

---

## Integration with Frontend

### React Component Example

```jsx
import { useState } from 'react';

function AgentPanel() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const executePrediction = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/agents/predict-waste', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    historical_data: [
                        {date: "2024-01-01", category: "vegetables", quantity: 15}
                    ],
                    days_ahead: 7
                })
            });
            const data = await response.json();
            setResult(data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={executePrediction} disabled={loading}>
                {loading ? 'Processing...' : 'Predict Waste'}
            </button>
            {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
        </div>
    );
}

export default AgentPanel;
```

---

## Next Steps

1. **Explore Agent Info**: `GET /api/agents/info`
2. **Test Simple Agent**: Start with waste_prediction
3. **Try Workflows**: Execute food_surplus_workflow
4. **Monitor History**: Track executions with history endpoint
5. **Build Features**: Integrate into frontend

---

## Support & Documentation

- **Full Docs**: See `AGENTS_DOCUMENTATION.md`
- **Examples**: See `agents_examples.py`
- **API Docs**: Visit `http://localhost:8000/docs` when server running
- **Config**: Modify `agents_config.py` for customization

---

## Key Files

| File | Purpose |
|------|---------|
| `agents.py` | Main agent orchestrator and execution logic |
| `agents_config.py` | Agent definitions and workflow configurations |
| `agent_tools.py` | Tools that agents can use |
| `agents_examples.py` | Test cases and examples |
| `AGENTS_DOCUMENTATION.md` | Comprehensive documentation |

---

## Success Indicators ✅

Your multi-agent system is working correctly when:

- ✅ Can execute `GET /api/agents/info` successfully
- ✅ Agents return 200 responses with valid JSON
- ✅ Execution history shows completed tasks
- ✅ Workflows complete all steps successfully
- ✅ Impact metrics are calculated correctly
- ✅ Recipients are matched with appropriate scores

---

Happy multi-agent food waste reduction! 🌍♻️✨
