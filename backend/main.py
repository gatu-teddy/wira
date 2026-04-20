from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from routers import candidates, jobs, matching, auth, applications, messages

app = FastAPI(title="Wira API", version="1.0.0", docs_url="/docs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://wira.global",
        "https://www.wira.global",
        os.environ.get("FRONTEND_URL", "http://localhost:5173"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,         prefix="/auth",         tags=["auth"])
app.include_router(candidates.router,   prefix="/candidates",   tags=["candidates"])
app.include_router(jobs.router,         prefix="/jobs",         tags=["jobs"])
app.include_router(matching.router,     prefix="/matching",     tags=["matching"])
app.include_router(applications.router, prefix="/applications", tags=["applications"])
app.include_router(messages.router,     prefix="/messages",     tags=["messages"])


@app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}
