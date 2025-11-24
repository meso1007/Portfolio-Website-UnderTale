# 🎮 UNDERTALE-Inspired Portfolio Website


A personal portfolio website inspired by UNDERTALE, featuring pixel art aesthetics, retro sound effects, and dynamic content management through Notion API.

## ✨ Features

- 🎨 **UNDERTALE-themed UI** - Pixel art design with authentic retro aesthetics
- 🔊 **Sound Effects** - Interactive sound effects for menu navigation
- 📝 **Guestbook** - Visitors can leave messages (stored in Notion)
- 💼 **Dynamic Projects** - Project portfolio managed via Notion database
- 🎭 **Multiple Routes** - Neutral, Pacifist, and Genocide routes with different UI themes
- 💾 **Smart Caching** - LocalStorage caching for improved performance
- 🌐 **Notion Integration** - Content management through Notion API

## 🚀 Tech Stack

### Frontend
- **React** + **TypeScript** + **Vite**
- **TailwindCSS** for styling
- **Lucide React** for icons

### Backend
- **Go** (Golang)
- **Notion API** for data persistence
- **CORS** middleware for cross-origin requests

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Go** (v1.21 or higher)
- **Notion Account** with Integration setup

## 🛠️ Setup

### 1. Clone the Repository

```bash
git clone https://github.com/meso1007/Portfolio-Website-UnderTail.git
cd Portfolio-Website-UnderTail
```

### 2. Frontend Setup

```bash
npm install
```

### 3. Backend Setup

#### Create Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Name it (e.g., "Portfolio Backend")
4. Copy the **Internal Integration Token**

#### Create Notion Databases

**Guestbook Database:**
- Create a new database in Notion
- Add properties:
  - `Name` (Title)
  - `Message` (Text)
  - `Date` (Date)
- Share the database with your integration
- Copy the **Database ID** from the URL

**Projects Database:**
- Create another database
- Add properties:
  - `Name` (Title)
  - `Description` (Text)
  - `Tech` (Multi-select)
  - `ATK` (Number)
  - `DEF` (Number)
  - `Link` (URL)
  - `Image` (Files & media)
- Share with your integration
- Copy the **Database ID**

#### Configure Environment Variables

Create `backend/.env`:

```env
# Guestbook
NOTION_TOKEN=your_guestbook_integration_token
NOTION_DATABASE_ID=your_guestbook_database_id

# Projects
NOTION_PROJECTS_TOKEN=your_projects_integration_token
NOTION_PROJECTS_DB_ID=your_projects_database_id
```

#### Install Go Dependencies

```bash
cd backend
go mod tidy
```

## 🏃 Run Locally

### Start Backend Server

```bash
cd backend
go run main.go
```

Server will start on `http://localhost:8080`

### Start Frontend Dev Server

```bash
npm run dev
```

Frontend will be available at `http://localhost:3002` (or next available port)

## 📁 Project Structure

```
Portfolio-Website-UnderTail/
├── backend/
│   ├── main.go           # Go backend with Notion API
│   ├── go.mod            # Go dependencies
│   └── .env              # Environment variables (not committed)
├── src/
│   ├── components/       # React components
│   ├── views/            # Main view components (Fight, Act, Item, Mercy)
│   ├── utils/            # Utility functions (sound, etc.)
│   └── types.ts          # TypeScript type definitions
├── public/               # Static assets
└── README.md
```

## 🎯 Key Features Explained

### Guestbook
- Visitors can leave messages via the "SAVE POINT" (⭐)
- Messages are stored in Notion database
- Fallback to LocalStorage if backend is unavailable

### Projects
- Dynamically loaded from Notion database
- 1-hour cache in LocalStorage for performance
- Fallback to hardcoded projects if API fails
- Placeholder images for projects without images

### Routes
- **Neutral**: Default theme
- **Pacifist**: Unlocked by sparing in Mercy view
- **Genocide**: Triggered by attacking in Fight view

## 🔧 Configuration

### Cache Duration
Edit `views/FightView.tsx` to change cache duration:
```typescript
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour (in milliseconds)
```

### CORS Settings
Backend allows requests from:
- `http://localhost:5173`
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:3002`

Add more origins in `backend/main.go` if needed.

## 📝 Adding Projects to Notion

1. Open your Projects database in Notion
2. Add a new page with:
   - **Name**: Project title
   - **Description**: Brief description
   - **Tech**: Technology tags (e.g., React, Go, TypeScript)
   - **ATK**: Complexity score (0-100)
   - **DEF**: Maintainability score (0-100)
   - **Link**: GitHub or demo URL
   - **Image**: Screenshot or project image
3. Changes will appear on the website after cache expires (1 hour) or on hard refresh

## 🎨 Customization

- **Colors**: Edit `tailwind.config.js` for theme colors
- **Sounds**: Replace audio files in `public/sounds/`
- **Fonts**: Pixel fonts are defined in `index.css`

## 📄 License

This project is inspired by UNDERTALE by Toby Fox. All UNDERTALE-related assets and concepts belong to their respective owners.

## 🙏 Credits

- **UNDERTALE** by Toby Fox - Original game inspiration
- **Notion API** - Content management
- **Unsplash** - Placeholder images

---

Made with ❤️ and determination
