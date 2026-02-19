# 🚀 FresherJobs - Full Stack Job Portal 

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</div>

<br />

> A robust, two-sided marketplace MVP built to connect college students with recruiters. Features role-based JWT authentication, dynamic profiles, and a real-time application tracking system.

---

## 📑 Table of Contents
- [📸 App Preview](#-app-preview)
- [✨ Key Features](#-key-features)
- [⚙️ Setup Instructions](#️-setup-instructions)
- [🛣️ Future Roadmap](#️-future-roadmap)
- [👨‍💻 Author](#-author)

---

## 📸 App Preview

### 🔍 Dynamic Search & Pagination
![Search and Pagination Preview](https://your-image-link-goes-here.com/image1.png)

### 💼 Recruiter Dashboard & Status Updates
![Recruiter Dashboard Preview](https://your-image-link-goes-here.com/image2.png)

---

## ✨ Key Features

* **🛡️ Role-Based Authentication:** Secure, distinct login flows for `Students` and `Recruiters` using JWT.
* **📊 Dynamic Dashboards:** * **Recruiters:** Post jobs, view applicant lists, read cover letters, and update candidate statuses.
  * **Students:** Track the live status of applications and build out a skills profile.
* **🧠 Smart User Profiles:** A single API endpoint that dynamically serves and updates Student or Company profiles based purely on the token.
* **⚡ Advanced Search & Pagination:** Backend filtering using Django `Q` objects for case-insensitive keyword searches, coupled with DRF pagination to handle large datasets.
* **🎨 Modern UI:** A highly responsive, dark-themed glassmorphism interface built with Tailwind CSS.

---

## ⚙️ Setup Instructions

### 💻 Backend Setup (Django)

Navigate to the backend directory and set up the Python environment:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
🌐 Frontend Setup (React)
Open a new terminal, navigate to the frontend directory, and start the development server:

Bash
cd frontend
npm install
npm run dev

🛣️ Future Roadmap
[x] Role-based JWT Authentication
[x] Application tracking & status updates
[x] Pagination & Search filtering
[ ] Resume PDF upload support
[ ] Email notifications for application updates

👨‍💻 Author
Soumyaranjan Pradhan

Full-Stack Developer

LinkedIn | GitHub
