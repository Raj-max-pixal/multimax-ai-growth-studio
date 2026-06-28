# MultiMax AI Growth Studio

A production-ready AI-powered marketing platform for startups and small businesses. Generate marketing strategies, create AI content, plan campaigns, estimate ROI, and analyze marketing performance.

## Features

- **AI Business Analyzer**: Generate SWOT analysis, customer personas, marketing strategies, and competitor insights
- **Content Generator**: Create engaging content for Instagram, LinkedIn, Facebook, Twitter, blogs, emails, and ads
- **Campaign Planner**: Generate 7-day, 30-day, festival, and product launch campaign plans
- **ROI Predictor**: Estimate reach, clicks, conversions, and ROI for campaigns before spending
- **Analytics Dashboard**: Track campaign performance, content engagement, and growth trends
- **AI Marketing Assistant**: Chat with an AI marketing expert that knows your business
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Demo Mode**: Works without Firebase/Gemini API for testing and demos
- **Mobile Responsive**: Fully responsive design with mobile sidebar
- **Toast Notifications**: User-friendly success/error feedback

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide React
- **Charts**: Recharts
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **AI**: Google Gemini API
- **Hosting**: Vercel

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase account (for production use)
- Google AI Studio account (for AI features)

## Quick Start (Demo Mode)

The app works in **Demo Mode** without any configuration. Simply:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "MultiMax AI Growth Studio"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) and click "Try Demo" to explore all features with mock data.

## Production Setup (Firebase + Gemini)

For full functionality with real authentication and AI:

### Step 1: Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Enter project name (e.g., "multimax-ai-growth-studio")
   - Accept Firebase terms and continue
   - Choose your Google Analytics account (optional)

2. **Enable Authentication**
   - Go to "Build" → "Authentication"
   - Click "Get Started"
   - Enable "Email/Password" sign-in provider
   - Click "Save"

3. **Create Firestore Database**
   - Go to "Build" → "Firestore Database"
   - Click "Create database"
   - Choose a location (e.g., nam5 (us-central))
   - Select "Start in Test Mode" (we'll update rules later)
   - Click "Create"

4. **Get Firebase Configuration**
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click web icon (</>)
   - Register app with name "multimax-web"
   - Copy the firebaseConfig values

### Step 2: Gemini API Setup

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the API key

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini API
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### Step 4: Update Firebase Security Rules

Go to Firestore → Rules and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 5: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/                # Dashboard pages
│   │   ├── page.tsx             # Main dashboard
│   │   ├── business-profile/     # Business profile form
│   │   ├── analyzer/            # AI Business Analyzer
│   │   ├── content-generator/    # Content Generator
│   │   ├── campaign-planner/    # Campaign Planner
│   │   ├── roi-predictor/       # ROI Predictor
│   │   ├── analytics/           # Analytics Dashboard
│   │   ├── assistant/           # AI Marketing Assistant
│   │   ├── settings/            # Settings page
│   │   └── layout.tsx          # Dashboard layout
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/                   # React components
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── tabs.tsx
│   │   └── textarea.tsx
│   ├── demo-banner.tsx          # Demo mode banner
│   ├── theme-provider.tsx       # Theme provider
│   └── toast.tsx                # Toast notifications
├── firebase/                     # Firebase configuration
│   └── config.ts
├── hooks/                        # Custom React hooks
│   └── useAuth.ts
├── lib/                         # Utility functions
│   ├── gemini.ts               # Gemini API integration
│   ├── mock-data.ts            # Mock data for demo mode
│   └── utils.ts                # Utility functions
├── services/                     # API services
│   ├── businessProfile.ts      # Business profile CRUD
│   ├── campaign.ts             # Campaign CRUD
│   └── content.ts              # Content CRUD
└── types/                       # TypeScript types
    └── index.ts
```

## Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your repository
   - Add environment variables from your `.env.local` file

3. **Deploy**
   - Vercel will automatically deploy your Next.js app
   - Your app will be live at `https://your-project.vercel.app`

## Usage

### Demo Mode
- Click "Try Demo" on the landing page
- Explore all features with mock data
- No configuration required

### Production Mode
1. **Sign up** for an account
2. **Complete your business profile** with information about your company
3. **Use AI tools**:
   - Generate business analysis
   - Create marketing content
   - Plan campaigns
   - Predict ROI
   - Chat with AI assistant
4. **Track performance** in the analytics dashboard

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | No (Demo Mode) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | No (Demo Mode) |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | No (Demo Mode) |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | No (Demo Mode) |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | No (Demo Mode) |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | No (Demo Mode) |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Gemini API key | No (Demo Mode) |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Demo Mode Features

When Firebase/Gemini are not configured:
- App shows "Firebase not configured. Running in Demo Mode" banner
- Authentication works with mock user
- All AI features return pre-built mock responses
- Dashboard displays mock data for campaigns, content, and analytics
- Perfect for demos, testing, and development

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@multimax.ai or open an issue in the repository.

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- AI powered by [Google Gemini](https://ai.google.dev)
- Authentication by [Firebase](https://firebase.google.com)
