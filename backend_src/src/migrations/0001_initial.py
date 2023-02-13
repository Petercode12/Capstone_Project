# Generated by Django 4.1.6 on 2023-02-10 10:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='EXAMS_COLLECTION',
            fields=[
                ('ID', models.AutoField(primary_key=True, serialize=False)),
                ('Name', models.CharField(max_length=200)),
                ('Created_Date', models.DateField()),
                ('Last_Modified_Date', models.DateField()),
                ('Is_split', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='USER',
            fields=[
                ('User_id', models.AutoField(primary_key=True, serialize=False)),
                ('Username', models.CharField(max_length=200)),
                ('Password', models.CharField(max_length=200)),
                ('Email', models.CharField(blank=True, max_length=200)),
                ('Created_Date', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='TEST_RESULT',
            fields=[
                ('Id', models.AutoField(primary_key=True, serialize=False)),
                ('Score', models.IntegerField()),
                ('Date', models.DateField()),
                ('User', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='src.user')),
                ('exam', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='src.exams_collection')),
            ],
        ),
        migrations.CreateModel(
            name='MCQ_QUESTIONS_AND_ANSWERS',
            fields=[
                ('Id', models.AutoField(primary_key=True, serialize=False)),
                ('Ordinal', models.IntegerField()),
                ('Question', models.TextField()),
                ('Correct_answer', models.CharField(max_length=1)),
                ('Answer_a', models.TextField()),
                ('Answer_b', models.TextField()),
                ('Answer_c', models.TextField()),
                ('Answer_d', models.TextField()),
                ('Split_content', models.BooleanField(default=True)),
                ('exam', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='src.exams_collection')),
            ],
        ),
        migrations.AddField(
            model_name='exams_collection',
            name='User',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='src.user'),
        ),
        migrations.CreateModel(
            name='CONSTRUCTIVE_QUESTIONS_AND_SOLUTIONS',
            fields=[
                ('Id', models.AutoField(primary_key=True, serialize=False)),
                ('Question', models.TextField()),
                ('Solution', models.TextField()),
                ('Ordinal', models.IntegerField()),
                ('Split_content', models.BooleanField(default=True)),
                ('exam', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='src.exams_collection')),
            ],
        ),
        migrations.CreateModel(
            name='AUDIO_QUESTIONS_AND_SOLUTIONS',
            fields=[
                ('Id', models.AutoField(primary_key=True, serialize=False)),
                ('Question', models.TextField()),
                ('Solution', models.TextField()),
                ('Ordinal', models.IntegerField()),
                ('Split_content', models.BooleanField(default=True)),
                ('exam', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='src.exams_collection')),
            ],
        ),
        migrations.CreateModel(
            name='AUDIO',
            fields=[
                ('Id', models.AutoField(primary_key=True, serialize=False)),
                ('Audio_name', models.CharField(max_length=200)),
                ('Audio_link', models.URLField()),
                ('exam', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='src.exams_collection')),
            ],
        ),
    ]
