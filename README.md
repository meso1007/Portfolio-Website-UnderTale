# UNDERTALE-Themed Portfolio Website

An interactive portfolio website inspired by the indie RPG game **UNDERTALE** by Toby Fox. This project showcases my work, skills, and experience through an engaging, game-like interface that pays homage to one of the most beloved indie games.

![Intro Screen](file:///Users/horiuchishoya/.gemini/antigravity/brain/58fd85f4-bb0e-4722-83e5-422745cd6c17/intro_screen_1763978720731.png)

## ✨ Features

### Core Features
- **UNDERTALE-Inspired UI**: Pixel-perfect recreation of UNDERTALE's battle interface with authentic fonts, colors, and animations
- **Interactive Battle Menu**: Navigate through portfolio sections using the iconic FIGHT/ACT/ITEM/MERCY command system
- **Dynamic Typewriter Effects**: Text appears with the signature UNDERTALE typewriter animation
- **Visit Counter & Personalized Messages**: Tracks visitor count using localStorage and displays unique messages based on visit frequency
- **Sound Effects**: Authentic UNDERTALE sound effects triggered by UI interactions using Web Audio API
- **Multiple Game Routes**: 
  - **Neutral Route**: Default experience
  - **Pacifist Route**: Triggered by peaceful interactions
  - **Genocide Route**: Activated by attacking the developer avatar (changes entire UI theme)

### Hidden Features
- **Secret Route Easter Egg**: Unlock hidden developer content by clicking buttons in a specific sequence (ACT → ITEM → MERCY → FIGHT)
- **Dynamic Avatar Messages**: 10+ unique messages that change based on visit count
- **City Detection**: Automatically detects and displays visitor's city using IP geolocation
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile devices

![Main Interface](file:///Users/horiuchishoya/.gemini/antigravity/brain/58fd85f4-bb0e-4722-83e5-422745cd6c17/main_interface_1763978754843.png)

## �️ Tech Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Web Audio API** - Sound effect management
- **localStorage** - Client-side data persistence

### Backend
- **Go** - Backend API server
- **Gin** - Web framework for Go
- **Notion API** - Content management for projects and guestbook
- **CORS** - Cross-origin resource sharing support

### APIs & Services
- **ipapi.co** - IP geolocation for city detection
- **Notion API** - Dynamic content management
- **DiceBear API** - Avatar generation (fallback)

## � Pages Overview

### 1. Intro Screen
![Intro Screen](file:///Users/horiuchishoya/.gemini/antigravity/brain/58fd85f4-bb0e-4722-83e5-422745cd6c17/intro_screen_1763978720731.png)

The landing page that mimics UNDERTALE's title screen:
- Animated title with glowing effects
- "CLICK TO START" prompt
- Smooth transition to main interface
- Encounter sound sequence on start

### 2. Main Interface (Battle Screen)
![Main Interface](file:///Users/horiuchishoya/.gemini/antigravity/brain/58fd85f4-bb0e-4722-83e5-422745cd6c17/main_interface_1763978754843.png)

The central hub featuring:
- Developer avatar with floating animation
- Dynamic speech bubble with visit-based messages
- HP/LV stats display
- Location information (city detection)
- Four main navigation buttons
- UNDERTALE-style dialogue box

### 3. PROJECTS (FIGHT)
![Projects Page](file:///Users/horiuchishoya/.gemini/antigravity/brain/58fd85f4-bb0e-4722-83e5-422745cd6c17/projects_page_1763978783286.png)

Showcases portfolio projects with:
- Project cards styled as UNDERTALE enemy encounters
- ATK/DEF stats representing project complexity and maintainability
- Technology stack badges
- Links to live demos and source code
- Dynamic content loaded from Notion API

### 4. SKILLS (ACT)
![Skills Page](file:///Users/horiuchishoya/.gemini/antigravity/brain/58fd85f4-bb0e-4722-83e5-422745cd6c17/skills_page_1763978857956.png)

Displays technical skills:
- Categorized skill list (Frontend, Backend, Tools)
- Skill level indicators (1-20 scale, UNDERTALE-style)
- Interactive skill descriptions
- Animated skill bars

### 5. HISTORY (ITEM)
![History Page](file:///Users/horiuchishoya/.gemini/antigravity/brain/58fd85f4-bb0e-4722-83e5-422745cd6c17/history_page_1763979895984.png)

Work experience and education:
- Timeline-style layout
- Company/institution information
- Role descriptions
- Year ranges
- UNDERTALE item menu aesthetic

### 6. CONTACT (MERCY)
![Contact Page](file:///Users/horiuchishoya/.gemini/antigravity/brain/58fd85f4-bb0e-4722-83e5-422745cd6c17/contact_page_1763978934027.png)

Contact information and social links:
- Email contact
- GitHub profile
- LinkedIn profile
- Instagram
- Guestbook feature (Notion-powered)
- "SPARE" button for Pacifist route trigger

### 7. SECRET Route (Hidden)
![Secret Route](file:///Users/horiuchishoya/.gemini/antigravity/brain/58fd85f4-bb0e-4722-83e5-422745cd6c17/secret_route_1763979001333.png)

Unlocked by clicking: **ACT → ITEM → MERCY → FIGHT**

Contains:
- Personal message from the developer
- Hidden statistics:
  - Total code lines: ~2,500+
  - Development time: 40+ hours
  - Coffee consumed: ∞ cups
  - Bugs fixed: Too many to count
- Complete tech stack breakdown
- Fun facts about development
- "True Explorer" achievement unlock

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Go (v1.19 or higher) - for backend

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Portfolio-Website-UnderTail
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

The site will be available at `http://localhost:3000`

### Backend Setup (Optional)

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create `.env` file**
```env
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_database_id
```

3. **Install Go dependencies**
```bash
go mod download
```

4. **Run the backend server**
```bash
go run main.go
```

Backend will run on `http://localhost:8080`

## 🚀 Deployment

### Deploy to Render

The backend is configured for easy deployment to Render. See the comprehensive [Deployment Guide](./DEPLOYMENT.md) for step-by-step instructions.

**Quick Start:**
1. Push your code to GitHub
2. Connect your repository to Render
3. Set environment variables (Notion API credentials)
4. Deploy!

The `render.yaml` file contains all necessary configuration for automatic deployment.

### Deploy Frontend (Vercel)

The frontend is optimized for deployment on Vercel.

1. Push your code to GitHub
2. Import project in Vercel
3. Vercel will automatically detect Vite and configure build settings
4. Deploy!

The `vercel.json` file handles SPA routing configuration.

## 🎮 Easter Eggs & Secrets

### Secret Route
Click the navigation buttons in this exact sequence to unlock hidden content:
1. SKILLS (ACT)
2. HISTORY (ITEM)
3. CONTACT (MERCY)
4. PROJECTS (FIGHT)

### Visit Counter Messages
The developer avatar displays different messages based on your visit count:
- Visit 1: "Greetings. I see you have fallen into my code."
- Visit 2: "You came back. I knew you would."
- Visit 3: "Third time. Looking for secrets?"
- Visit 4: "Four times. Don't you have work to do?"
- Visit 5: "Five times? You really like checking my stats."
- Visits 6-9: "Visit #X. You are filled with DETERMINATION."
- Visits 10-19: "X times... I guess we're friends now."
- Visits 20-49: "You know this portfolio better than I do."
- Visit 50+: "...You really have nothing better to do, do you?"

### Game Routes
- **Genocide Route**: Click the FIGHT button on the main screen to attack the developer
- **Pacifist Route**: Click "SPARE" in the CONTACT section

## 📁 Project Structure

```
Portfolio-Website-UnderTail/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── BattleButton.tsx
│   │   ├── DialogueBox.tsx
│   │   ├── SavePoint.tsx
│   │   ├── SoulHeart.tsx
│   │   └── Typewriter.tsx
│   ├── views/            # Page components
│   │   ├── ActView.tsx   # Skills page
│   │   ├── FightView.tsx # Projects page
│   │   ├── ItemView.tsx  # History page
│   │   ├── MercyView.tsx # Contact page
│   │   └── SecretView.tsx # Hidden route
│   ├── utils/            # Utility functions
│   │   └── sound.ts      # Sound effect management
│   ├── assets/           # Static assets
│   ├── App.tsx           # Main application component
│   ├── constants.ts      # Configuration constants
│   └── types.ts          # TypeScript type definitions
├── backend/              # Go backend server
│   ├── main.go
│   ├── go.mod
│   └── .env
└── public/               # Public assets

```

## 🎨 Design Philosophy

This portfolio was designed with the following principles:
1. **Authenticity**: Stay true to UNDERTALE's visual and interaction design
2. **Engagement**: Make portfolio browsing an interactive experience
3. **Personality**: Let the developer's personality shine through
4. **Accessibility**: Ensure content is accessible despite the game-like interface
5. **Performance**: Maintain smooth animations and quick load times

## 🙏 Credits

- **UNDERTALE** - Created by Toby Fox
- **Fonts**: Determination Mono, 8bitoperator
- **Sound Effects**: Web Audio API synthesis
- **Avatar Art**: Generated using ChatGPT
- **Inspiration**: The UNDERTALE community

## � License

This project is for portfolio purposes. UNDERTALE and all related assets are property of Toby Fox.

---

*"Despite everything, it's still you."* - UNDERTALE
