from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import routers.fraud as fraud
import routers.resume as resume
import routers.company as company
import routers.skills as skills
import routers.interview as interview
import routers.recommendations as recommendations

app = FastAPI(title="AI Job Safety Checker API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fraud.router)
app.include_router(resume.router)
app.include_router(company.router)
app.include_router(skills.router)
app.include_router(interview.router)
app.include_router(recommendations.router)

@app.get("/")
async def root():
    return {"message": "Welcome to AI Job Safety Checker API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
