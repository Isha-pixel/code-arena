# executor/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import docker, os, uuid, shutil


app = FastAPI()
client = docker.from_env()

class CodeExecutionRequest(BaseModel):
    code: str
    language: str
    input_data: str = ""

IMAGES = {
    "python": "codearena/python-executor",
    "cpp":    "codearena/cpp-executor",
    "java":   "codearena/java-executor",
}

LANG_FILE = {
    "python": "script.py",
    "cpp":    "main.cpp",
    "java":   "Main.java",
}

def command_for(lang: str) -> str:
    if lang == "python":
        return "python script.py < input.txt"
    if lang == "cpp":
        return ("g++ -std=gnu++17 -O2 -pipe -o /tmp/main main.cpp 2> /tmp/compile.err "
                "&& /tmp/main < input.txt "
                "|| { cat /tmp/compile.err 1>&2; exit 1; }")
    if lang == "java":
        return ("javac Main.java -d /tmp 2> /tmp/compile.err "
                "&& java -Xss64m -Xms64m -Xmx256m -cp /tmp Main < input.txt "
                "|| { cat /tmp/compile.err 1>&2; exit 1; }")
    raise HTTPException(status_code=400, detail="Unsupported language")

# Detect if we are running inside a container
IS_DOCKER = os.path.exists("/.dockerenv")

# If HOST_RUNS_DIR is not provided, default to a local ./runs folder (absolute)
DEFAULT_LOCAL_RUNS = os.path.abspath(os.path.join(os.getcwd(), "runs"))

HOST_RUNS_DIR = os.environ.get("HOST_RUNS_DIR") or DEFAULT_LOCAL_RUNS
IN_CONTAINER_RUNS_DIR = (
    os.environ.get("IN_CONTAINER_RUNS_DIR")
    or ("/runs" if IS_DOCKER else HOST_RUNS_DIR)
)

# Only try to create the directory if it's not the root '/runs' on macOS host
# (When running locally, IN_CONTAINER_RUNS_DIR == HOST_RUNS_DIR == ./runs)
try:
    os.makedirs(IN_CONTAINER_RUNS_DIR, exist_ok=True)
except OSError:
    # If you run locally with IN_CONTAINER_RUNS_DIR='/runs', this would fail.
    # That's why Option B exports IN_CONTAINER_RUNS_DIR to a writable path.
    pass


@app.post("/execute")
async def execute_code(req: CodeExecutionRequest):
    lang = req.language.strip().lower()
    if lang not in IMAGES:
        raise HTTPException(status_code=400, detail="Unsupported language")

    run_id = str(uuid.uuid4())
    # Write files via the API container's bind mount
    run_dir_in = os.path.join(IN_CONTAINER_RUNS_DIR, run_id)  # inside this container
    os.makedirs(run_dir_in, exist_ok=True)

    code_path  = os.path.join(run_dir_in, LANG_FILE[lang])
    input_path = os.path.join(run_dir_in, "input.txt")
    with open(code_path, "w", encoding="utf-8") as f:
        f.write(req.code)
    with open(input_path, "w", encoding="utf-8") as f:
        f.write(req.input_data)

    # The Docker daemon needs the **host** path for the bind mount:
    run_dir_host = os.path.join(HOST_RUNS_DIR, run_id)

    container = None
    try:
        container = client.containers.run(
            image=IMAGES[lang],
            command=f"/bin/sh -lc '{command_for(lang)}'",
            volumes={ run_dir_host: {"bind": "/app", "mode": "ro"} },  # host path -> /app in child
            working_dir="/app",
            user="coder",
            network_mode="none",
            mem_limit="256m",
            pids_limit=100,
            cpu_shares=1024,
            detach=True,
        )

        try:
            container.wait(timeout=8)
        except Exception:
            try:
                container.kill()
            finally:
                raise HTTPException(status_code=408, detail="Time Limit Exceeded")

        out = container.logs(stdout=True,  stderr=False).decode("utf-8", "replace")
        err = container.logs(stdout=False, stderr=True ).decode("utf-8", "replace")
        return {"output": out, "error": err}

    finally:
        if container is not None:
            try: container.remove(force=True)
            except Exception: pass
        # Clean run dir
        try: shutil.rmtree(run_dir_in, ignore_errors=True)
        except Exception: pass
