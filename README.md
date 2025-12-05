# DamageAI

<div align="center">
  <img src="logo.png" alt="DamageAI Logo" width="80" height="80" />
</div>

<div align="center">
  <strong>Tool to simulate damage on products using artificial intelligence</strong>
</div>

---

## 📋 About the Project

DamageAI is a web application that uses artificial intelligence (Google Gemini) to simulate damage on products through image processing. The tool allows you to visualize how your products would look with different types of damage.

## 🚀 Technologies

- **React 19** - JavaScript library for building user interfaces
- **Vite** - Build tool and dev server
- **TypeScript** - Static typing
- **Tailwind CSS** - Utility-first CSS framework
- **Google Gemini AI** - Artificial intelligence API
- **React Router** - Page routing
- **Lucide React** - Icons

## 📦 Prerequisites

- Node.js 20+ 
- npm or yarn
- Google Gemini API key

## 🛠️ Local Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/italobarrosme/damageai.git
   cd damageai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Create a `.env.local` file in the project root:
   ```env
   GEMINI_API_KEY=your-api-key-here
   ```

4. **Run in development mode:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check for code issues
- `npm run lint:fix` - Automatically fix code issues
- `npm run format` - Format code

## 🐳 Docker

### Build the image

```bash
docker build -t damageai:latest .
```

### Run container

```bash
docker run -p 4321:4321 damageai:latest
```

The application will be available at `http://localhost:4321`

## 🔄 CI/CD

The project has CI/CD configured with GitHub Actions that:

- ✅ Automatically builds Docker image on push to `main` branch
- ✅ Pushes image to GitHub Container Registry (GHCR)
- ✅ Creates automatic tags (latest, sha, versions)

### Secrets Configuration

For the build to work correctly, configure the secret on GitHub:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add a new secret: `GEMINI_API_KEY`
3. Paste your Gemini API key

The image will be published at: `ghcr.io/italobarrosme/damageai:latest`

## 📁 Project Structure

```
damageai/
├── src/
│   ├── modules/
│   │   ├── common/          # Common components (Loading, Ilustrations)
│   │   ├── generate-images/  # Main image generation module
│   │   └── navigation/       # Navigation components
│   ├── services/             # Services (Gemini API)
│   ├── App.tsx               # Root component
│   └── Layout.tsx            # Main layout
├── .github/
│   └── workflows/            # GitHub Actions
├── Dockerfile                # Docker configuration
└── vite.config.ts           # Vite configuration
```

## 🏗️ Architecture

The project follows the **Container and Presentational Components** pattern:

- **Render Components**: Components that manage logic and data (usually server-side)
- **Presentational Components**: Components that only render the UI
- **Custom Hooks**: Business logic extracted into reusable hooks

## 📝 License

This project is private.

## 👤 Author

**Italo Barros**

---

<div align="center">
  Made with ❤️ using React and Vite
</div>
