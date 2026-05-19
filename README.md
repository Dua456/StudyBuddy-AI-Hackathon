# StudyBuddy AI

AI-powered student learning platform built with the MERN stack. Upload notes, generate AI summaries, auto-create quizzes, and track your study progress.

## Features

- **Upload Notes** - Upload PDFs, DOCs, TXT, and images to your personal library
- **AI Summaries** - Generate instant AI-powered summaries with key points and keywords using OpenRouter API
- **Auto Quizzes** - Generate MCQ and True/False quizzes automatically from your study material
- **Track Progress** - Monitor your study stats, quiz scores, and earn achievement badges
- **Profile Management** - Update profile, upload avatar, manage account settings
- **Dark Mode** - Default dark theme with light mode toggle
- **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT + bcrypt |
| File Storage | Cloudinary |
| AI | OpenRouter API (gemini-2.0-flash via OpenRouter) |

## Project Structure

```
studybuddy-ai/
├── client/                         # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/               # LoginForm, SignupForm
│   │   │   ├── common/             # Layout, Sidebar, Loader, Modal
│   │   │   ├── dashboard/          # StatsCard, QuickActions, RecentActivity
│   │   │   ├── upload/             # DropZone, FilePreview, UploadProgress
│   │   │   ├── summary/            # SummaryCard, SummaryActions
│   │   │   ├── quiz/               # QuizCard, QuizTimer, ScoreBoard
│   │   │   └── profile/            # ProfileForm, AchievementBadge
│   │   ├── context/                # AuthContext, ThemeContext
│   │   ├── hooks/                  # useAuth, useUpload, useQuiz
│   │   ├── pages/                  # All page components
│   │   ├── services/               # API service files
│   │   └── utils/                  # Helper functions
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                         # Express backend
│   ├── config/                     # DB, Cloudinary, OpenRouter config
│   ├── controllers/                # Route handlers
│   ├── middleware/                  # Auth, upload, error middleware
│   ├── models/                     # Mongoose schemas
│   ├── routes/                     # API routes
│   ├── utils/                      # OpenRouter prompt helpers
│   ├── server.js
│   └── package.json
│
└── package.json                    # Root package (concurrently)
```

## API Endpoints

### Auth (`/api/auth`)
| Method | Route | Description |
|--------|-------|-------------|
| POST | /register | Register new user |
| POST | /login | Login user |
| GET | /me | Get current user (protected) |
| POST | /forgot-password | Send reset link |
| POST | /reset-password | Reset password |
| POST | /google | Google OAuth |

### Notes (`/api/notes`) - Protected
| Method | Route | Description |
|--------|-------|-------------|
| POST | /upload | Upload file to Cloudinary |
| GET | / | Get all user notes (paginated) |
| GET | /:id | Get single note |
| DELETE | /:id | Delete note |
| PATCH | /:id | Update note details |

### AI (`/api/ai`) - Protected
| Method | Route | Description |
|--------|-------|-------------|
| POST | /summarize | Generate summary for a note |
| POST | /generate-quiz | Generate quiz from a note |
| POST | /extract-text | Re-extract text from PDF |

### Quiz (`/api/quiz`) - Protected
| Method | Route | Description |
|--------|-------|-------------|
| GET | / | Get all quizzes |
| GET | /:id | Get single quiz |
| POST | /:id/attempt | Submit quiz attempt |
| GET | /:id/attempts | Get quiz attempts |

### User (`/api/user`) - Protected
| Method | Route | Description |
|--------|-------|-------------|
| GET | /profile | Get user profile |
| PATCH | /profile | Update profile |
| POST | /avatar | Upload avatar |
| GET | /stats | Get user stats |
| DELETE | /account | Delete account |

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Cloudinary account
- OpenRouter API key

### 1. Clone the repository
```bash
git clone <repository-url>
cd studybuddy-ai
```

### 2. Install dependencies
```bash
npm run install-all
```

### 3. Configure Environment Variables

**server/.env**
```env
PORT=5000
MONGODB_URI=mongodb+srv://your_user:your_pass@cluster.mongodb.net/studybuddy
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENROUTER_API_KEY=your_openrouter_api_key
CLIENT_URL=http://localhost:3000
```

**client/.env**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Run the application
```bash
npm run dev
```

This starts both:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Badge System

| Badge | Condition |
|-------|-----------|
| First Upload | Upload your first note |
| Quiz Master | Achieve 80%+ average quiz score |
| Summary Expert | Generate 3+ summaries |
| Consistent Learner | 7-day study streak |

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Primary | #6C63FF | Buttons, links, accents |
| Secondary | #4ECDC4 | Gradients, highlights |
| Accent | #FFE66D | Tags, badges |
| Dark BG | #0F0F1A | Page background |
| Dark Card | #1A1A2E | Card backgrounds |
| Dark Sidebar | #16213E | Sidebar background |

## License

MIT
