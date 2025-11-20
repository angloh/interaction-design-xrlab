"""
FILE: backend/experiments/digit_span.py
DIRECTORY: /backend/experiments/

FUNCTIONAL ROLE: Digit Span working memory test implementation.
                  Participants see sequences of digits and must recall them.
                  Sequence length increases until failure threshold reached.

METHOD: Adaptive staircase procedure
    - Start with sequence length N (default 3)
    - Show digits sequentially (1 per second default)
    - Participant types recalled digits
    - If correct: increase length by 1
    - If incorrect: repeat same length (max 2 attempts)
    - Stop after 2 consecutive failures at same length

TYPICAL PARADIGM (from Wechsler Adult Intelligence Scale):
    - Forward span: Recall in same order
    - Backward span: Recall in reverse order
    - Scoring: Longest sequence correctly recalled

VERSION: 3.0.0
LAST MODIFIED: 2025-11-05

REFERENCES:
    Wechsler, D. (2008). Wechsler Adult Intelligence Scale (4th ed.). 
        Pearson: San Antonio, TX.
    Woods, D. L., et al. (2011). Computerized Analysis of Verbal Fluency. 
        Behavior Research Methods, 43(3), 734-744.
"""

from typing import Dict, Any, List, Optional
import random
from .base_experiment import (
    BaseExperiment, ExperimentType, TrialData, ResponseData
)


class DigitSpanExperiment(BaseExperiment):
    """
    Digit Span working memory test.
    
    Configuration options:
    - direction: "forward" | "backward" | "both"
    - starting_length: Initial sequence length (default 3)
    - digit_display_time_ms: How long each digit shows (default 1000)
    - inter_digit_interval_ms: Blank between digits (default 200)
    - max_length: Stop if this length reached (default 12)
    - trials_per_length: Attempts at each length (default 2)
    - failure_threshold: Consecutive failures to stop (default 2)
    """
    
    def configure(self, config: Dict[str, Any]) -> None:
        """Parse digit span specific configuration."""
        # Basic options
        self.direction = config.get("direction", "forward")
        self.starting_length = config.get("starting_length", 3)
        self.max_length = config.get("max_length", 12)
        self.trials_per_length = config.get("trials_per_length", 2)
        self.failure_threshold = config.get("failure_threshold", 2)
        
        # Advanced timing options
        self.digit_display_time_ms = config.get("digit_display_time_ms", 1000)
        self.inter_digit_interval_ms = config.get("inter_digit_interval_ms", 200)
        self.feedback_enabled = config.get("feedback_enabled", True)
        
        # State tracking
        self.current_length = self.starting_length
        self.trials_at_current_length = 0
        self.consecutive_failures = 0
        self.max_span_achieved = 0
        
        # For "both" direction mode
        self.current_phase = "forward" if self.direction == "both" else self.direction
        self.forward_complete = False
    
    def get_experiment_type(self) -> ExperimentType:
        return ExperimentType.DIGIT_SPAN
    
    def get_instructions(self) -> List[Dict[str, Any]]:
        """Return instruction screens based on direction mode."""
        instructions = [
            {
                "type": "text",
                "title": "Digit Span Test",
                "content": """
                    <h2>Welcome to the Digit Span Test</h2>
                    <p>This test measures your working memory capacity.</p>
                    <p><strong>What you'll do:</strong></p>
                    <ul>
                        <li>You'll see a sequence of numbers, one at a time</li>
                        <li>After the sequence, type the numbers you remember</li>
                        <li>Sequences will get longer as you succeed</li>
                    </ul>
                    <p><strong>Tips:</strong></p>
                    <ul>
                        <li>Pay close attention to each digit</li>
                        <li>Type carefully - order matters!</li>
                        <li>Take your time, there's no rush</li>
                    </ul>
                """,
                "duration_ms": None
            }
        ]
        
        if self.direction == "forward" or self.current_phase == "forward":
            instructions.append({
                "type": "text",
                "title": "Forward Span",
                "content": """
                    <h3>Forward Span</h3>
                    <p>You'll need to recall the digits in the <strong>same order</strong> 
                       they were shown.</p>
                    <p><strong>Example:</strong></p>
                    <div class="example">
                        <p>If you see: <strong>4</strong> → <strong>7</strong> → <strong>2</strong></p>
                        <p>You type: <strong>472</strong></p>
                    </div>
                """,
                "duration_ms": None
            })
        
        if self.direction == "backward" or (self.direction == "both" and self.forward_complete):
            instructions.append({
                "type": "text",
                "title": "Backward Span",
                "content": """
                    <h3>Backward Span</h3>
                    <p>You'll need to recall the digits in <strong>reverse order</strong>.</p>
                    <p><strong>Example:</strong></p>
                    <div class="example">
                        <p>If you see: <strong>4</strong> → <strong>7</strong> → <strong>2</strong></p>
                        <p>You type: <strong>274</strong> (reversed)</p>
                    </div>
                """,
                "duration_ms": None
            })
        
        instructions.append({
            "type": "text",
            "title": "Ready?",
            "content": """
                <h3>Let's Practice</h3>
                <p>We'll start with a few practice trials so you can get comfortable 
                   with the task.</p>
                <p>Click "Continue" when you're ready to begin.</p>
            """,
            "duration_ms": None
        })
        
        return instructions
    
    def get_practice_trials(self) -> Optional[List[TrialData]]:
        """Generate 2 practice trials at easy length."""
        practice_length = max(2, self.starting_length - 1)
        return [
            self._generate_trial(practice_length, is_practice=True),
            self._generate_trial(practice_length, is_practice=True)
        ]
    
    def get_next_trial(self) -> Optional[TrialData]:
        """Generate next trial based on adaptive staircase."""
        if self.is_complete():
            return None
        
        self.current_trial_number += 1
        return self._generate_trial(self.current_length, is_practice=False)
    
    def _generate_trial(self, length: int, is_practice: bool) -> TrialData:
        """Generate a digit sequence trial."""
        # Generate random digits (0-9, no repeats within sequence)
        digits = random.sample(range(10), length)
        
        # Determine correct response based on direction
        if self.current_phase == "forward":
            correct_response = "".join(map(str, digits))
        else:  # backward
            correct_response = "".join(map(str, reversed(digits)))
        
        return TrialData(
            trial_number=self.current_trial_number,
            trial_type="practice" if is_practice else "test",
            stimulus_data={
                "digits": digits,
                "length": length,
                "direction": self.current_phase,
                "digit_display_time_ms": self.digit_display_time_ms,
                "inter_digit_interval_ms": self.inter_digit_interval_ms
            },
            correct_response=correct_response,
            metadata={
                "span_length": length,
                "trials_at_length": self.trials_at_current_length
            }
        )
    
    def record_response(self, response_data: ResponseData) -> Dict[str, Any]:
        """Process response and update adaptive state."""
        self.trial_history.append(response_data)
        
        # Check correctness
        correct = response_data.correct
        
        # Update state based on correctness
        if correct:
            self.consecutive_failures = 0
            self.max_span_achieved = max(self.max_span_achieved, self.current_length)
            
            # Advance to next length
            self.current_length += 1
            self.trials_at_current_length = 0
            
            feedback = f"✓ Correct! Moving to {self.current_length} digits."
        else:
            self.trials_at_current_length += 1
            
            if self.trials_at_current_length >= self.trials_per_length:
                # Failed all attempts at this length
                self.consecutive_failures += 1
                self.current_length += 1  # Try next length anyway
                self.trials_at_current_length = 0
                feedback = "That length was challenging. Let's try the next one."
            else:
                # Try same length again
                feedback = f"Not quite. You'll get another try at {self.current_length} digits."
        
        return {
            "correct": correct,
            "feedback_message": feedback if self.feedback_enabled else None,
            "continue": not self.is_complete()
        }
    
    def is_complete(self) -> bool:
        """Check stopping criteria."""
        # Stop if max length reached
        if self.current_length > self.max_length:
            return self._check_phase_transition()
        
        # Stop if failure threshold met
        if self.consecutive_failures >= self.failure_threshold:
            return self._check_phase_transition()
        
        # Stop if minimum trials not yet done
        if len(self.trial_history) < 4:  # At least 4 test trials
            return False
        
        return False
    
    def _check_phase_transition(self) -> bool:
        """
        For 'both' mode, transition from forward to backward.
        Returns True if fully complete.
        """
        if self.direction == "both" and not self.forward_complete:
            # Transition to backward phase
            self.forward_complete = True
            self.current_phase = "backward"
            self.current_length = self.starting_length
            self.trials_at_current_length = 0
            self.consecutive_failures = 0
            self.current_trial_number = 0
            return False  # Continue with backward
        
        return True  # Fully complete
    
    def get_results(self) -> Dict[str, Any]:
        """Calculate digit span scores."""
        # Calculate max span for each direction
        forward_span = 0
        backward_span = 0
        
        for response in self.trial_history:
            if response.correct and response.metadata:
                span_length = response.metadata.get("span_length", 0)
                direction = response.metadata.get("direction", "forward")
                
                if direction == "forward":
                    forward_span = max(forward_span, span_length)
                else:
                    backward_span = max(backward_span, span_length)
        
        results = {
            "max_span_achieved": self.max_span_achieved,
            "total_trials": len(self.trial_history),
            "direction_mode": self.direction
        }
        
        if self.direction == "forward" or self.direction == "both":
            results["forward_span"] = forward_span
        
        if self.direction == "backward" or self.direction == "both":
            results["backward_span"] = backward_span
        
        if self.direction == "both":
            results["total_span"] = forward_span + backward_span
        
        # Calculate accuracy at each span length
        accuracy_by_length = {}
        for response in self.trial_history:
            if response.metadata:
                length = response.metadata.get("span_length", 0)
                if length not in accuracy_by_length:
                    accuracy_by_length[length] = {"correct": 0, "total": 0}
                accuracy_by_length[length]["total"] += 1
                if response.correct:
                    accuracy_by_length[length]["correct"] += 1
        
        results["accuracy_by_length"] = {
            k: v["correct"] / v["total"] if v["total"] > 0 else 0
            for k, v in accuracy_by_length.items()
        }
        
        return results
    
    def get_default_configuration(self) -> Dict[str, Any]:
        """Default settings for digit span."""
        return {
            "direction": "forward",
            "starting_length": 3,
            "max_length": 12,
            "trials_per_length": 2,
            "failure_threshold": 2,
            "digit_display_time_ms": 1000,
            "inter_digit_interval_ms": 200,
            "feedback_enabled": True
        }
    
    def get_configuration_schema(self) -> Dict[str, Any]:
        """Configuration options for experimenter GUI."""
        return {
            "basic": {
                "direction": {
                    "type": "select",
                    "label": "Direction",
                    "options": [
                        {"value": "forward", "label": "Forward Only"},
                        {"value": "backward", "label": "Backward Only"},
                        {"value": "both", "label": "Both (Forward then Backward)"}
                    ],
                    "default": "forward",
                    "description": "Order in which digits should be recalled"
                },
                "starting_length": {
                    "type": "number",
                    "label": "Starting Sequence Length",
                    "default": 3,
                    "min": 2,
                    "max": 6,
                    "description": "Number of digits in first trial"
                },
                "feedback_enabled": {
                    "type": "boolean",
                    "label": "Show Feedback",
                    "default": True,
                    "description": "Tell participants if they were correct"
                }
            },
            "advanced": {
                "max_length": {
                    "type": "number",
                    "label": "Maximum Sequence Length",
                    "default": 12,
                    "min": 5,
                    "max": 20,
                    "description": "Stop test if this length reached"
                },
                "trials_per_length": {
                    "type": "number",
                    "label": "Trials Per Length",
                    "default": 2,
                    "min": 1,
                    "max": 3,
                    "description": "How many attempts at each sequence length"
                },
                "failure_threshold": {
                    "type": "number",
                    "label": "Consecutive Failures to Stop",
                    "default": 2,
                    "min": 1,
                    "max": 3,
                    "description": "Stop after this many failures in a row"
                },
                "digit_display_time_ms": {
                    "type": "number",
                    "label": "Digit Display Time (ms)",
                    "default": 1000,
                    "min": 500,
                    "max": 2000,
                    "step": 100,
                    "description": "How long each digit appears"
                },
                "inter_digit_interval_ms": {
                    "type": "number",
                    "label": "Blank Between Digits (ms)",
                    "default": 200,
                    "min": 0,
                    "max": 500,
                    "step": 50,
                    "description": "Pause between digits"
                }
            }
        }
