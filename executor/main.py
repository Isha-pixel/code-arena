# # executor/main.py
# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# import docker
# import os
# import uuid

# # Initialize the FastAPI app and the Docker client
# app = FastAPI()
# client = docker.from_env()

# # Pydantic model to define the structure of the request body
# class CodeExecutionRequest(BaseModel):
#     code: str
#     language: str
#     input_data: str

# # Define the Docker image to use for each language
# # (We will add cpp and java later)
# DOCKER_IMAGES = {
#     "python": "codearena/python-executor",
# }

# @app.post("/execute")
# async def execute_code(request: CodeExecutionRequest):
#     # Check if the requested language is supported
#     if request.language not in DOCKER_IMAGES:
#         raise HTTPException(status_code=400, detail="Unsupported language")

#     # Create a temporary directory on the host to store the code file
#     # This directory will be mounted into the Docker container
#     run_id = str(uuid.uuid4())
#     temp_dir = os.path.join(os.getcwd(), "temp", run_id)
#     os.makedirs(temp_dir, exist_ok=True)

#     # Define file paths
#     code_file_path = os.path.join(temp_dir, "script.py")
#     input_file_path = os.path.join(temp_dir, "input.txt")

#     # Write the user's code and input to the temporary files
#     with open(code_file_path, "w") as f:
#         f.write(request.code)
#     with open(input_file_path, "w") as f:
#         f.write(request.input_data)

#     # The command to be executed inside the container
#     # It reads from the input file and executes the script
#     command = "python script.py < input.txt"
    
#     try:
#         # Run the Docker container
#         container = client.containers.run(
#             image=DOCKER_IMAGES[request.language],
#             command=f"/bin/sh -c '{command}'",
#             # Mount the temporary directory as a read-only volume
#             volumes={temp_dir: {'bind': '/app', 'mode': 'ro'}},
#             # Set resource limits
#             mem_limit='256m',
#             cpu_shares=1024, # Relative weight, 1024 is default
#             # Security settings
#             network_mode='none',      # Disable network access
#             pids_limit=100,           # Limit number of processes
#             user='coder',             # Run as the non-root user we created
#             working_dir='/app',
#             detach=True
#         )

#         # Wait for the container to finish, with a timeout (e.g., 5 seconds)
#         try:
#             container.wait(timeout=5)
#         except Exception as e:
#             container.kill()
#             raise HTTPException(status_code=408, detail="Time Limit Exceeded")

#         # Retrieve the output (logs) from the container
#         output = container.logs(stdout=True, stderr=False).decode('utf-8')
#         error = container.logs(stdout=False, stderr=True).decode('utf-8')
        
#         # Prepare the result
#         result = {
#             "output": output,
#             "error": error
#         }

#     finally:
#         # Ensure the container is always removed
#         try:
#             container.remove(force=True)
#         except NameError:
#             # Container was never created, so nothing to remove
#             pass
        
#         # Clean up the temporary host directory and files
#         os.remove(code_file_path)
#         os.remove(input_file_path)
#         os.rmdir(temp_dir)

#     return result


# executor/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import docker
import os
import uuid
import shutil

app = FastAPI()
client = docker.from_env()

class CodeExecutionRequest(BaseModel):
    code: str
    language: str              # "python" | "cpp" | "java"
    input_data: str = ""       # optional

# Docker images per language
IMAGES = {
    "python": "codearena/python-executor",
    "cpp":    "codearena/cpp-executor",
    "java":   "codearena/java-executor",
}

# File names we write into /app
LANG_FILE = {
    "python": "script.py",
    "cpp":    "main.cpp",
    "java":   "Main.java",
}

def command_for(lang: str) -> str:
    """
    Return the shell command executed inside the container.
    We mount /app read-only. Compilers write to /tmp inside container.
    Stderr from compile is echoed so you see it in response.error.
    """
    if lang == "python":
        return "python script.py < input.txt"

    if lang == "cpp":
        # Compile then run; show compiler stderr on failure
        return (
            "g++ -std=gnu++17 -O2 -pipe -o /tmp/main main.cpp 2> /tmp/compile.err "
            "&& /tmp/main < input.txt "
            "|| { cat /tmp/compile.err 1>&2; exit 1; }"
        )

    if lang == "java":
        # Compile to /tmp, then run class Main
        return (
            "javac Main.java -d /tmp 2> /tmp/compile.err "
            "&& java -Xss64m -Xms64m -Xmx256m -cp /tmp Main < input.txt "
            "|| { cat /tmp/compile.err 1>&2; exit 1; }"
        )

    raise HTTPException(status_code=400, detail="Unsupported language")

@app.post("/execute")
async def execute_code(req: CodeExecutionRequest):
    lang = req.language.strip().lower()
    if lang not in IMAGES:
        raise HTTPException(status_code=400, detail="Unsupported language")

    # temp folder for this run (host)
    run_id = str(uuid.uuid4())
    temp_dir = os.path.join(os.getcwd(), "temp", run_id)
    os.makedirs(temp_dir, exist_ok=True)

    code_path  = os.path.join(temp_dir, LANG_FILE[lang])
    input_path = os.path.join(temp_dir, "input.txt")

    # write code and input
    with open(code_path, "w", encoding="utf-8") as f:
        f.write(req.code)
    with open(input_path, "w", encoding="utf-8") as f:
        f.write(req.input_data)

    cmd = command_for(lang)

    container = None
    try:
        container = client.containers.run(
            image=IMAGES[lang],
            command=f"/bin/sh -lc '{cmd}'",
            volumes={temp_dir: {"bind": "/app", "mode": "ro"}},  # code/input visible, read-only
            working_dir="/app",
            user="coder",
            network_mode="none",
            mem_limit="256m",
            pids_limit=100,
            cpu_shares=1024,
            detach=True,
        )

        # time limit
        try:
            container.wait(timeout=8)
        except Exception:
            # kill on TLE
            try:
                container.kill()
            finally:
                raise HTTPException(status_code=408, detail="Time Limit Exceeded")

        out = container.logs(stdout=True,  stderr=False).decode("utf-8", errors="replace")
        err = container.logs(stdout=False, stderr=True ).decode("utf-8", errors="replace")
        return {"output": out, "error": err}

    finally:
        if container is not None:
            try:
                container.remove(force=True)
            except Exception:
                pass
        # clean host temp
        try:
            shutil.rmtree(temp_dir, ignore_errors=True)
        except Exception:
            pass

