# CodeArena/codearena_api/api/ai_review.py
from dataclasses import dataclass
from typing import Optional, Dict, Any
import os, requests, json

EXECUTOR_URL = os.getenv("EXECUTOR_URL", "http://127.0.0.1:8001/execute")

@dataclass
class RunResult:
    output: str
    error: str

def run_once(language: str, code: str, input_data: str = "") -> RunResult:
    """Calls your local executor (python/cpp/java already working)."""
    try:
        r = requests.post(
            EXECUTOR_URL,
            json={"language": language, "code": code, "input_data": input_data},
            timeout=8,
        )
        r.raise_for_status()
        data = r.json()
        return RunResult(output=data.get("output", ""), error=data.get("error", ""))
    except Exception as e:
        # Don’t block review if the run fails; just surface the error to the LLM too
        return RunResult(output="", error=f"Executor error: {e}")
