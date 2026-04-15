"""
ml_utils.py — Shared ML & AI utilities for AI Job Safety Checker
"""
import os
import re
from dotenv import load_dotenv

load_dotenv()

# ── Gemini Client ────────────────────────────────────────────────────────────
_GEMINI_KEY = os.getenv("GEMINI_API_KEY", "")
_gemini_model = None

def get_gemini():
    """Returns a cached Gemini GenerativeModel instance."""
    global _gemini_model
    if _gemini_model is None and _GEMINI_KEY and _GEMINI_KEY != "your_gemini_api_key_here":
        # Lazy import to keep backend startup fast.
        import google.generativeai as genai

        genai.configure(api_key=_GEMINI_KEY)
        _gemini_model = genai.GenerativeModel("gemini-1.5-flash")
    return _gemini_model

def gemini_prompt(prompt: str, fallback: str = "AI analysis unavailable. Please add your GEMINI_API_KEY to the .env file.") -> str:
    """Send a prompt to Gemini and return the text response."""
    model = get_gemini()
    if model is None:
        return fallback
    try:
        resp = model.generate_content(prompt)
        return resp.text.strip()
    except Exception as e:
        return f"AI error: {str(e)}"

# ── Text Cleaning ────────────────────────────────────────────────────────────
def clean_text(text: str) -> str:
    """Remove special characters and normalize whitespace."""
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.lower().strip()

# ── TF-IDF Similarity ────────────────────────────────────────────────────────
def compute_tfidf_similarity(text_a: str, text_b: str) -> float:
    """Compute cosine similarity between two texts using TF-IDF."""
    if not text_a or not text_b:
        return 0.0
    # Lazy import: scikit-learn pulls in scipy and can slow cold-start.
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity

    vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
    try:
        tfidf_matrix = vectorizer.fit_transform([clean_text(text_a), clean_text(text_b)])
        score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return float(round(score * 100, 2))
    except Exception:
        return 0.0

# ── Keyword Extraction ───────────────────────────────────────────────────────
COMMON_SKILLS = [
    "python", "javascript", "typescript", "react", "node.js", "fastapi", "django",
    "flask", "sql", "postgresql", "mongodb", "docker", "kubernetes", "aws", "azure",
    "gcp", "machine learning", "deep learning", "nlp", "computer vision", "tensorflow",
    "pytorch", "scikit-learn", "pandas", "numpy", "data analysis", "tableau", "power bi",
    "git", "agile", "scrum", "rest api", "graphql", "redis", "kafka", "spark", "hadoop",
    "java", "c++", "c#", "golang", "rust", "linux", "bash", "html", "css", "tailwind",
    "figma", "communication", "leadership", "problem solving", "teamwork"
]

def extract_skills_from_text(text: str) -> list[str]:
    """Extract known skills from a block of text using keyword matching."""
    text_lower = text.lower()
    found = [skill for skill in COMMON_SKILLS if skill in text_lower]
    return list(set(found))

# ── Suspicious Fraud Patterns ────────────────────────────────────────────────
FRAUD_KEYWORDS = [
    "whatsapp", "telegram", "urgent hiring", "no experience required",
    "work from home guaranteed", "send money", "bank details", "advance payment",
    "registration fee", "high salary guaranteed", "easy money", "mlm",
    "multi-level marketing", "earn from home", "click here", "paytm",
    "no interview", "immediate joining", "lottery", "prize", "winner"
]

def compute_fraud_score(text: str) -> tuple[int, list[str]]:
    """Heuristic fraud scoring using TF-IDF and keyword pattern matching."""
    text_lower = text.lower()
    found = [kw for kw in FRAUD_KEYWORDS if kw in text_lower]
    
    # Base score from keyword hits
    base_score = min(len(found) * 12, 60)
    
    # TF-IDF based anomaly: very short descriptions score higher
    word_count = len(text.split())
    if word_count < 50:
        base_score += 20
    elif word_count < 100:
        base_score += 10
    
    # Excessive promises pattern
    promise_words = ["guaranteed", "100%", "assured", "definitely", "unlimited"]
    promises_found = sum(1 for p in promise_words if p in text_lower)
    base_score += promises_found * 8
    
    return min(base_score, 95), found
