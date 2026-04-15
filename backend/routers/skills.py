from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import sys, os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ml_utils import extract_skills_from_text, gemini_prompt

router = APIRouter(prefix="/api/skills", tags=["Skill Gap Analysis"])


class SkillRequest(BaseModel):
    user_skills: List[str]
    job_description: str


@router.post("/analyze")
async def analyze_skills(req: SkillRequest):
    """
    Extract required skills from the job description using NLP keyword matching,
    then use Gemini to generate personalized course recommendations.
    ML Libraries: scikit-learn (TF-IDF helpers), NLTK (via ml_utils), Google Gemini
    """
    # ── NLP Skill Extraction ─────────────────────────────────────────────────
    extracted_job_skills = extract_skills_from_text(req.job_description)
    if not extracted_job_skills:
        extracted_job_skills = ["python", "communication", "problem solving", "teamwork"]

    user_skill_lower = [s.lower().strip() for s in req.user_skills]
    matched = [s for s in extracted_job_skills if s.lower() in user_skill_lower]
    missing = [s for s in extracted_job_skills if s.lower() not in user_skill_lower]
    match_pct = int((len(matched) / len(extracted_job_skills)) * 100) if extracted_job_skills else 0

    # ── Gemini Course Recommendations ────────────────────────────────────────
    prompt = f"""
    You are a career growth advisor and online learning expert.
    A job seeker is missing these skills for their target role: {', '.join(missing[:8])}.
    Their current skills are: {', '.join(req.user_skills[:10])}.
    Job description context: {req.job_description[:500]}

    For each missing skill (max 5), suggest:
    - 1 free course (Coursera/edX/YouTube)
    - 1 paid course (Udemy/LinkedIn Learning)
    - Estimated time to learn

    Format as a simple list per skill. Be specific with real course names if possible.
    """
    ai_recommendations = gemini_prompt(prompt)

    # Structured fallback recommendations
    structured_recs = [
        {
            "skill": skill,
            "courses": [
                {"name": f"Complete {skill.title()} Bootcamp", "platform": "Udemy", "duration": "20 hours", "type": "paid"},
                {"name": f"{skill.title()} for Beginners", "platform": "Coursera", "duration": "4 weeks", "type": "free"}
            ]
        }
        for skill in missing[:5]
    ]

    return {
        "matched": matched,
        "missing": missing,
        "match_percentage": match_pct,
        "recommendations": structured_recs,
        "ai_recommendations": ai_recommendations,
        "ml_model": "NLP Keyword Extraction (scikit-learn) + Google Gemini 1.5 Flash",
        "summary": f"You match {match_pct}% of the required skills. Focus on: {', '.join(missing[:3]) if missing else 'You are well-matched!'}."
    }
