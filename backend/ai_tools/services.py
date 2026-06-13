from google import genai
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


def recommend_rooms(interests, rooms):
    room_list = "\n".join([f"{room.title}: {room.description}" for room in rooms])

    prompt = f""" A user wants to learn:

    {interests}

    Here are some available rooms: 

    {room_list}

    Recommend the top 3 rooms that best match the user's interests.

    Return only the room IDs separated by commas. 

    Example response: 1, 5, 9
    """

    print("Before calling gemini for recommendation")

    response = client.models.generate_content(
        model = "gemini-2.5-flash",
        contents = prompt
    )

    print("after calling gemini for recommendation")
    recommended_ids = response.text

    return recommended_ids