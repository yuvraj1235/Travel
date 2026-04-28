# 🌍 TravelAI - Your Ultimate AI Travel Companion

TravelAI is a state-of-the-art travel planning application built with **Next.js 16**, **Prisma**, and **Google Gemini AI**. It transforms the way you plan your journeys by leveraging advanced AI to generate personalized itineraries, provide smart travel suggestions, and even assist you via a real-time voice interface.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google-gemini)

## ✨ Key Features

### 🧠 AI-Driven Itinerary Generation
Harness the power of **LangChain** and **Gemini 2.5 Flash Lite** to create detailed daily travel plans. Just input your destination, dates, budget, and interests, and watch as TravelAI architects your perfect trip with time-specific activities and cost estimates.

### 🎯 Personalized Suggestions
The home page isn't just a landing spot—it's a discovery engine. Based on your profile's preferred budget and interests, the AI suggests 3 curated destinations specifically tailored for you, complete with descriptions and "Reasons to Visit."

### 🎙️ Real-time Voice Assistant
Experience the future of travel planning with our built-in Voice Assistant. Powered by `gemini-3.1-flash-live-preview` via WebSockets, you can interact with the AI naturally to get instant travel advice.

### 🔗 Smart Booking Links
Forget manual searching. For every trip you generate, TravelAI can dynamically create AI-powered booking links for Flights, Hotels, and Activities using popular platforms like Google Flights, Skyscanner, and Booking.com.

### 📧 Email Integration
Send your full itinerary directly to your inbox with a single click. Integrated with **Resend** and **Nodemailer**, featuring beautiful, responsive email templates.

### 📊 Travel Dashboard
A clean, modern interface to manage all your past and upcoming journeys. View detailed daily breakdowns, track estimated costs, and revisit your planned adventures anytime.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **AI Integration**: [LangChain](https://js.langchain.com/) & [Google Generative AI (Gemini)](https://ai.google.dev/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) & [Lucide React](https://lucide.dev/)
- **Email**: [React Email](https://react.email/) & [Resend](https://resend.com/) / [Nodemailer](https://nodemailer.com/)
- **Dates**: [date-fns](https://date-fns.org/)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd travel
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the following:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/travel_db"

# AI Configuration
GEMINI_API_KEY="your_gemini_api_key_here"

# Email Configuration (Optional)
RESEND_API_KEY="your_resend_api_key_here"
# OR SMTP for Nodemailer
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 4. Database Setup
Initialize your database schema using Prisma:

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📁 Project Structure

- `src/app`: Next.js App Router (Pages & Server Actions)
- `src/components`: Reusable UI components & Client components
- `src/lib`: Core utilities (Prisma client, LangChain config)
- `src/emails`: React Email templates
- `prisma`: Database schema definition

---

## 📄 License
This project is licensed under the MIT License.

---
*Built with ❤️ for travelers by TravelAI Team.*
