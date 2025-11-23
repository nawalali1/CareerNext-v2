# CareerNext

CareerNext is a web application that helps users explore suitable career paths, view live job listings and build a tailored CV with AI support. It focuses on giving users clear guidance when they feel unsure about next steps in their career.

Live site: **https://careernext-next.vercel.app**

---

## Overview

The application guides users through a six-question quiz, generates a ranked list of career matches and links those roles directly to live job vacancies. Users can then create a personalised CV through a simple three-step builder, with optional AI-generated summaries and bullet points. The interface is clean, fully responsive and works well on both desktop and mobile.

CareerNext uses a small set of serverless API routes for job retrieval, AI functions and PDF generation. Authentication is handled with Firebase, giving users access to protected areas such as the CV builder and settings.

---

## Features

### Career Quiz
- Six-question multi-step flow
- Back/Next navigation
- Visual progress indicator

### Results Page
- Ranked career recommendations
- “Learn More” modal with short role descriptions
- Button to jump directly to filtered job listings

### Live Job Board
- Real job data from Adzuna
- Role and location filtering
- Autocomplete suggestions
- Total count of matching roles

### CV Builder
- Three steps: Contact Details, Summary, Qualifications
- AI drawer that generates summaries or bullet points
- A4 live preview
- PDF export using html2canvas and jsPDF

### AI Integration
- Google Gemini for career recommendations
- OpenAI for rewriting and summarising CV content

### Authentication and Routing
- Email and password sign-in via Firebase
- PrivateRoute protecting selected pages
- No user data stored beyond authentication

### Error Handling
- Global ErrorBoundary
- Fallback UI with reload option

### Theming and Responsiveness
- Light/dark theme toggle
- Fully responsive layout

### Deployment
- Hosted on Vercel
- API routes run as serverless functions

---

## Tech Stack

- **Next.js** (pages router)
- **React** with Hooks
- **CSS Modules**
- **Firebase Authentication**
- **Adzuna API**
- **Google Gemini**
- **OpenAI Node client**
- **html2canvas + jsPDF**
- **react-icons**

---

## Installation

```bash
git clone https://github.com/nawalali1/careernext-next.git
cd careernext-next
npm install
Environment Variables
Create a .env.local file and add the required values:

Firebase web credentials

Adzuna app ID and key

Google Gemini API key

OpenAI API key

Names should match those used in your local environment. Keep these keys private.

Usage
Start the development server:

bash
Copy code
npm run dev
Then open:

arduino
Copy code
http://localhost:3000
Typical flow:

Sign up or log in

Complete the quiz

View career matches

Browse live job listings

Build a CV

Use AI assistance if needed

Export the CV as a PDF

Deployment
CareerNext is deployed on Vercel:

https://careernext-next.vercel.app

Deployment commands:

bash
Copy code
npm run build
vercel deploy

