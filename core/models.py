from django.db import models
from django.contrib.auth.models import AbstractUser

# 1. Custom User Model
class User(AbstractUser):
    is_student = models.BooleanField(default=False)
    is_recruiter = models.BooleanField(default=False)

    def __str__(self):
        return self.username

# 2. Student Profile
class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    full_name = models.CharField(max_length=200)
    university = models.CharField(max_length=200)
    degree = models.CharField(max_length=100) # e.g. B.Tech
    graduation_year = models.IntegerField()
    skills = models.TextField(help_text="Comma-separated skills") # Simple storage for MVP
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    portfolio_link = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.username} - Student"

# 3. Recruiter/Company Profile
class RecruiterProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='recruiter_profile')
    company_name = models.CharField(max_length=200)
    company_website = models.URLField(blank=True, null=True)
    about_company = models.TextField()
    location = models.CharField(max_length=200) # HQ Location
    
    def __str__(self):
        return f"{self.company_name} - Recruiter"

# 4. Job Posting
class Job(models.Model):
    JOB_TYPES = (
        ('Full-time', 'Full-time'),
        ('Part-time', 'Part-time'),
        ('Internship', 'Internship'),
        ('Contract', 'Contract'),
    )
    
    recruiter = models.ForeignKey(RecruiterProfile, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=200)
    description = models.TextField()
    requirements = models.TextField()
    job_type = models.CharField(max_length=20, choices=JOB_TYPES, default='Full-time')
    salary_range = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=100)
    posted_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

# 5. Job Application
class Application(models.Model):
    STATUS_CHOICES = (
        ('Applied', 'Applied'),
        ('Shortlisted', 'Shortlisted'),
        ('Rejected', 'Rejected'),
        ('Hired', 'Hired'),
    )

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='applications')
    cover_letter = models.TextField(blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Applied')

    class Meta:
        unique_together = ('job', 'student') # Prevents applying twice to same job

    def __str__(self):
        return f"{self.student.user.username} -> {self.job.title}"