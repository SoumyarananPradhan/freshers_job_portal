from django.contrib import admin
from .models import User, StudentProfile, RecruiterProfile, Job, Application

admin.site.register(User)
admin.site.register(StudentProfile)
admin.site.register(RecruiterProfile)
admin.site.register(Job)
admin.site.register(Application)