
from .base_experiment import BaseExperiment, ExperimentType
from typing import Dict, Any, Optional, List
import random

class StroopExperiment(BaseExperiment):
    """Stroop: report INK color via r/g/b/y."""
    def __init__(self):
        super().__init__()
        self.colors = ["RED","GREEN","BLUE","YELLOW"]
        self.ink_colors = ["red","green","blue","yellow"]
        self.keymap = {"red":"r","green":"g","blue":"b","yellow":"y"}
        self.total_trials = 40
        self.congruent_ratio = 0.5
        self.trial_index = 0
        self.trials: List[Dict[str,Any]] = []
        self.correct_count = 0
        self.rt_sum = 0.0

    def get_experiment_type(self):
        return ExperimentType("stroop") if not hasattr(ExperimentType,"STROOP") else ExperimentType.STROOP

    def configure(self, config: Dict[str, Any]):
        self.total_trials = int(config.get("total_trials", self.total_trials))
        self.congruent_ratio = float(config.get("congruent_ratio", self.congruent_ratio))
        km = config.get("keymap")
        if isinstance(km, dict):
            self.keymap = {k.lower(): str(v) for k,v in km.items()}
        self._generate_trials()

    def _generate_trials(self):
        num_cong = int(self.total_trials * self.congruent_ratio)
        num_incong = self.total_trials - num_cong
        trials = []
        for _ in range(num_cong):
            c = random.choice(self.colors)
            trials.append({"word": c, "ink_color": c.lower(), "congruent": True})
        for _ in range(num_incong):
            w = random.choice(self.colors)
            other = [c for c in self.ink_colors if c != w.lower()]
            trials.append({"word": w, "ink_color": random.choice(other), "congruent": False})
        random.shuffle(trials)
        self.trials = trials
        self.trial_index = 0

    def get_instructions(self) -> List[Dict[str, Any]]:
        return [{"type":"text","title":"Stroop Task","content":"Report the INK color, not the word. r/g/b/y."}]

    def get_practice_trials(self):
        return None

    def get_next_trial(self) -> Optional[Dict[str, Any]]:
        if self.trial_index >= len(self.trials):
            return None
        t = self.trials[self.trial_index].copy()
        t["trial_number"] = self.trial_index + 1
        expected = self.keymap.get(t["ink_color"], None)
        self.trial_index += 1
        return {
            "trial_number": t["trial_number"],
            "trial_type": "test",
            "stimulus_data": {"word": t["word"], "ink_color": t["ink_color"]},
            "correct_response": expected,
            "metadata": {"congruent": t["congruent"]}
        }

    def record_response(self, response_data: Dict[str,Any]):
        key = str(response_data.get("response_value",""))
        rt = float(response_data.get("response_time_ms",0))
        expected = str(response_data.get("correct_response",""))
        correct = (key.lower() == expected.lower())
        if correct: self.correct_count += 1
        if rt>0: self.rt_sum += rt
        return {"correct": correct, "feedback_message": "Correct" if correct else "Incorrect"}

    def is_complete(self) -> bool:
        return self.trial_index >= len(self.trials)

    def get_results(self) -> Dict[str,Any]:
        n = max(1, self.trial_index)
        return {"accuracy": self.correct_count/float(n), "mean_rt_ms": (self.rt_sum/float(n))}

    def get_configuration_schema(self) -> Dict[str,Any]:
        return {
            "basic": {
                "total_trials": {"type":"number","label":"Total Trials","default":40,"min":10,"max":400,"step":10},
                "congruent_ratio": {"type":"number","label":"Congruent Ratio (0-1)","default":0.5,"min":0.0,"max":1.0,"step":0.1}
            },
            "advanced": {
                "keymap": {"type":"string","label":"Keymap JSON (color->key)","default":"{\"red\":\"r\",\"green\":\"g\",\"blue\":\"b\",\"yellow\":\"y\"}"}
            }
        }
