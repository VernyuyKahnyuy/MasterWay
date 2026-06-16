from google import genai
from google.genai.errors import ClientError

from django.conf import settings
from rooms.models import Room

client = genai.Client(
    api_key = settings.GEMINI_API_KEY
)

def generate_summary(text):

    prompt = f"""Summarize the following lesson. 
    
    Keep it concise.
    Use Bullet Points:
    
    Lesson: {text}
    """

    response = client.models.generate_content(
        model = "gemini-2.5-flash",
        contents = prompt
    )
    return response.text


def generate_quiz(text):
    
    prompt = f"""Generate a quiz based on the following lesson. 
    
     Rules:
    - Number each question.
    - Questions only.
    - Keep questions concise.
    - Make it MCQ where most suitable.
     - Provide 4 options for each question.

    At the end, provide the correct answer for each question.
    
    Lesson: {text}
    """

    response = client.models.generate_content(
        model = "gemini-2.5-flash",
        contents = prompt
    )
    return response.text


import re
from collections import Counter

_STOP_WORDS = {
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'up', 'about', 'into', 'this', 'that',
    'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may',
    'not', 'no', 'so', 'if', 'as', 'its', 'your', 'their', 'our',
    'how', 'what', 'which', 'who', 'when', 'where', 'why', 'all',
}


def _tokenize(text):
    words = re.findall(r'[a-z]+', text.lower())
    return [w for w in words if w not in _STOP_WORDS and len(w) > 2]


def recommend_rooms(user, interests, rooms, enrolled_room_ids=None):
    """
    Hybrid keyword-based + collaborative recommendation (no external AI API).

    interests: list of interest strings for the user
    rooms: queryset of Room objects
    enrolled_room_ids: set of room IDs the user is already in (excluded from results)
    Returns: list of room IDs sorted by relevance score (best first), up to 6
    """
    if not interests:
        return []

    enrolled_room_ids = set(enrolled_room_ids or [])

    # Build interest keyword set from all user interests
    interest_tokens = []
    for interest_text in interests:
        interest_tokens.extend(_tokenize(interest_text))
    interest_set = set(interest_tokens)

    # --- Content-based: score rooms by keyword overlap with interests ---
    rooms_list = [r for r in rooms if r.id not in enrolled_room_ids]
    content_scores = {}
    for room in rooms_list:
        room_tokens = _tokenize(f"{room.title} {room.description}")
        if not room_tokens:
            content_scores[room.id] = 0.0
            continue
        matches = sum(1 for t in room_tokens if t in interest_set)
        content_scores[room.id] = matches / len(room_tokens)

    # --- Collaborative: find users with overlapping interests and their enrollments ---
    from users.models import UserInterest
    from progress.models import Enrollment

    collab_counter = Counter()
    other_interests = UserInterest.objects.exclude(user=user)
    similar_user_ids = {
        ui.user_id
        for ui in other_interests
        if set(_tokenize(ui.interest)) & interest_set
    }

    if similar_user_ids:
        enrollments = Enrollment.objects.filter(
            learner_id__in=similar_user_ids
        ).exclude(room_id__in=enrolled_room_ids)
        for e in enrollments:
            collab_counter[e.room_id] += 1

    max_collab = max(collab_counter.values(), default=1)

    # --- Combine scores (content 70%, collaborative 30%) ---
    scores = {}
    for room in rooms_list:
        content = content_scores.get(room.id, 0.0)
        collab = collab_counter.get(room.id, 0) / max_collab
        scores[room.id] = content * 0.7 + collab * 0.3

    sorted_ids = sorted(scores, key=lambda rid: scores[rid], reverse=True)
    return sorted_ids[:6]