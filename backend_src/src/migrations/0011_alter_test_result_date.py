# Generated by Django 4.1.6 on 2023-03-30 08:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('src', '0010_rename_exam_test_result_exam_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='test_result',
            name='Date',
            field=models.DateTimeField(),
        ),
    ]
