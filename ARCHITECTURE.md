# 🏗️ Multi-Agent System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Food Waste Network                            │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              FastAPI Backend (main.py)                   │   │
│  │         ✓ Authentication  ✓ Database Models             │   │
│  │         ✓ REST Endpoints  ✓ Error Handling              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                       │
│            ┌──────────────┴──────────────┐                       │
│            │                             │                       │
│  ┌─────────▼────────────┐    ┌──────────▼──────────┐             │
│  │   Gemini Services    │    │   Agent System      │             │
│  │  (Limited Use)       │    │   (NEW - Features)  │             │
│  └──────────────────────┘    └─────────────────────┘             │
│                                       │                           │
│                        ┌──────────────┴──────────────┐            │
│                        │                             │            │
│             ┌──────────▼──────┐        ┌────────────▼──────┐    │
│             │ Agent System    │        │ Workflow Engine   │    │
│             │ Core            │        │                   │    │
│             │ (agents.py)     │        │ (orchestration)   │    │
│             └──────────────────┘       └───────────────────┘    │
│                        │                                         │
│         ┌──────────────┼──────────────┐                         │
│         │              │              │                         │
│    ┌────▼─────┐  ┌────▼─────┐  ┌────▼─────┐                    │
│    │ Config   │  │ Tools    │  │ Examples │                    │
│    │ Manager  │  │ Registry │  │ & Tests  │                    │
│    │(config)  │  │ (tools)  │  │ (examples)│                   │
│    └──────────┘  └──────────┘  └──────────┘                    │
│         │              │              │                         │
│         └──────────────┼──────────────┘                         │
│                        │                                         │
│                ┌───────▼────────┐                              │
│                │ CrewAI/LangChain│                             │
│                │ Framework       │                             │
│                └────────┬────────┘                              │
│                         │                                        │
│                ┌────────▼────────┐                              │
│                │ Google Gemini   │                              │
│                │ 2.5 Flash       │                              │
│                └─────────────────┘                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

### Layer 1: API Layer (REST Endpoints)

```
FastAPI Routes
├── /api/agents/execute              → Execute single agent
├── /api/agents/workflow             → Execute multi-agent workflow
├── /api/agents/info                 → Get agent capabilities
├── /api/agents/history              → View execution history
├── /api/agents/predict-waste        → Waste prediction shortcut
├── /api/agents/match-recipients     → Matching shortcut
├── /api/agents/generate-recipes     → Recipe shortcut
├── /api/agents/calculate-impact     → Impact shortcut
└── /api/agents/optimize-logistics   → Logistics shortcut
```

### Layer 2: Orchestration Layer (Agent Management)

```
AgentOrchestrator (agents.py)
├── Initialize Agents
│   └── Load configurations
│   └── Setup CrewAI/Fallback
├── Execute Tasks
│   ├── Single agent execution
│   └── Fallback handling
├── Execute Workflows
│   ├── Multi-step execution
│   └── Context passing
├── Monitoring
│   ├── Execution history
│   └── Error tracking
└── Utilities
    ├── Agent info retrieval
    └── Task delegation
```

### Layer 3: Agent Layer (Specialized Agents)

```
6 Specialized Agents
├── 1. Waste Prediction Agent
│   ├── Role: Data Analyst
│   └── Tools: 3 tools
├── 2. Matching Agent
│   ├── Role: Optimizer
│   └── Tools: 3 tools
├── 3. Recipe Agent
│   ├── Role: Innovation Specialist
│   └── Tools: 3 tools
├── 4. Logistics Agent
│   ├── Role: Coordinator
│   └── Tools: 3 tools
├── 5. Impact Agent
│   ├── Role: Analyst
│   └── Tools: 3 tools
└── 6. Coordinator Agent
    ├── Role: Orchestrator
    └── Tools: 3 tools
```

### Layer 4: Tools Layer (18 Capabilities)

```
Tool Registry (agent_tools.py)
├── Data Analysis (3)
│   ├── analyze_historical_data()
│   ├── predict_surplus()
│   └── track_metrics()
├── Matching (3)
│   ├── match_recipients()
│   ├── calculate_match_score()
│   └── optimize_distribution()
├── Recipe (3)
│   ├── generate_recipes()
│   ├── suggest_usages()
│   └── calculate_value_added()
├── Logistics (3)
│   ├── schedule_pickup()
│   ├── optimize_routes()
│   └── check_logistics_feasibility()
├── Impact (3)
│   ├── calculate_impact()
│   ├── track_metrics()
│   └── generate_reports()
└── Coordination (3)
    ├── delegate_task()
    ├── synthesize_insights()
    └── make_decisions()
```

### Layer 5: LLM Layer (Brain)

```
Google Gemini 2.5 Flash
├── Model: gemini-2.5-flash
├── API: CrewAI/LangChain
├── Features:
│   ├── Text generation
│   ├── Analysis
│   ├── Planning
│   └── Reasoning
└── Configuration:
    ├── Temperature: 0.7
    ├── Max tokens: 2048
    └── Timeout: 300s
```

---

## Data Flow Architecture

### Single Agent Execution Flow

```
Client Request
    │
    ▼
POST /api/agents/execute
    │
    ├─ Validate request
    │   ├─ Agent type exists?
    │   ├─ Context valid?
    │   └─ Return error if not
    │
    ▼
AgentOrchestrator.execute_agent_task()
    │
    ├─ Get agent configuration
    │
    ▼
Check CrewAI Available?
    │
    ├─ YES: Use CrewAI path
    │   │
    │   ├─ Create Task
    │   ├─ Execute with Agent
    │   └─ Return result
    │
    └─ NO: Use Fallback path
        │
        ├─ Route to agent handler
        ├─ Call appropriate tools
        └─ Return result
    │
    ▼
Format AgentResponse
    │
    ├─ Agent name
    ├─ Result data
    ├─ Timestamp
    ├─ Success status
    └─ Error (if any)
    │
    ▼
Store in Execution History
    │
    ▼
Return JSON Response (200)
```

### Workflow Execution Flow

```
Client Request
    │
    ▼
POST /api/agents/workflow
    │
    ├─ Validate workflow name
    │
    ▼
AgentOrchestrator.execute_workflow()
    │
    ├─ Get workflow definition
    │
    ▼
For Each Step in Workflow:
    │
    ├─ Get agent type
    ├─ Get task description
    │
    ▼
Execute Agent Task
    │
    ├─ Get result
    ├─ Update context
    ├─ Check success
    │   ├─ YES: Continue to next step
    │   └─ NO: Stop and report error
    │
    ▼
Store step result
    │
    ▼
Final Step: Coordinator Agent
    │
    ├─ Synthesizes all insights
    ├─ Makes decisions
    └─ Returns final output
    │
    ▼
Format WorkflowResponse
    │
    ├─ Workflow name
    ├─ All step results
    ├─ Final output
    └─ Overall success
    │
    ▼
Store in Execution History
    │
    ▼
Return JSON Response (200)
```

---

## Configuration Hierarchy

```
SYSTEM_CONFIG (global settings)
├── model: "gemini-2.5-flash"
├── temperature: 0.7
├── max_iterations: 15
├── timeout_seconds: 300
├── verbose: True
├── memory_enabled: True
└── log_agents: True
    │
    ▼
AGENTS_CONFIG (agent definitions)
├── AgentType.WASTE_PREDICTION
│   ├── name, role, goal, backstory
│   ├── tools: [list of 3]
│   ├── temperature: 0.6
│   └── max_tokens: 2048
│
├── AgentType.MATCHING
│   ├── name, role, goal, backstory
│   ├── tools: [list of 3]
│   ├── temperature: 0.7
│   └── max_tokens: 2048
│
├── [4 more agents...]
    │
    ▼
WORKFLOW_DEFINITIONS (multi-step workflows)
├── food_surplus_workflow
│   └── 5 sequential steps
├── impact_analysis_workflow
│   └── 3 sequential steps
└── optimization_workflow
    └── 4 sequential steps
    │
    ▼
TOOL_REGISTRY (available tools)
└── 18 registered tools
    with functions and metadata
```

---

## Request-Response Architecture

### Request Structure

```json
{
    "agent_type": "string",
    "task_description": "string",
    "context": {
        "key": "value",
        ...
    }
}
```

### Response Structure

```json
{
    "agent_name": "string",
    "agent_type": "string",
    "task": "string",
    "result": {
        "key": "value",
        ...
    },
    "timestamp": "ISO8601",
    "success": boolean,
    "error": "string (if any)"
}
```

### Workflow Request Structure

```json
{
    "workflow_name": "string",
    "input_data": {
        "key": "value",
        ...
    }
}
```

### Workflow Response Structure

```json
{
    "workflow": "string",
    "description": "string",
    "started_at": "ISO8601",
    "completed_at": "ISO8601",
    "steps": [
        {
            "agent": "string",
            "task": "string",
            "result": {...},
            "success": boolean
        },
        ...
    ],
    "final_output": {...},
    "success": boolean,
    "error": "string (if any)"
}
```

---

## Error Handling Architecture

```
Request Error
    │
    ├─ Invalid agent type
    │   └─ 400: Return available agents
    │
    ├─ Invalid context
    │   └─ 400: Return error details
    │
    ├─ Agent execution error
    │   └─ 500: Return error message
    │
    ├─ CrewAI unavailable
    │   └─ Use fallback implementation
    │
    └─ Agents system unavailable
        └─ 503: Service unavailable
```

---

## Workflow Architecture

### Food Surplus Workflow

```
Food Item Input
    │
    ▼
Agent 1: Waste Prediction
├─ Task: Analyze context
└─ Output: Context analysis
    │
    ▼
Agent 2: Recipe Agent
├─ Task: Generate utilization ideas
└─ Output: Recipes and suggestions
    │
    ▼
Agent 3: Matching Agent
├─ Task: Find best recipients
└─ Output: Ranked matches
    │
    ▼
Agent 4: Logistics Agent
├─ Task: Plan delivery
└─ Output: Logistics plan
    │
    ▼
Agent 5: Coordinator Agent
├─ Task: Synthesize all insights
├─ Task: Make final decisions
└─ Output: Complete solution
    │
    ▼
Final Output: Action Plan
```

---

## Deployment Architecture

```
┌─────────────────────────────────┐
│   Development Environment       │
│  - Local testing               │
│  - Fast iteration              │
│  - Full logging                │
└─────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│   Staging Environment           │
│  - Pre-production testing       │
│  - Performance validation       │
│  - Security checks              │
└─────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│   Production Environment        │
│  - FastAPI server               │
│  - Database (MySQL)             │
│  - Gemini API                   │
│  - CrewAI/LangChain             │
│  - Monitoring & Logging         │
└─────────────────────────────────┘
```

---

## Fallback Architecture

```
Agent Execution Request
    │
    ├─ Check CrewAI available?
    │   │
    │   ├─ YES: Use CrewAI
    │   │   └─ Full AI capabilities
    │   │
    │   └─ NO: Use Fallback
    │       │
    │       ├─ Route by agent type
    │       │
    │       ├─ Agent 1: Call _handle_waste_prediction()
    │       ├─ Agent 2: Call _handle_matching()
    │       ├─ Agent 3: Call _handle_recipe()
    │       ├─ Agent 4: Call _handle_logistics()
    │       ├─ Agent 5: Call _handle_impact()
    │       └─ Agent 6: Call _handle_coordinator()
    │       │
    │       ├─ Match task to tools
    │       ├─ Call appropriate tool functions
    │       └─ Return results
    │
    └─ Return standardized response
```

---

## Performance Architecture

```
Request Concurrency
├─ Single agent execution: Synchronous
├─ Multiple requests: Independent executions
└─ Workflow execution: Sequential steps

Response Time
├─ Agent info: < 1 second
├─ Single agent: 5-30 seconds
├─ Workflow: 30-120 seconds
└─ Tool execution: < 1 second

Resource Usage
├─ Memory: ~500MB baseline
├─ CPU: Varies with Gemini calls
├─ API quota: Depends on request volume
└─ Database: Minimal (history tracking)
```

---

## Security Architecture

```
API Security
├─ CORS middleware configured
├─ Input validation (Pydantic)
├─ Error message sanitization
├─ No API key in responses
└─ No sensitive data logging

Data Protection
├─ Database encryption (if configured)
├─ Environment variable management
├─ Secure credential storage
└─ No plain-text secrets

Access Control
├─ Optional authentication
├─ Admin endpoints (future)
└─ Rate limiting (future)
```

---

## Monitoring Architecture

```
Execution History Tracking
├─ Every execution logged
├─ Timestamp recorded
├─ Success/failure status
├─ Error messages captured
└─ Results stored in memory

Status Monitoring
├─ Agent availability check
├─ Tool availability check
├─ Gemini API status
└─ System health check

Performance Metrics
├─ Execution time
├─ Tool usage frequency
├─ Agent success rate
└─ Error frequency
```

---

## Extension Architecture

```
Adding New Agent
├─ Define in AGENTS_CONFIG
├─ Create agent configuration
├─ Define agent tools
├─ Register tools
├─ Add handler in orchestrator
└─ Add API endpoint

Adding New Tools
├─ Define tool function
├─ Create Tool class
├─ Register in TOOL_REGISTRY
├─ Add to agent config
└─ Test with agent

Adding New Workflow
├─ Define workflow steps
├─ Add to WORKFLOW_DEFINITIONS
├─ Test workflow execution
├─ Document workflow
└─ Add API example
```

---

This architecture provides:
- ✅ Separation of concerns
- ✅ Easy extensibility
- ✅ Graceful fallback
- ✅ Comprehensive monitoring
- ✅ Strong security
- ✅ Scalability potential
- ✅ Clear error handling

Perfect for production! 🚀
