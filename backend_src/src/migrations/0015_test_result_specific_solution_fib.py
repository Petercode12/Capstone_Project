# Generated by Django 4.1.6 on 2023-05-06 20:15

from django.db import migrations, models
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('src', '0014_alter_test_result_specific_user_answer_fib'),
    ]

    operations = [
        migrations.AddField(
            model_name='test_result_specific',
            name='Solution_FIB',
            field=django_mysql.models.ListTextField(models.CharField(max_length=100), null=True, size=None),
        ),
    ]