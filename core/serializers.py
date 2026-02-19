from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, StudentProfile, RecruiterProfile, Job, Application

# 1. User Serializer (Handles Login/Registration data)
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'is_student', 'is_recruiter')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

# 2. Student Profile Serializer
class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Nested to show user details

    class Meta:
        model = StudentProfile
        fields = '__all__'

# 3. Recruiter Profile Serializer
class RecruiterProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = RecruiterProfile
        fields = '__all__'

# 4. Job Serializer
class JobSerializer(serializers.ModelSerializer):
    # This retrieves the Company Name instead of just the ID
    recruiter_name = serializers.CharField(source='recruiter.company_name', read_only=True)
    recruiter_id = serializers.ReadOnlyField(source='recruiter.id')

    class Meta:
        model = Job
        fields = ['id', 'title', 'description', 'requirements', 'job_type', 
                  'salary_range', 'location', 'posted_at', 'is_active', 
                  'recruiter_name', 'recruiter_id']

# 5. Application Serializer
from .models import Application # Add this to your imports at the top

class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.ReadOnlyField(source='job.title')
    company_name = serializers.ReadOnlyField(source='job.recruiter.company_name')
    
    # NEW: Fetch the student's details so the recruiter knows who applied!
    applicant_name = serializers.ReadOnlyField(source='student.full_name')
    applicant_email = serializers.ReadOnlyField(source='student.user.email')

    class Meta:
        model = Application
        # Make sure to add the new fields to this list!
        fields = ['id', 'job', 'job_title', 'company_name', 'applicant_name', 'applicant_email', 'cover_letter', 'applied_at', 'status']
        read_only_fields = ['applied_at', 'status']

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Get the standard tokens
        data = super().validate(attrs)
        
        # Add custom data to the response!
        data['username'] = self.user.username
        data['is_student'] = self.user.is_student
        data['is_recruiter'] = self.user.is_recruiter
        
        return data