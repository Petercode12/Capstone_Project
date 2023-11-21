# Capstone-Project
## Project Overview
This project provides users with a unique opportunity to create tests in a wide variety of subjects, including math, physics, history, geography, English, IELTS, and more in the format of multiple-choice questions, constructive questions, and fill-in-blank questions. Not only can users practice the topic they have created, but they can also share it with other users, thereby expanding their knowledge and helping others in the process. Our platform is particularly useful for those who wish to review lessons and prepare for important examinations, for teachers and lecturers who need a test-taking system for their students, or for those who simply want to absorb new knowledge.

To further assist users in their exam preparation, we also incorporate various helpful tools, such as a note-taking facility and keyword highlighting, which allows users to take notes and highlight important information while they are taking the test. These features make the studying and practicing process more efficient and help users focus on what they are doing.

**Tech stack**: ReactJS, React-admin, Django, PostgreSQL. 

## Run Backend

> Install modules via `VENV` (windows)

```bash
cd backend_src
virtualenv env
source env/Scripts/activate
pip install -r requirements.txt
```

> Set Up Database

```bash
python manage.py makemigrations src # only for the first time
python manage.py makemigrations
python manage.py migrate
```

> Start the app

```bash
python manage.py runserver
```

## Run Frontend

```bash
npm i
npm start
```

## Update requirements.txt

```bash
pip3 freeze > requirements.txt # Python3
```
