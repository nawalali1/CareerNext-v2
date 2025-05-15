# CareerNext

> AI-powered career discovery and CV builder  
> Developed as a third-year Computer Science project

---

## Table of Contents

1. [Overview](#overview)  
2. [Features](#features)  
3. [Technology Stack](#technology-stack)  
4. [Prerequisites](#prerequisites)  
5. [Installation and Setup](#installation-and-setup)  
6. [Environment Variables](#environment-variables)  
7. [Usage](#usage)  
8. [Testing](#testing)  
9. [Deployment](#deployment)  
10. [Contributing](#contributing)  
11. [License](#license)  

---

## Overview

**CareerNext** is a Next.js application that helps students, graduates and career-changers discover roles that align with their preferences. It combines:

- A six-question quiz to capture work-style and motivational factors.  
- AI-driven recommendations powered by Google GenAI (Gemini) and OpenAI.  
- A live job board fetching real listings and filtering by career and location.  
- A one-click CV builder with AI assistance, PDF export and preview.  

This project demonstrates modern web development practices, third-party AI integration and a polished user experience.

---

## Features

### 1. Quick Quiz  
- Six multiple-choice questions.  
- Progress bar indicates completion percentage.  
- Responsive “Back” and “Next” navigation.  

### 2. Results Page  
- Displays the top five career matches.  
- “Learn More” modal with concise explanations.  
- “View Jobs” button auto-filters the job board by the selected career title.  

### 3. Live Job Board  
- Fetches up-to-date listings via `/api/jobs` endpoints.  
- Filters by role (from the quiz) and by location text input.  
- Autocomplete suggestions as you type.  
- Live count of matching roles.  

### 4. CV Builder  
- Three-step wizard: Contact Details, Professional Summary, Qualifications.  
- AI-assistant drawer prompts you to paste a job brief or ask for bullet points.  
- In-browser PDF export via html2canvas + jsPDF.  
- Live preview in A4 format.  

### 5. Error Handling  
- Global `ErrorBoundary` catches unexpected React errors.  
- Friendly fallback UI with a reload button and error details.  
- Network-error handling on data fetches with user-friendly messages.  

### 6. Theming & Responsiveness  
- Light/dark theme persisted in `localStorage`.  
- Fully responsive across desktop, tablet and mobile.  

---

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/)  
- **UI**: React, React Hooks, CSS custom properties, CSS Modules  
- **Icons**: react-icons  
- **AI Integration**:  
  - Google GenAI (Gemini) via `@google/genai`  
  - OpenAI via `openai` npm package  
- **PDF Export**: html2canvas + jsPDF  
- **State Management**: React `useState`, `useReducer`  
- **Routing & Data Fetching**: Next.js pages & API routes  
- **Authentication Guard**: Custom `PrivateRoute` component  
- **Testing**: Jest & React Testing Library (to be added)  
- **Deployment**: Vercel (recommended)  

---

## Prerequisites

- **Node.js** v16 or later  
- **npm** v8 or later  
- An **OpenAI** API key  
- A Google Cloud project with the **GenAI API** enabled and an API key  

---

## Installation and Setup

1. **Clone the repository**  
   ```bash
   git clone https://github.com/nawalali1/CareerNext-v2.git
   cd CareerNext-v2
