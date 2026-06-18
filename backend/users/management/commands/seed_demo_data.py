from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from accountability.models import StudyUpdate
from community.models import Comment
from lessons.models import Lesson
from messaging.models import Message
from profiles.models import Profile
from progress.models import Enrollment, LessonProgress
from rooms.models import Room
from users.models import UserInterest


DEMO_PASSWORD = "MasterWay123!"


USERS = [
    {
        "username": "amina_expert",
        "email": "amina@example.com",
        "first_name": "Amina",
        "last_name": "Njoya",
        "role": "expert",
        "bio": "Data analyst and Python mentor helping learners build practical portfolio projects.",
        "interests": ["Python", "Data Analysis", "Dashboards"],
    },
    {
        "username": "jonas_expert",
        "email": "jonas@example.com",
        "first_name": "Jonas",
        "last_name": "Talla",
        "role": "expert",
        "bio": "Frontend engineer focused on React, UI polish, and product thinking.",
        "interests": ["React", "UI Design", "JavaScript"],
    },
    {
        "username": "grace_learner",
        "email": "grace@example.com",
        "first_name": "Grace",
        "last_name": "Fongang",
        "role": "learner",
        "bio": "Computer science student learning web development through real projects.",
        "interests": ["React", "APIs", "Career Growth"],
    },
    {
        "username": "kevin_learner",
        "email": "kevin@example.com",
        "first_name": "Kevin",
        "last_name": "Biya",
        "role": "learner",
        "bio": "Beginner backend developer building confidence with Django and databases.",
        "interests": ["Django", "Databases", "Python"],
    },
    {
        "username": "linda_learner",
        "email": "linda@example.com",
        "first_name": "Linda",
        "last_name": "Mbah",
        "role": "learner",
        "bio": "Aspiring designer-developer interested in clean interfaces and collaboration.",
        "interests": ["UI Design", "Figma", "React"],
    },
]


ROOMS = [
    {
        "title": "Python for Practical Projects",
        "description": "Learn Python by building scripts, small automations, and data tools.",
        "creator": "amina_expert",
        "lessons": [
            {
                "title": "Python Setup and First Script",
                "content": "Install Python, configure your editor, and write a small command-line script.",
                "video_url": "https://www.youtube.com/watch?v=rfscVS0vtbw",
                "order": 1,
            },
            {
                "title": "Working With Files",
                "content": "Read, write, and transform text files using Python's standard library.",
                "video_url": "https://www.youtube.com/watch?v=Uh2ebFW8OYM",
                "order": 2,
            },
            {
                "title": "Mini Project: Study Planner",
                "content": "Build a simple planner that stores tasks and prints daily priorities.",
                "video_url": "",
                "order": 3,
            },
        ],
    },
    {
        "title": "React Interface Lab",
        "description": "Practice building polished React pages, forms, and reusable components.",
        "creator": "jonas_expert",
        "lessons": [
            {
                "title": "Component Basics",
                "content": "Break a page into reusable React components and pass data with props.",
                "video_url": "https://www.youtube.com/watch?v=SqcY0GlETPk",
                "order": 1,
            },
            {
                "title": "Forms and State",
                "content": "Create controlled inputs and handle form submission in React.",
                "video_url": "",
                "order": 2,
            },
            {
                "title": "Fetching API Data",
                "content": "Load backend data with Axios and render loading, empty, and error states.",
                "video_url": "",
                "order": 3,
            },
        ],
    },
    {
        "title": "Django Backend Foundations",
        "description": "Build API skills with models, serializers, authentication, and permissions.",
        "creator": "amina_expert",
        "lessons": [
            {
                "title": "Models and Migrations",
                "content": "Design Django models and apply database migrations safely.",
                "video_url": "",
                "order": 1,
            },
            {
                "title": "Serializers and ViewSets",
                "content": "Expose model data through REST endpoints using Django REST Framework.",
                "video_url": "",
                "order": 2,
            },
            {
                "title": "JWT Authentication Flow",
                "content": "Connect login, refresh tokens, and protected API routes.",
                "video_url": "",
                "order": 3,
            },
        ],
    },
]


COMMENTS = [
    ("grace_learner", "React Interface Lab", "The API loading lesson is exactly what I needed."),
    ("kevin_learner", "Django Backend Foundations", "The migrations explanation made the backend feel less scary."),
    ("linda_learner", "React Interface Lab", "Can we add a lesson about responsive dashboards?"),
    ("grace_learner", "Python for Practical Projects", "The study planner project is a nice confidence boost."),
]


STUDY_UPDATES = [
    ("grace_learner", "React Interface Lab", "Finished the component basics lesson and rebuilt my profile page."),
    ("kevin_learner", "Django Backend Foundations", "Created my first model and ran migrations successfully."),
    ("linda_learner", "React Interface Lab", "Practiced form state and improved my create-room screen."),
]


MESSAGES = [
    ("grace_learner", "jonas_expert", "Can you review my room list UI when you have time?"),
    ("jonas_expert", "grace_learner", "Yes. Focus first on empty states and spacing consistency."),
    ("kevin_learner", "amina_expert", "I finished the Django models lesson."),
    ("amina_expert", "kevin_learner", "Great. Try adding one serializer next."),
]


class Command(BaseCommand):
    help = "Populate the local database with demo records for development."

    @transaction.atomic
    def handle(self, *args, **options):
        User = get_user_model()
        users = {}

        for data in USERS:
            interests = data["interests"]
            bio = data["bio"]
            user_defaults = {
                key: value
                for key, value in data.items()
                if key not in {"bio", "interests"}
            }
            user, created = User.objects.get_or_create(
                username=data["username"],
                defaults=user_defaults,
            )
            if not created:
                for field, value in user_defaults.items():
                    setattr(user, field, value)
            user.set_password(DEMO_PASSWORD)
            user.save()
            users[user.username] = user

            Profile.objects.update_or_create(
                user=user,
                defaults={
                    "bio": bio,
                    "interests": ", ".join(interests),
                },
            )

            for interest in interests:
                UserInterest.objects.get_or_create(
                    user=user,
                    interest=interest,
                    defaults={"name": interest},
                )

        rooms = {}
        lessons = []
        for room_data in ROOMS:
            room, _ = Room.objects.update_or_create(
                title=room_data["title"],
                defaults={
                    "description": room_data["description"],
                    "creator": users[room_data["creator"]],
                },
            )
            rooms[room.title] = room

            for lesson_data in room_data["lessons"]:
                lesson, _ = Lesson.objects.update_or_create(
                    room=room,
                    title=lesson_data["title"],
                    defaults={
                        "creator": room.creator,
                        "content": lesson_data["content"],
                        "video_url": lesson_data["video_url"],
                        "order": lesson_data["order"],
                    },
                )
                lessons.append(lesson)

        learners = [
            users["grace_learner"],
            users["kevin_learner"],
            users["linda_learner"],
        ]

        for learner in learners:
            for room in rooms.values():
                Enrollment.objects.get_or_create(learner=learner, room=room)

        for index, lesson in enumerate(lessons):
            for learner in learners:
                completed = (index + learner.id) % 2 == 0
                LessonProgress.objects.update_or_create(
                    learner=learner,
                    lesson=lesson,
                    defaults={"completed": completed},
                )

        for username, room_title, text in COMMENTS:
            Comment.objects.get_or_create(
                user=users[username],
                room=rooms[room_title],
                text=text,
            )

        for username, room_title, content in STUDY_UPDATES:
            StudyUpdate.objects.get_or_create(
                user=users[username],
                room=rooms[room_title],
                content=content,
            )

        for sender, receiver, content in MESSAGES:
            Message.objects.get_or_create(
                sender=users[sender],
                receiver=users[receiver],
                content=content,
            )

        self.stdout.write(
            self.style.SUCCESS(
                "Seeded demo data: "
                f"{len(users)} users, {len(rooms)} rooms, {len(lessons)} lessons. "
                f"Demo password: {DEMO_PASSWORD}"
            )
        )
