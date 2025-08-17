#api/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from djongo import models as djongo_models

class User(AbstractUser):
    # Add any additional user fields here if needed
    pass

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    total_submissions = models.IntegerField(default=0)
    accepted_submissions = models.IntegerField(default=0)
    
    def __str__(self):
        return self.user.username

class TestCase(djongo_models.Model):
    input_data = djongo_models.TextField()
    expected_output = djongo_models.TextField()
    is_hidden = models.BooleanField(default=True)

    class Meta:
        abstract = True # This makes it an embeddable model

class Problem(models.Model):
    class Difficulty(models.TextChoices):
        EASY = 'Easy', 'Easy'
        MEDIUM = 'Medium', 'Medium'
        HARD = 'Hard', 'Hard'

    title = models.CharField(max_length=255)
    description = models.TextField() # Supports Markdown
    difficulty = models.CharField(max_length=10, choices=Difficulty.choices, default=Difficulty.EASY)
    tags = djongo_models.JSONField(default=list) # e.g., ["arrays", "dynamic programming"]
    time_limit = models.FloatField(default=1.0) # in seconds
    memory_limit = models.IntegerField(default=256) # in MB
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    test_cases = djongo_models.ArrayField(
        model_container=TestCase
    )

    objects = djongo_models.DjongoManager()

    def __str__(self):
        return self.title

class Submission(models.Model):
    class Verdict(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        ACCEPTED = 'Accepted', 'Accepted'
        WRONG_ANSWER = 'Wrong Answer', 'Wrong Answer'
        TIME_LIMIT_EXCEEDED = 'Time Limit Exceeded', 'Time Limit Exceeded'
        MEMORY_LIMIT_EXCEEDED = 'Memory Limit Exceeded', 'Memory Limit Exceeded'
        COMPILATION_ERROR = 'Compilation Error', 'Compilation Error'
        RUNTIME_ERROR = 'Runtime Error', 'Runtime Error'

    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.TextField()
    language = models.CharField(max_length=50) # e.g., 'python', 'cpp'
    verdict = models.CharField(max_length=50, choices=Verdict.choices, default=Verdict.PENDING)
    execution_time = models.FloatField(null=True, blank=True) # in seconds
    memory_used = models.IntegerField(null=True, blank=True) # in MB
    submitted_at = models.DateTimeField(auto_now_add=True)
    ai_feedback = models.TextField(blank=True, null=True)

    def __str__(self):
        return f'{self.user.username} - {self.problem.title} ({self.verdict})'

class Contest(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    problems = models.ManyToManyField(Problem)
    participants = models.ManyToManyField(User, through='ContestParticipant', related_name='contests')
    plagiarism_report_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.title

class ContestParticipant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    rank = models.IntegerField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'contest')

    def __str__(self):
        return f'{self.user.username} in {self.contest.title}'