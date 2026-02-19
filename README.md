# 🚀 FresherJobs - Full Stack Job Portal MVP

A robust, two-sided marketplace built to connect college students with recruiters. This platform features role-based access control, allowing companies to post openings and manage candidates, while students can build profiles and submit applications with custom cover letters.

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS (Glassmorphism UI design)
* Axios (API communication)
* React Router (Client-side routing)
* Lucide React (Iconography)

**Backend:**
* Python & Django
* Django REST Framework (DRF)
* SimpleJWT (JSON Web Token Authentication)
* SQLite (Development Database - easily swappable to PostgreSQL)

## ✨ Key Features

* **Role-Based Authentication:** Secure, distinct login flows and dashboards for `Students` and `Recruiters` using JWT access and refresh tokens.
* **Dynamic Dashboards:** * Recruiters can post jobs, view applicant lists, read cover letters, and update candidate statuses (Shortlisted, Hired, Rejected).
  * Students can track the live status of their applications.
* **Smart User Profiles:** Single API endpoint that dynamically serves and updates Student or Company profiles based on the user's token.
* **Advanced Search & Pagination:** Backend filtering using Django `Q` objects for case-insensitive keyword searches, coupled with DRF pagination to handle large datasets efficiently.
* **Responsive UI:** A modern, dark-themed interface built with Tailwind CSS, featuring active state management and modal overlays.

## ⚙️ Local Setup Instructions

### 1. Backend Setup (Django)
Navigate to the backend directory and set up the Python environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
2. Frontend Setup (React)
Open a new terminal, navigate to the frontend directory, and start the development server:

Bash
cd frontend
npm install
npm run dev
🔒 Security Implementations
Passwords are cryptographically hashed via Django's auth system.

Endpoints are protected via DRF permission classes (IsAuthenticated).

Cross-role validation prevents students from accessing recruiter-only endpoints (e.g., job creation, status updates).

👨‍💻 Author
Soumyaranjan Pradhan

Full-Stack Developer specializing in Python, Django, and React.

[LinkedIn Profile] https://www.linkedin.com/in/soumyaranjan-pradhan-/

[GitHub Profile] https://github.com/SoumyarananPradhan