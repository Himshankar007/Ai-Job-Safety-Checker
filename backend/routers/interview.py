from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import sys, os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ml_utils import gemini_prompt

router = APIRouter(prefix="/api/interview", tags=["Interview AI"])

MAINTENANCE_MODE = os.getenv("INTERVIEW_MAINTENANCE", "true").lower() in ("1", "true", "yes", "on")


def _paywall():
    raise HTTPException(
        status_code=status.HTTP_402_PAYMENT_REQUIRED,
        detail={
            "message": "Interview AI is under maintenance. Please make a payment to get access.",
            "feature": "interview_ai",
            "status": "maintenance",
        },
    )


class ChatMessage(BaseModel):
    message: str
    role: str = "software engineer"
    history: list[dict] = []


class QuestionRequest(BaseModel):
    role: str
    level: str = "mid"  # junior, mid, senior


@router.post("/questions")
async def get_questions(req: QuestionRequest):
    """
    Generate role-specific interview questions using Google Gemini.
    """
    if MAINTENANCE_MODE:
        _paywall()
    prompt = f"""
    You are an expert technical interviewer at a top tech company.
    Generate 6 interview questions for a {req.level}-level {req.role} position.
    Include:
    - 2 technical questions (specific to {req.role})
    - 2 behavioral / soft-skill questions
    - 1 system design question
    - 1 situational / problem-solving question

    Format as a numbered list. Be specific and practical.
    """
    questions_text = gemini_prompt(prompt)

    # Parse into list (split by numbered lines)
    lines = [l.strip() for l in questions_text.split("\n") if l.strip() and l[0].isdigit()]
    questions = lines if lines else [questions_text]

    return {
        "role": req.role,
        "level": req.level,
        "questions": questions,
        "ai_model": "Google Gemini 1.5 Flash"
    }


@router.get("/questions/{role}")
async def get_questions_simple(role: str):
    """Legacy endpoint — generates questions for a role string."""
    if MAINTENANCE_MODE:
        _paywall()
    prompt = f"""
    Generate 5 concise interview questions for a {role} position.
    Mix technical and behavioral questions. Return as a numbered list.
    """
    questions_text = gemini_prompt(prompt)
    lines = [l.strip() for l in questions_text.split("\n") if l.strip()]
    return {"role": role, "questions": lines}


@router.post("/chat")
async def chat_interaction(msg: ChatMessage):
    """
    AI interview coach that evaluates user answers and provides feedback.
    Uses Google Gemini as the LLM backbone.
    """
    if MAINTENANCE_MODE:
        _paywall()
    # Build conversation context
    history_context = ""
    for turn in msg.history[-6:]:  # last 6 turns for context
        history_context += f"{turn.get('role','user').title()}: {turn.get('content','')}\n"

    prompt = f"""
    You are an expert AI interview coach conducting a mock interview for a {msg.role} position.
    Your job is to:
    1. Evaluate the candidate's answer critically but constructively.
    2. Point out what was good and what was missing.
    3. Ask a relevant follow-up question OR move to a new topic.

    Keep response under 150 words. Be conversational and encouraging.

    Previous conversation:
    {history_context}

    Candidate's latest message: "{msg.message}"

    Respond as the interviewer:
    """
    reply = gemini_prompt(prompt)

    return {
        "reply": reply,
        "ai_model": "Google Gemini 1.5 Flash"
    }
