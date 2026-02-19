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

*(Replace these text blocks with actual GIFs or screenshots of your app!)*

<details open>
  <summary><b>🔍 Dynamic Search & Pagination</b></summary>
  <br/>
  <i>Placeholder: Imagine a cool GIF here showing the glassy search bar filtering jobs instantly.</i>
</details>

<details open>
  <summary><b>💼 Recruiter Dashboard & Status Updates</b></summary>
  <br/>
  <i>Placeholder: Imagine a screenshot here showing the Recruiter updating a student's status to "Hired!"</i>
</details>

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

Click below to expand the local setup guide for both the frontend and backend.

<details>
<summary><b>💻 Backend Setup (Django)</b></summary>

<br>

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
</details>

<details>
<summary><b>🌐 Frontend Setup (React)</b></summary>

Bash
cd frontend
npm install
npm run dev
</details>

Gemini said
Ah, excellent catch! Sometimes Markdown gets a little finicky with those collapsible <details> tags if there aren't enough blank lines between them, which accidentally swallows the sections below it.

Let's fix that README right now, and then I will give you the exact bullet points you need to copy and paste this masterpiece into your resume and portfolio!

1. The README Fix
Open your README.md, scroll down to the Setup Instructions, and replace everything from Setup Instructions down to the bottom with this carefully spaced version:

Markdown
## ⚙️ Setup Instructions

Click below to expand the local setup guide for both the frontend and backend.

<details>
<summary><b>💻 Backend Setup (Django)</b></summary>

<br>

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
</details>

<details>
<summary><b>🌐 Frontend Setup (React)</b></summary>

Bash
cd frontend
npm install
npm run dev
</details>

🛣️ Future Roadmap

[x] Role-based JWT Authentication
[x] Application tracking & status updates
[x] Pagination & Search filtering
[ ] Resume PDF upload support

## 👨‍💻 Author

**Soumyaranjan Pradhan**
* Full-Stack Developer 
* [LinkedIn](https://www.linkedin.com/in/soumyaranjan-pradhan-/) | [GitHub](https://github.com/SoumyarananPradhan/)
