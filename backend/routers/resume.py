from fastapi import APIRouter, UploadFile, File, Form
from typing import List
import io, sys, os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ml_utils import compute_tfidf_similarity, extract_skills_from_text, gemini_prompt

try:
    import pdfplumber
    PDF_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False

router = APIRouter(prefix="/api/resume", tags=["Resume ATS"])


def extract_pdf_text(file_bytes: bytes) -> str:
    if PDF_AVAILABLE:
        try:
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                return " ".join(page.extract_text() or "" for page in pdf.pages)
        except Exception:
            pass
    return ""


@router.post("/analyze")
async def analyze_resume(
    job_description: str = Form(...),
    resume: UploadFile = File(...)
):
    """
    Parse a resume PDF, compute TF-IDF cosine similarity vs the job description,
    extract matched/missing skills, and use Gemini for smart suggestions.
    ML Libraries: scikit-learn (TF-IDF), pdfplumber (PDF parsing)
    """
    file_bytes = await resume.read()

    # ── Real PDF Text Extraction ─────────────────────────────────────────────
    resume_text = extract_pdf_text(file_bytes)
    if not resume_text:
        resume_text = f"[Extracted from {resume.filename} — PDF parsing unavailable, install pdfplumber]"

    # ── TF-IDF Cosine Similarity Score ──────────────────────────────────────
    similarity_score = compute_tfidf_similarity(resume_text, job_description)
    score = int(min(similarity_score, 100))

    # ── Skill Matching via keyword extraction ────────────────────────────────
    job_skills = extract_skills_from_text(job_description)
    resume_skills = extract_skills_from_text(resume_text)

    matched_skills = [s for s in job_skills if s in resume_skills]
    missing_skills = [s for s in job_skills if s not in resume_skills]
    bonus_skills = [s for s in resume_skills if s not in job_skills]

    # ── Gemini LLM Suggestions ───────────────────────────────────────────────
    prompt = f"""
    You are an expert ATS (Applicant Tracking System) optimizer and career coach.
    A candidate's resume has been compared against a job description.

    ATS Match Score: {score}%
    Matched Skills: {', '.join(matched_skills) if matched_skills else 'None detected'}
    Missing Skills: {', '.join(missing_skills) if missing_skills else 'None detected'}
    Job Description Summary: {job_description[:800]}

    Provide:
    1. 3 specific, actionable suggestions to improve the resume for this job.
    2. Key phrases or keywords the resume must include.
    3. One sentence on overall ATS compatibility.

    Be concise and practical. Use plain text.
    """
    ai_suggestions = gemini_prompt(prompt)

    return {
        "score": score,
        "filename": resume.filename,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "bonus_skills": bonus_skills,
        "ai_suggestions": ai_suggestions,
        "ml_model": "TF-IDF Cosine Similarity (scikit-learn) + Google Gemini 1.5 Flash",
        "suggestions": [
            f"Add '{s}' experience or projects to your resume." for s in missing_skills[:3]
        ] + [
            "Quantify your achievements with metrics (e.g., 'reduced load time by 40%').",
            "Use a single-column layout for better ATS compatibility.",
            "Mirror exact keywords from the job description."
        ]
    }
