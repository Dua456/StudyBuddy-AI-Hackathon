You are an expert MERN Stack developer. Build a complete, production-ready 
AI-powered student learning platform called "StudyBuddy AI". Follow every 
instruction below precisely.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECT OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build a full-stack web application where students can:
- Upload PDFs and study notes
- Generate AI-powered summaries using Gemini API
- Auto-generate quizzes from uploaded content
- Track their study progress and history
- Manage their profile and achievements

Tech Stack:
- Frontend: React.js + Tailwind CSS + Framer Motion
- Backend: Node.js + Express.js
- Database: MongoDB Atlas (Mongoose ODM)
- Auth: JWT + bcrypt (Google OAuth optional)
- File Storage: Cloudinary
- AI: Google Gemini API (gemini-1.5-flash model)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FOLDER STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

studybuddy-ai/
├── client/                         # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/             # Navbar, Sidebar, Loader, Modal
│   │   │   ├── auth/               # LoginForm, SignupForm
│   │   │   ├── dashboard/          # StatsCard, RecentActivity, QuickActions
│   │   │   ├── upload/             # DropZone, FilePreview, UploadProgress
│   │   │   ├── summary/            # SummaryCard, SummaryActions
│   │   │   ├── quiz/               # QuizCard, QuizTimer, ScoreBoard
│   │   │   └── profile/            # ProfileForm, AchievementBadge
│   │   ├── context/                # AuthContext, ThemeContext
│   │   ├── hooks/                  # useAuth, useUpload, useQuiz
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── UploadPage.jsx
│   │   │   ├── SummaryPage.jsx
│   │   │   ├── QuizPage.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── services/               # api.js, authService.js, aiService.js
│   │   ├── utils/                  # formatDate, calculateScore, helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
├── server/                         # Express backend
│   ├── config/
│   │   ├── db.js                   # MongoDB connection
│   │   ├── cloudinary.js           # Cloudinary setup
│   │   └── gemini.js               # Gemini API setup
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── notesController.js
│   │   ├── aiController.js
│   │   ├── quizController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verify
│   │   ├── uploadMiddleware.js     # Multer config
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Note.js
│   │   ├── Summary.js
│   │   ├── Quiz.js
│   │   └── QuizAttempt.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── notesRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── quizRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── geminiHelper.js         # Prompt builders for Gemini
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── README.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BACKEND — MONGODB SCHEMAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// models/User.js
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String }, // null for Google OAuth users
  avatar: { type: String, default: '' },
  googleId: { type: String },
  totalUploads: { type: Number, default: 0 },
  totalQuizzes: { type: Number, default: 0 },
  totalSummaries: { type: Number, default: 0 },
  avgQuizScore: { type: Number, default: 0 },
  badges: [{ name: String, icon: String, earnedAt: Date }],
  createdAt: { type: Date, default: Date.now }
});

// models/Note.js
const NoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String, required: true },     // Cloudinary URL
  fileType: { type: String, enum: ['pdf', 'doc', 'txt', 'image'] },
  fileSize: { type: Number },
  publicId: { type: String },                    // Cloudinary public_id
  category: { 
    type: String, 
    enum: ['Science', 'Math', 'History', 'Language', 'Other'],
    default: 'Other'
  },
  extractedText: { type: String },               // Text extracted from file
  hasSummary: { type: Boolean, default: false },
  hasQuiz: { type: Boolean, default: false },
  uploadedAt: { type: Date, default: Date.now }
});

// models/Summary.js
const SummarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' },
  shortSummary: { type: String },
  detailedSummary: { type: String },
  keyPoints: [String],
  keywords: [String],
  generatedAt: { type: Date, default: Date.now }
});

// models/Quiz.js
const QuizSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' },
  title: { type: String },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  questions: [{
    question: String,
    type: { type: String, enum: ['mcq', 'truefalse'] },
    options: [String],           // For MCQ: 4 options
    correctAnswer: String,
    explanation: String
  }],
  timeLimit: { type: Number, default: 600 },     // seconds
  createdAt: { type: Date, default: Date.now }
});

// models/QuizAttempt.js
const QuizAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  answers: [{ questionIndex: Number, selectedAnswer: String, isCorrect: Boolean }],
  score: Number,
  totalQuestions: Number,
  timeTaken: Number,
  attemptedAt: { type: Date, default: Date.now }
});

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BACKEND — ALL API ROUTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AUTH ROUTES (/api/auth)
  POST /register        → name, email, password → create user, return JWT
  POST /login           → email, password → verify, return JWT + user data
  POST /forgot-password → email → send reset link (use nodemailer)
  POST /reset-password  → token, newPassword → update password
  GET  /me              → (protected) return current user data
  POST /google          → googleToken → verify with Google, create/login user

NOTES ROUTES (/api/notes) — all protected
  POST   /upload        → multipart/form-data file → upload to Cloudinary,
                          extract text (use pdf-parse for PDF), save Note to DB
  GET    /              → return all notes for current user (with pagination)
  GET    /:id           → return single note
  DELETE /:id           → delete note from DB + Cloudinary
  PATCH  /:id           → update title, description, category

AI ROUTES (/api/ai) — all protected
  POST /summarize       → { noteId } → fetch note text, send to Gemini,
                          return + save Summary to DB
  POST /generate-quiz   → { noteId, difficulty, questionCount } →
                          send to Gemini, parse response, save Quiz to DB
  POST /extract-text    → { noteId } → re-extract text from file

QUIZ ROUTES (/api/quiz) — all protected
  GET  /                → return all quizzes for user
  GET  /:id             → return quiz with questions
  POST /:id/attempt     → { answers, timeTaken } → calculate score,
                          save QuizAttempt, update user avgQuizScore
  GET  /:id/attempts    → return all attempts for a quiz

USER ROUTES (/api/user) — all protected
  GET    /profile       → return user profile + stats
  PATCH  /profile       → update name, bio
  POST   /avatar        → upload profile picture to Cloudinary
  GET    /stats         → { totalUploads, totalQuizzes, avgScore, badges }
  DELETE /account       → delete all user data

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BACKEND — GEMINI AI INTEGRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Install: npm install @google/generative-ai

// config/gemini.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
module.exports = model;

// utils/geminiHelper.js — Build these exact prompts:

SUMMARY PROMPT:
"You are an expert academic summarizer. Given the following study notes, 
provide a JSON response with this exact structure:
{
  'shortSummary': '2-3 sentence overview',
  'detailedSummary': 'comprehensive paragraph summary',
  'keyPoints': ['point 1', 'point 2', ...up to 8 points],
  'keywords': ['keyword1', 'keyword2', ...up to 10 keywords]
}
Only return valid JSON, no markdown. Notes: [NOTE_TEXT]"

QUIZ PROMPT:
"You are an expert quiz creator. Create [COUNT] questions from these study 
notes at [DIFFICULTY] difficulty. Return ONLY valid JSON:
{
  'questions': [
    {
      'question': 'Question text?',
      'type': 'mcq',
      'options': ['A) option', 'B) option', 'C) option', 'D) option'],
      'correctAnswer': 'A) option',
      'explanation': 'Why this is correct'
    },
    {
      'question': 'True or False: statement',
      'type': 'truefalse',
      'options': ['True', 'False'],
      'correctAnswer': 'True',
      'explanation': 'Explanation'
    }
  ]
}
Mix MCQ and True/False questions. Notes: [NOTE_TEXT]"

Parse Gemini response: strip markdown code blocks with regex, then JSON.parse().
Always wrap in try/catch and return 500 if AI fails.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BACKEND — FILE UPLOAD SETUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Install: npm install multer cloudinary multer-storage-cloudinary pdf-parse

// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
module.exports = cloudinary;

// middleware/uploadMiddleware.js
Use multer-storage-cloudinary. Store in folder 'studybuddy/notes'.
Accept: pdf, doc, docx, txt, png, jpg (for image-based notes).
Max file size: 10MB.
After upload to Cloudinary, if PDF: use pdf-parse to extract text.
Store extractedText in Note document (max 50,000 chars).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRONTEND — ALL PAGES (DETAILED)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

--- LANDING PAGE (/) ---
- Hero section: animated headline "Study Smarter with AI"
- Feature cards: Upload Notes, AI Summaries, Auto Quizzes, Track Progress
- CTA buttons: "Get Started Free" → /signup, "Login" → /login
- Animated background: subtle floating particles or gradient mesh
- Stats section: "500+ Students", "10,000+ Notes Uploaded", "50,000+ Quizzes"

--- AUTH PAGES ---
Signup (/signup):
  Fields: Full Name, Email, Password, Confirm Password
  Validation: all fields required, password min 8 chars, passwords must match
  On submit: POST /api/auth/register → save JWT to localStorage → redirect /dashboard
  Link: "Already have account? Login"
  Optional: "Continue with Google" button

Login (/login):
  Fields: Email, Password, "Remember Me" checkbox
  On submit: POST /api/auth/login → save JWT → redirect /dashboard
  Link: "Forgot Password?" → /forgot-password
  Show/hide password toggle

Forgot Password (/forgot-password):
  Field: Email
  On submit: POST /api/auth/forgot-password → show success message
  "Back to Login" link

--- LAYOUT (authenticated pages) ---
Sidebar (desktop) / Bottom nav (mobile):
  Logo + "StudyBuddy AI" at top
  Nav items with icons: Dashboard, Upload Notes, AI Summary, 
                        Quiz Generator, History, Profile
  Active state: highlighted with purple accent
  Bottom: Dark mode toggle + Logout button
  Collapse sidebar on mobile (hamburger menu)

--- DASHBOARD PAGE (/dashboard) ---
Top bar: "Good Morning, [Name]! 👋" + current date
Stats row (4 cards with icons + animations):
  - Total Uploads (file icon, blue)
  - Summaries Generated (sparkle icon, purple)  
  - Quizzes Taken (brain icon, green)
  - Avg Quiz Score % (trophy icon, amber)

Quick Actions (3 big buttons):
  - "Upload New Notes" → /upload
  - "Generate Summary" → /summary
  - "Take a Quiz" → /quiz

Recent Uploads (last 5 notes):
  Each row: file icon, title, category badge, date, action buttons (Summary, Quiz)

Recent Activity feed (last 10 actions):
  "You uploaded 'Chapter 5 Notes'" · 2 hours ago
  "Quiz completed: 85% score" · yesterday

Progress Chart: Simple bar chart (last 7 days activity) using recharts or Chart.js

--- UPLOAD PAGE (/upload) ---
Drag & Drop Zone:
  Large dashed border area: "Drop your files here or click to browse"
  Accept: PDF, DOC, DOCX, TXT, PNG, JPG
  Show file type icons when hovering different types
  
File Details Form (appears after file selected):
  - Title (auto-filled from filename, editable)
  - Description (optional textarea)
  - Category (dropdown: Science, Math, History, Language, Other)
  
Upload Progress:
  Progress bar with percentage
  "Uploading to cloud..." → "Extracting text..." → "Done! ✓"
  
File Preview:
  PDF: Show first page thumbnail (use react-pdf or iframe)
  Image: Show preview
  DOC/TXT: Show extracted text preview (first 200 chars)

After success: show "Generate Summary" and "Create Quiz" buttons

--- AI SUMMARY PAGE (/summary) ---
Left panel — Note selector:
  List of all uploaded notes
  Search bar to filter notes
  Click a note to select it

Right panel — Summary view:
  Selected note info (title, date, file type)
  "Generate Summary" button (shows loading spinner while calling API)
  
  Generated Summary display:
    Short Summary card (highlighted box)
    Detailed Summary (expandable accordion)
    Key Points (bulleted list with checkmarks)
    Keywords (pill/badge tags, clickable)
  
  Action buttons:
    Copy Summary (clipboard icon)
    Download as PDF
    "Create Quiz from This" button

--- QUIZ GENERATOR PAGE (/quiz) ---
Step 1 — Setup:
  Select note (searchable dropdown)
  Number of questions: slider 5–20
  Difficulty: Easy / Medium / Hard (radio buttons)
  "Generate Quiz" button

Step 2 — Quiz Interface (after generation):
  Quiz title at top
  Progress bar: "Question 3 of 10"
  Timer (countdown, red when < 60 seconds)
  
  Question card:
    Question number + text (large, clear)
    MCQ: 4 option buttons (A, B, C, D) 
    True/False: 2 large buttons
    Selected answer highlights in blue
    
  Navigation: Previous / Next / Submit

Step 3 — Results:
  Score circle (big animated number, e.g. "8/10")
  Percentage with pass/fail status (≥60% = pass)
  Time taken
  Question-by-question review:
    ✓ Correct (green), ✗ Wrong (red)
    Show correct answer + explanation for each
  Buttons: "Retry Quiz", "Generate New Quiz", "Back to Dashboard"

--- HISTORY PAGE (/history) ---
Three tabs: "My Notes" | "Summaries" | "Quiz Attempts"

My Notes tab:
  Grid of note cards (title, category badge, date, file type icon)
  Search bar + Category filter dropdown + Sort (newest/oldest)
  Each card: View, Generate Summary, Create Quiz, Delete buttons

Summaries tab:
  List of generated summaries (note title, date, keywords preview)
  Click to expand full summary
  Copy + Download buttons per summary

Quiz Attempts tab:
  Table: Quiz Name | Score | Date | Time Taken | Actions
  "View Details" opens attempt review
  Sort by date or score

--- PROFILE PAGE (/profile) ---
Left: Avatar section
  Circle avatar (click to upload new image)
  Upload progress shown inline

Right: Edit form
  Full Name, Email (read-only), Bio (textarea)
  "Save Changes" button

Stats section:
  Total Uploads | Summaries | Quizzes | Avg Score
  
Achievements / Badges:
  Locked + unlocked badges in a grid
  Examples:
    "First Upload" (unlocks after 1st upload)
    "Quiz Master" (avg score > 80%)
    "Speed Reader" (3+ summaries in a day)
    "Consistent Learner" (7-day streak)

Account Settings:
  Change Password form (current + new + confirm)
  "Delete Account" (with confirmation modal)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRONTEND — CONTEXT AND AUTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// context/AuthContext.jsx
- Store: user object, JWT token, isAuthenticated, isLoading
- Functions: login(), logout(), register(), updateUser()
- On app load: check localStorage for token, validate with GET /api/auth/me
- Provide auth state to entire app via Context API

// Protected Route wrapper:
If not authenticated → redirect to /login
If authenticated + trying to access /login → redirect to /dashboard

// services/api.js
- Axios instance with baseURL = process.env.REACT_APP_API_URL
- Request interceptor: attach Authorization: Bearer [token] to every request
- Response interceptor: if 401 → clear token → redirect to /login

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UI/UX DESIGN SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Color Palette (Tailwind custom config):
  Primary:   #6C63FF (purple)
  Secondary: #4ECDC4 (teal)
  Accent:    #FFE66D (yellow)
  Dark bg:   #0F0F1A
  Dark card: #1A1A2E
  Dark sidebar: #16213E

Typography:
  Font: Inter (Google Fonts)
  Headings: font-bold tracking-tight
  Body: font-normal leading-relaxed

Components style:
  Cards: glassmorphism — 
    background: rgba(255,255,255,0.05)
    backdrop-filter: blur(10px)
    border: 1px solid rgba(255,255,255,0.1)
    border-radius: 16px
  
  Buttons: 
    Primary: bg-[#6C63FF] hover:bg-[#5A52D5] rounded-xl px-6 py-3 
             font-semibold transition-all duration-200 hover:scale-[1.02]
    Secondary: border border-[#6C63FF] text-[#6C63FF] same hover
    Danger: bg-red-500/20 text-red-400 border border-red-500/30
  
  Inputs:
    bg-white/5 border border-white/10 rounded-xl px-4 py-3
    focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20
    placeholder-gray-500

Dark Mode:
  Default to dark mode. Use Tailwind dark: classes.
  ThemeContext with localStorage persistence.
  Toggle button in sidebar.

Animations (use Framer Motion):
  Page transitions: fade + slide up (0.3s)
  Card hover: scale(1.02) + shadow lift
  Stats counter: count up animation on mount
  Score circle: SVG stroke-dashoffset animation
  Loading states: skeleton screens (not spinners) for content

Mobile Responsive:
  Sidebar → bottom navigation bar on mobile (< 768px)
  Stats grid → 2 columns on mobile, 4 on desktop
  Quiz options → full width on mobile
  File upload → simplified drag zone on mobile

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ENVIRONMENT VARIABLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// server/.env
PORT=5000
MONGODB_URI=mongodb+srv://[user]:[pass]@cluster.mongodb.net/studybuddy
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:3000

// client/.env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id (optional)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PACKAGES TO INSTALL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SERVER:
npm install express mongoose dotenv bcryptjs jsonwebtoken 
cors helmet morgan multer cloudinary multer-storage-cloudinary 
pdf-parse @google/generative-ai nodemailer express-async-handler 
express-rate-limit

SERVER DEV:
npm install --save-dev nodemon

CLIENT:
npm install axios react-router-dom framer-motion 
react-dropzone react-hot-toast react-icons recharts 
react-pdf @headlessui/react clsx

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPORTANT IMPLEMENTATION NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. SECURITY: Never expose API keys in frontend. All AI calls go through 
   your backend. Validate JWT on every protected route.

2. ERROR HANDLING: Every API endpoint must return proper error messages:
   { success: false, message: "Descriptive error message" }
   Show these errors as toast notifications in frontend.

3. LOADING STATES: Every async action must show loading state.
   Use skeleton screens for initial data load, spinners for actions.

4. GEMINI TEXT LIMIT: Gemini has token limits. If extractedText > 30,000 
   chars, truncate to first 30,000 chars before sending to Gemini.

5. QUIZ PARSING: Gemini may return malformed JSON sometimes.
   Add retry logic: if JSON.parse fails, ask Gemini again once more.

6. FILE SIZE: Validate on both frontend (before upload) and backend 
   (multer limits). Show clear error if file too large.

7. PAGINATION: All list endpoints must support:
   ?page=1&limit=10 query params. Frontend shows "Load More" button.

8. BADGE SYSTEM: Check and award badges automatically after these events:
   - After first note upload → "First Upload" badge
   - After quiz attempt with score > 80% → "Quiz Master" badge  
   - After 3rd summary → "Summary Expert" badge
   Badge data stored in User.badges array.

9. RESPONSIVE IMAGES: All profile pictures and thumbnails must use 
   Cloudinary transformations: f_auto,q_auto,w_200,h_200,c_fill

10. Start server.js with: 
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    Use concurrently in root package.json to run both client + server.

Build this complete application with clean, well-commented code. 
Make sure every feature works end-to-end before moving to the next.