# Generated by Django 4.1.6 on 2023-05-06 16:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('src', '0010_alter_user_username'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='audio_questions_and_solutions',
            name='Split_content',
        ),
        migrations.AddField(
            model_name='test_result_specific',
            name='User_answer_FIB',
            field=models.TextField(null=True),
        ),
    ]