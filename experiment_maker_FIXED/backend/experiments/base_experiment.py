"""
FILE: backend/experiments/base_experiment.py
DIRECTORY: /backend/experiments/

FUNCTIONAL ROLE: Abstract base class for all psychological experiments.
                  Defines standard interface that both Adaptive Preference Test
                  and new experiments (Digit Span, SART, etc.) implement.

DESIGN PATTERN: Template Method Pattern
    - Base class defines experiment lifecycle
    - Subclasses implement specific logic

LIFECYCLE STAGES:
    1. configure() - Set experiment parameters
    2. get_instructions() - Return instruction text/screens
    3. get_practice_trials() - Optional practice
    4. get_next_trial() - Generate next trial (adaptive or predetermined)
    5. record_response() - Store response and update state
    6. is_complete() - Check stopping criteria
    7. get_results() - Calculate and return results

VERSION: 3.0.0
LAST MODIFIED: 2025-11-05
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
from enum import Enum
import json


class ExperimentType(Enum):
    """Registry of available experiment types."""
    ADAPTIVE_PREFERENCE = "adaptive_preference"
    DIGIT_SPAN = "digit_span"
    SART = "sart"
    STROOP = "stroop"
    NBACK = "nback"
    # Students can easily add more


@dataclass
class TrialData:
    """Generic trial data structure."""
    trial_number: int
    trial_type: str  # "practice" or "test"
    stimulus_data: Dict[str, Any]  # Flexible for any experiment
    correct_response: Optional[Any] = None
    metadata: Dict[str, Any] = None


@dataclass
class ResponseData:
    """Generic response data structure."""
    trial_number: int
    response: Any  # Could be string, int, list, etc.
    response_time_ms: int
    correct: Optional[bool] = None
    metadata: Dict[str, Any] = None


class BaseExperiment(ABC):
    """
    Abstract base class for all psychological experiments.
    
    Subclasses must implement:
    - configure()
    - get_instructions()
    - get_next_trial()
    - record_response()
    - is_complete()
    - get_results()
    """
    
    def __init__(self, experiment_id: str, configuration: Dict[str, Any]):
        """
        Initialize experiment.
        
        Args:
            experiment_id: Unique identifier for this experiment instance
            configuration: Experiment-specific settings from experimenter
        """
        self.experiment_id = experiment_id
        self.configuration = configuration
        self.trial_history: List[ResponseData] = []
        self.current_trial_number = 0
        self.is_practice_phase = True
        
        # Call subclass configuration
        self.configure(configuration)
    
    @abstractmethod
    def configure(self, config: Dict[str, Any]) -> None:
        """
        Configure experiment from experimenter settings.
        
        This is where subclasses parse their specific config options.
        
        Args:
            config: Dictionary of configuration parameters
        """
        pass
    
    @abstractmethod
    def get_experiment_type(self) -> ExperimentType:
        """Return the type of this experiment."""
        pass
    
    @abstractmethod
    def get_instructions(self) -> List[Dict[str, Any]]:
        """
        Return instruction screens for subjects.
        
        Returns:
            List of instruction screens, each with:
            {
                "type": "text" | "html" | "interactive_demo",
                "content": "Instruction text...",
                "image_url": Optional[str],
                "duration_ms": Optional[int]
            }
        """
        pass
    
    def get_practice_trials(self) -> Optional[List[TrialData]]:
        """
        Return practice trials if applicable.
        
        Base implementation returns None (no practice).
        Subclasses can override.
        """
        return None
    
    @abstractmethod
    def get_next_trial(self) -> Optional[TrialData]:
        """
        Generate the next trial.
        
        This is called by the API when subject is ready.
        Can be adaptive (based on previous responses) or predetermined.
        
        Returns:
            TrialData object or None if experiment complete
        """
        pass
    
    @abstractmethod
    def record_response(self, response_data: ResponseData) -> Dict[str, Any]:
        """
        Record subject's response and update experiment state.
        
        Args:
            response_data: Response information from subject
            
        Returns:
            Dictionary with feedback/state updates:
            {
                "correct": Optional[bool],
                "feedback_message": Optional[str],
                "continue": bool
            }
        """
        pass
    
    @abstractmethod
    def is_complete(self) -> bool:
        """
        Check if experiment has reached completion criteria.
        
        Returns:
            True if experiment should end
        """
        pass
    
    @abstractmethod
    def get_results(self) -> Dict[str, Any]:
        """
        Calculate and return experiment results.
        
        Returns:
            Dictionary of results/scores for this participant
        """
        pass
    
    def get_progress(self) -> Dict[str, Any]:
        """
        Get current progress information.
        
        Default implementation - subclasses can override.
        """
        return {
            "trial_number": self.current_trial_number,
            "total_trials": len(self.trial_history),
            "is_practice": self.is_practice_phase
        }
    
    def end_practice(self) -> None:
        """Transition from practice to test phase."""
        self.is_practice_phase = False
        self.current_trial_number = 0
    
    def get_state_snapshot(self) -> Dict[str, Any]:
        """
        Serialize experiment state for database storage.
        
        Default implementation - subclasses can extend.
        """
        return {
            "experiment_id": self.experiment_id,
            "experiment_type": self.get_experiment_type().value,
            "configuration": self.configuration,
            "current_trial_number": self.current_trial_number,
            "is_practice_phase": self.is_practice_phase,
            "trial_history": [
                {
                    "trial_number": r.trial_number,
                    "response": r.response,
                    "response_time_ms": r.response_time_ms,
                    "correct": r.correct,
                    "metadata": r.metadata
                }
                for r in self.trial_history
            ]
        }
    
    def restore_state(self, state: Dict[str, Any]) -> None:
        """
        Restore experiment from serialized state.
        
        Default implementation - subclasses can extend.
        """
        self.current_trial_number = state.get("current_trial_number", 0)
        self.is_practice_phase = state.get("is_practice_phase", True)
        
        # Restore trial history
        self.trial_history = [
            ResponseData(
                trial_number=r["trial_number"],
                response=r["response"],
                response_time_ms=r["response_time_ms"],
                correct=r.get("correct"),
                metadata=r.get("metadata", {})
            )
            for r in state.get("trial_history", [])
        ]
    
    def get_default_configuration(self) -> Dict[str, Any]:
        """
        Return default configuration for this experiment type.
        
        Used in experimenter GUI to populate initial form values.
        Subclasses should override.
        """
        return {}
    
    def get_configuration_schema(self) -> Dict[str, Any]:
        """
        Return JSON schema for configuration options.
        
        Used to automatically generate experimenter GUI forms.
        Subclasses should override.
        
        Format:
        {
            "basic": {  # Always shown
                "param_name": {
                    "type": "number" | "string" | "boolean",
                    "label": "Human readable",
                    "default": value,
                    "description": "Help text"
                }
            },
            "advanced": {  # Hidden behind "Advanced" button
                "param_name": {...}
            }
        }
        """
        return {"basic": {}, "advanced": {}}
