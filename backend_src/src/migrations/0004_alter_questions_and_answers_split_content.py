# Generated by Django 4.1.6 on 2023-03-11 03:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('src', '0003_questions_and_answers_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='questions_and_answers',
            name='Split_content',
            field=models.BooleanField(default=False),
        ),
    ]
