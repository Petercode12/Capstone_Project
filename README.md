# Capstone-Project

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
