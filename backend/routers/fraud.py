from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
import io, sys, os

# Add parent directory to path for ml_utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ml_utils import compute_fraud_score, gemini_prompt, clean_text

try:
    import pdfplumber
    PDF_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False

try:
    from PIL import Image
    import pytesseract
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False

router = APIRouter(prefix="/api/fraud", tags=["Fraud Detection"])


def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    """Extract text from PDF or image using pdfplumber / pytesseract."""
    ext = filename.lower().split(".")[-1]
    if ext == "pdf" and PDF_AVAILABLE:
        try:
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                return " ".join(page.extract_text() or "" for page in pdf.pages)
        except Exception:
            pass
    elif ext in ("png", "jpg", "jpeg", "webp") and OCR_AVAILABLE:
        try:
            img = Image.open(io.BytesIO(file_bytes))
            return pytesseract.image_to_string(img)
        except Exception:
            pass
    return "[Could not extract text from file]"


@router.post("/analyze")
async def analyze_job(
    description: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    """
    Analyze a job posting for fraud signals.
    Uses scikit-learn keyword heuristics + Google Gemini LLM explanation.
    """
    text = description or ""

    # Extract text from uploaded file if provided
    if file:
        file_bytes = await file.read()
        extracted = extract_text_from_file(file_bytes, file.filename)
        text = (text + " " + extracted).strip()

    if not text:
        return {"error": "Please provide a job description or upload a file."}

    # ── ML Heuristic Scoring (sklearn-based) ─────────────────────────────────
    risk_score, found_keywords = compute_fraud_score(text)
    risk_level = "High" if risk_score > 65 else "Medium" if risk_score > 35 else "Low"
    trust_score = 100 - risk_score

    # ── Gemini LLM Explanation ───────────────────────────────────────────────
    prompt = f"""
    You are an expert AI fraud detection system for job postings.
    Analyze the following job description and provide:
    1. A brief 2-sentence summary of why this job is or is not suspicious.
    2. 3 specific red flags or green flags detected.
    3. A final verdict: LIKELY FRAUD, SUSPICIOUS, or LEGITIMATE.

    Job Description:
    \"\"\"
    {text[:3000]}
    \"\"\"

    Respond in plain text with clear sections labeled: Summary, Flags, Verdict.
    The risk score from our ML model is {risk_score}/100 ({risk_level} risk).
    """
    ai_explanation = gemini_prompt(prompt)

    return {
        "score": risk_score,
        "level": risk_level,
        "trust_score": trust_score,
        "found_keywords": found_keywords,
        "ai_explanation": ai_explanation,
        "ml_model": "TF-IDF Keyword Heuristics + Google Gemini 1.5 Flash",
        "explanation": [
            f"Detected {len(found_keywords)} suspicious keyword(s): {', '.join(found_keywords) if found_keywords else 'none'}.",
            f"ML heuristic risk score: {risk_score}/100.",
            f"Trust score: {trust_score}/100.",
            "Powered by scikit-learn + Google Gemini API."
        ]
    }
