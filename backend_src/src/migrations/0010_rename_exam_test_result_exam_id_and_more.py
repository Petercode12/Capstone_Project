# Generated by Django 4.1.6 on 2023-03-30 08:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('src', '0009_exams_collection_description'),
    ]

    operations = [
        migrations.RenameField(
            model_name='test_result',
            old_name='exam',
            new_name='exam_id',
        ),
        migrations.RenameField(
            model_name='test_result',
            old_name='User',
            new_name='user_id',
        ),
        migrations.CreateModel(
            name='TEST_RESULT_SPECIFIC',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('Ordinal', models.IntegerField()),
                ('Question', models.TextField()),
                ('Is_MCQ', models.BooleanField(default=True)),
                ('Answer_a', models.TextField(null=True)),
                ('Answer_b', models.TextField(null=True)),
                ('Answer_c', models.TextField(null=True)),
                ('Answer_d', models.TextField(null=True)),
                ('Correct_answer', models.CharField(max_length=1, null=True)),
                ('Solution', models.TextField(null=True)),
                ('User_answer_MCQ', models.CharField(max_length=1, null=True)),
                ('User_answer_CONS', models.TextField(null=True)),
                ('Mark', models.IntegerField(null=True)),
                ('test_result_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='src.test_result')),
            ],
        ),
    ]
