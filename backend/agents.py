"""
Multi-Agent System for Food Waste Network
Implements agents using CrewAI and LangChain for complex problem solving
"""

import os
import json
from typing import List, Dict, Any, Callable
from datetime import datetime
import logging
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try to import CrewAI components
try:
    from crewai import Agent, Task, Crew, Process
    CREWAI_AVAILABLE = True
except ImportError:
    CREWAI_AVAILABLE = False
    logger.warning("CrewAI not available, using fallback implementation")

# Import configuration and tools
from agents_config import (
    AgentType, AGENTS_CONFIG, WORKFLOW_DEFINITIONS, SYSTEM_CONFIG, AgentConfig
)
from agent_tools import TOOL_REGISTRY, get_agent_tools, Tool

class AgentResponse(BaseModel):
    """Response from an agent"""
    agent_name: str
    agent_type: AgentType
    task: str
    result: Dict[str, Any]
    timestamp: str
    success: bool
    error: str = None

class AgentOrchestrator:
    """
    Main orchestrator for managing multi-agent system
    Coordinates between different specialized agents
    """
    
    def __init__(self):
        """Initialize the multi-agent system"""
        self.agents: Dict[AgentType, Agent] = {}
        self.crew: Crew = None
        self.execution_history: List[AgentResponse] = []
        self.initialize_agents()
    
    def initialize_agents(self):
        """Initialize all agents with their configurations"""
        if not CREWAI_AVAILABLE:
            logger.info("Using fallback agent implementation (CrewAI not installed)")
            return
        
        try:
            from langchain.llms import GoogleGenerativeAI
            
            # Get Gemini API key
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                logger.error("GEMINI_API_KEY not set")
                return
            
            llm = GoogleGenerativeAI(
                model="gemini-2.5-flash",
                google_api_key=api_key,
                temperature=SYSTEM_CONFIG["temperature"]
            )
            
            # Create agents from configuration
            for agent_type, config in AGENTS_CONFIG.items():
                tools = self._prepare_tools(config.tools)
                
                agent = Agent(
                    role=config.role,
                    goal=config.goal,
                    backstory=config.backstory,
                    tools=tools,
                    llm=llm,
                    verbose=SYSTEM_CONFIG["verbose"],
                    allow_delegation=True if agent_type != AgentType.COORDINATOR else False,
                    max_iter=SYSTEM_CONFIG["max_iterations"]
                )
                self.agents[agent_type] = agent
            
            logger.info(f"✓ Initialized {len(self.agents)} agents successfully")
        
        except Exception as e:
            logger.error(f"Failed to initialize agents: {str(e)}")
    
    def _prepare_tools(self, tool_names: List[str]) -> List[Any]:
        """
        Prepare tools for agents (convert to CrewAI format if available)
        
        Args:
            tool_names: List of tool names to prepare
        
        Returns:
            List of prepared tools
        """
        if not CREWAI_AVAILABLE:
            return []
        
        prepared_tools = []
        for tool_name in (tool_names or []):
            if tool_name in TOOL_REGISTRY:
                tool = TOOL_REGISTRY[tool_name]
                # Convert to CrewAI tool format
                prepared_tools.append(tool)
        
        return prepared_tools
    
    def execute_agent_task(
        self,
        agent_type: AgentType,
        task_description: str,
        context: Dict[str, Any] = None
    ) -> AgentResponse:
        """
        Execute a task using a specific agent
        
        Args:
            agent_type: Type of agent to use
            task_description: Description of task to execute
            context: Additional context for the task
        
        Returns:
            AgentResponse with results
        """
        try:
            config = AGENTS_CONFIG.get(agent_type)
            if not config:
                return AgentResponse(
                    agent_name="Unknown",
                    agent_type=agent_type,
                    task=task_description,
                    result={},
                    timestamp=datetime.now().isoformat(),
                    success=False,
                    error="Agent type not found"
                )
            
            # If CrewAI available, use it; otherwise use fallback
            if CREWAI_AVAILABLE and agent_type in self.agents:
                return self._execute_with_crewai(agent_type, task_description, context)
            else:
                return self._execute_with_fallback(agent_type, task_description, context)
        
        except Exception as e:
            logger.error(f"Error executing agent task: {str(e)}")
            return AgentResponse(
                agent_name=config.name if config else "Unknown",
                agent_type=agent_type,
                task=task_description,
                result={},
                timestamp=datetime.now().isoformat(),
                success=False,
                error=str(e)
            )
    
    def _execute_with_crewai(
        self,
        agent_type: AgentType,
        task_description: str,
        context: Dict[str, Any]
    ) -> AgentResponse:
        """Execute task using CrewAI"""
        config = AGENTS_CONFIG[agent_type]
        agent = self.agents[agent_type]
        
        try:
            # Create task for the agent
            task = Task(
                description=f"{task_description}\n\nContext: {json.dumps(context or {}, indent=2)}",
                agent=agent,
                expected_output="Detailed analysis and recommendations"
            )
            
            # Execute task
            result = task.execute()
            
            response = AgentResponse(
                agent_name=config.name,
                agent_type=agent_type,
                task=task_description,
                result={"output": str(result)},
                timestamp=datetime.now().isoformat(),
                success=True
            )
        
        except Exception as e:
            logger.error(f"CrewAI execution error: {str(e)}")
            response = AgentResponse(
                agent_name=config.name,
                agent_type=agent_type,
                task=task_description,
                result={},
                timestamp=datetime.now().isoformat(),
                success=False,
                error=str(e)
            )
        
        self.execution_history.append(response)
        return response
    
    def _execute_with_fallback(
        self,
        agent_type: AgentType,
        task_description: str,
        context: Dict[str, Any]
    ) -> AgentResponse:
        """
        Fallback execution when CrewAI not available
        Routes to appropriate tools based on agent type
        """
        config = AGENTS_CONFIG[agent_type]
        
        try:
            result = {}
            
            # Route to appropriate tools based on agent type
            if agent_type == AgentType.WASTE_PREDICTION:
                result = self._handle_waste_prediction(task_description, context)
            
            elif agent_type == AgentType.MATCHING:
                result = self._handle_matching(task_description, context)
            
            elif agent_type == AgentType.RECIPE:
                result = self._handle_recipe(task_description, context)
            
            elif agent_type == AgentType.LOGISTICS:
                result = self._handle_logistics(task_description, context)
            
            elif agent_type == AgentType.IMPACT:
                result = self._handle_impact(task_description, context)
            
            elif agent_type == AgentType.COORDINATOR:
                result = self._handle_coordinator(task_description, context)
            
            response = AgentResponse(
                agent_name=config.name,
                agent_type=agent_type,
                task=task_description,
                result=result,
                timestamp=datetime.now().isoformat(),
                success=True
            )
        
        except Exception as e:
            logger.error(f"Fallback execution error: {str(e)}")
            response = AgentResponse(
                agent_name=config.name,
                agent_type=agent_type,
                task=task_description,
                result={},
                timestamp=datetime.now().isoformat(),
                success=False,
                error=str(e)
            )
        
        self.execution_history.append(response)
        return response
    
    # ========================================================================
    # Agent-Specific Handlers
    # ========================================================================
    
    def _handle_waste_prediction(self, task: str, context: Dict) -> Dict[str, Any]:
        """Handle waste prediction tasks"""
        if "analyze" in task.lower():
            return TOOL_REGISTRY["analyze_historical_data"].func(context.get("data", []))
        elif "predict" in task.lower():
            return TOOL_REGISTRY["predict_surplus"].func(
                context.get("historical_data", []),
                context.get("days_ahead", 7)
            )
        elif "recommend" in task.lower():
            return TOOL_REGISTRY["generate_recommendations"].func(
                context.get("waste_data", {}),
                context.get("current_operations", {})
            )
        return {"status": "Task not recognized"}
    
    def _handle_matching(self, task: str, context: Dict) -> Dict[str, Any]:
        """Handle recipient matching tasks"""
        if "match" in task.lower():
            return TOOL_REGISTRY["match_recipients"].func(
                context.get("food_item", {}),
                context.get("recipient_pool", [])
            )
        elif "score" in task.lower():
            return {"score": TOOL_REGISTRY["calculate_match_score"].func(
                context.get("food_item", {}),
                context.get("recipient", {})
            )}
        elif "optimize" in task.lower():
            return TOOL_REGISTRY["optimize_distribution"].func(
                context.get("matches", []),
                context.get("inventory", [])
            )
        return {"status": "Task not recognized"}
    
    def _handle_recipe(self, task: str, context: Dict) -> Dict[str, Any]:
        """Handle recipe and utilization tasks"""
        if "recipe" in task.lower():
            return TOOL_REGISTRY["generate_recipes"].func(
                context.get("food_items", []),
                context.get("quantity_kg", 0)
            )
        elif "usage" in task.lower():
            return TOOL_REGISTRY["suggest_usages"].func(
                context.get("food_item", ""),
                context.get("quantity", 0)
            )
        elif "value" in task.lower():
            return TOOL_REGISTRY["calculate_value_added"].func(context.get("recipe", {}))
        return {"status": "Task not recognized"}
    
    def _handle_logistics(self, task: str, context: Dict) -> Dict[str, Any]:
        """Handle logistics and scheduling tasks"""
        if "schedule" in task.lower() or "pickup" in task.lower():
            return TOOL_REGISTRY["schedule_pickup"].func(
                context.get("food_item", {}),
                context.get("recipient", {})
            )
        elif "route" in task.lower():
            return TOOL_REGISTRY["optimize_routes"].func(context.get("pickups", []))
        elif "feasib" in task.lower():
            return TOOL_REGISTRY["check_logistics_feasibility"].func(
                context.get("food_item", {}),
                context.get("recipient", {})
            )
        return {"status": "Task not recognized"}
    
    def _handle_impact(self, task: str, context: Dict) -> Dict[str, Any]:
        """Handle impact measurement and reporting tasks"""
        if "calculate" in task.lower():
            return TOOL_REGISTRY["calculate_impact"].func(context.get("transaction", {}))
        elif "track" in task.lower() or "metric" in task.lower():
            return TOOL_REGISTRY["track_metrics"].func(
                context.get("start_date", ""),
                context.get("end_date", ""),
                context.get("organization_id")
            )
        elif "report" in task.lower():
            return TOOL_REGISTRY["generate_reports"].func(
                context.get("metrics", {}),
                context.get("format_type", "summary")
            )
        return {"status": "Task not recognized"}
    
    def _handle_coordinator(self, task: str, context: Dict) -> Dict[str, Any]:
        """Handle coordination and decision-making tasks"""
        if "delegate" in task.lower():
            return TOOL_REGISTRY["delegate_task"].func(
                context.get("task", ""),
                context.get("agent_type", ""),
                context.get("context", {})
            )
        elif "synthesize" in task.lower():
            return TOOL_REGISTRY["synthesize_insights"].func(
                context.get("insights", []),
                context.get("decision_type", "")
            )
        elif "decide" in task.lower() or "decision" in task.lower():
            return TOOL_REGISTRY["make_decisions"].func(
                context.get("options", []),
                context.get("criteria", {})
            )
        return {"status": "Task not recognized"}
    
    def execute_workflow(
        self,
        workflow_name: str,
        input_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Execute a predefined workflow using multiple agents
        
        Args:
            workflow_name: Name of workflow to execute
            input_data: Input data for workflow
        
        Returns:
            Workflow execution results
        """
        workflow = WORKFLOW_DEFINITIONS.get(workflow_name)
        if not workflow:
            return {
                "status": "error",
                "message": f"Workflow '{workflow_name}' not found",
                "available_workflows": list(WORKFLOW_DEFINITIONS.keys())
            }
        
        logger.info(f"Executing workflow: {workflow_name}")
        results = {
            "workflow": workflow_name,
            "description": workflow["description"],
            "started_at": datetime.now().isoformat(),
            "steps": [],
            "final_output": None,
            "success": True
        }
        
        current_context = input_data.copy()
        
        # Execute each step in the workflow
        for step in workflow["steps"]:
            agent_type = step["agent"]
            task = step["task"]
            
            logger.info(f"Step: {task} (Agent: {agent_type.value})")
            
            # Execute agent task
            response = self.execute_agent_task(agent_type, task, current_context)
            
            results["steps"].append({
                "agent": agent_type.value,
                "task": task,
                "result": response.result,
                "success": response.success
            })
            
            # Update context with results for next step
            if response.success:
                current_context.update(response.result)
            else:
                results["success"] = False
                results["error"] = response.error
                break
        
        results["completed_at"] = datetime.now().isoformat()
        results["final_output"] = current_context
        
        logger.info(f"Workflow completed: {workflow_name}")
        return results
    
    def get_agent_info(self, agent_type: AgentType = None) -> Dict[str, Any]:
        """
        Get information about agents
        
        Args:
            agent_type: Specific agent type or None for all
        
        Returns:
            Agent information
        """
        if agent_type and agent_type in AGENTS_CONFIG:
            config = AGENTS_CONFIG[agent_type]
            return {
                "name": config.name,
                "role": config.role,
                "goal": config.goal,
                "type": agent_type.value,
                "tools": config.tools or [],
            }
        else:
            return {
                "agents": {
                    agent_type.value: {
                        "name": config.name,
                        "role": config.role,
                        "goal": config.goal,
                        "tools": config.tools or [],
                    }
                    for agent_type, config in AGENTS_CONFIG.items()
                },
                "total_agents": len(AGENTS_CONFIG),
                "available_workflows": list(WORKFLOW_DEFINITIONS.keys()),
            }
    
    def get_execution_history(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent agent execution history"""
        return [
            {
                "agent": item.agent_name,
                "agent_type": item.agent_type.value,
                "task": item.task,
                "success": item.success,
                "timestamp": item.timestamp,
            }
            for item in self.execution_history[-limit:]
        ]

# Global orchestrator instance
_orchestrator: AgentOrchestrator = None

def get_orchestrator() -> AgentOrchestrator:
    """Get or create global agent orchestrator"""
    global _orchestrator
    if _orchestrator is None:
        _orchestrator = AgentOrchestrator()
    return _orchestrator

def initialize_agents():
    """Initialize the multi-agent system"""
    orchestrator = get_orchestrator()
    logger.info("Multi-agent system initialized")
    return orchestrator
