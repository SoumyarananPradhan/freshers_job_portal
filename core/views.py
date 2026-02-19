from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from rest_framework import viewsets, permissions, status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import User, StudentProfile, RecruiterProfile, Job, Application
from .serializers import (UserSerializer, StudentProfileSerializer, 
                          RecruiterProfileSerializer, JobSerializer, 
                          ApplicationSerializer, CustomTokenObtainPairSerializer)

# 1. Auth View - Register User
class RegisterView(APIView):
    def post(self, request):
        data = request.data
        user_serializer = UserSerializer(data=data)
        
        if user_serializer.is_valid():
            user = user_serializer.save()
            
            # Create the specific profile with empty defaults to satisfy the database
            if user.is_student:
                StudentProfile.objects.create(
                    user=user, 
                    full_name=data.get('full_name', ''),
                    university='',
                    degree='',
                    graduation_year=2026, # Default integer
                    skills=''
                )
            elif user.is_recruiter:
                RecruiterProfile.objects.create(
                    user=user, 
                    company_name=data.get('company_name', ''),
                    about_company='',
                    location=''
                )
                
            return Response(user_serializer.data, status=status.HTTP_201_CREATED)
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class JobPagination(PageNumberPagination):
    page_size = 6

# 2. Job ViewSet (CRUD for Jobs)
class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    pagination_class = JobPagination
    
    # NEW: Dynamic queryset to handle the search bar!
    def get_queryset(self):
        # Start with all jobs
        queryset = Job.objects.all().order_by('-posted_at')
        
        # Check if the frontend sent a search word
        search_query = self.request.query_params.get('search', None)
        
        if search_query:
            # Filter jobs where the title OR description OR company name contains the search word
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(recruiter__company_name__icontains=search_query)
            )
        return queryset
    
    # Custom permission: Anyone can view, but only Recruiters can post/edit
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        # Automatically assign the job to the logged-in recruiter
        serializer.save(recruiter=self.request.user.recruiter_profile)

    # Custom endpoint for applying to a job
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def apply(self, request, pk=None):
        job = self.get_object() # Gets the specific job by ID
        user = request.user

        # Security 1: Only students can apply
        if not getattr(user, 'is_student', False):
            return Response({"error": "Only students can apply for jobs."}, status=status.HTTP_403_FORBIDDEN)

        # Security 2: Prevent duplicate applications
        if Application.objects.filter(job=job, student=user.student_profile).exists():
            return Response({"error": "You have already applied for this job."}, status=status.HTTP_400_BAD_REQUEST)

        # Create the application
        cover_letter = request.data.get('cover_letter', '')
        Application.objects.create(
            job=job, 
            student=user.student_profile,
            cover_letter=cover_letter
        )
        return Response({"message": "Successfully applied!"}, status=status.HTTP_201_CREATED)

# 3. Application ViewSet
# Make sure to import status and Response if you haven't!
class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_student:
            return Application.objects.filter(student=user.student_profile).order_by('-applied_at')
        elif user.is_recruiter:
            return Application.objects.filter(job__recruiter=user.recruiter_profile).order_by('-applied_at')
        return Application.objects.none()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user.student_profile)

    # NEW: Secure endpoint for recruiters to update the status
    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def update_status(self, request, pk=None):
        application = self.get_object()
        user = request.user
        
        # Security: Only the recruiter who owns the job can update the status
        if not getattr(user, 'is_recruiter', False) or application.job.recruiter != user.recruiter_profile:
            return Response({"error": "Not authorized to update this application."}, status=status.HTTP_403_FORBIDDEN)
            
        new_status = request.data.get('status')
        valid_statuses = dict(Application.STATUS_CHOICES).keys()
        
        if new_status not in valid_statuses:
            return Response({"error": f"Invalid status. Must be one of: {list(valid_statuses)}"}, status=status.HTTP_400_BAD_REQUEST)
            
        application.status = new_status
        application.save()
        
        return Response({"message": "Status updated successfully!", "status": new_status}, status=status.HTTP_200_OK)
        
# 4. Custom Login View (Sends roles back to React)
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# Add this to the bottom of your core/views.py file

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        # Smartly return the correct profile based on the role
        if getattr(user, 'is_student', False):
            serializer = StudentProfileSerializer(user.student_profile)
            return Response(serializer.data)
        elif getattr(user, 'is_recruiter', False):
            serializer = RecruiterProfileSerializer(user.recruiter_profile)
            return Response(serializer.data)
        
        return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        user = request.user
        # We use partial=True so the frontend doesn't have to send EVERY single field
        if getattr(user, 'is_student', False):
            serializer = StudentProfileSerializer(user.student_profile, data=request.data, partial=True)
        elif getattr(user, 'is_recruiter', False):
            serializer = RecruiterProfileSerializer(user.recruiter_profile, data=request.data, partial=True)
        else:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)