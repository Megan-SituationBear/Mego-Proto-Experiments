# Copado AI Prototype

A modern React prototype for Copado AI featuring template management, AI-powered conversations, and project workflows.

## 🚀 Features

- **Landing Page** with AI input and template showcase
- **User Authentication** with modal-based login/signup
- **Home Dashboard** with "Your Work" and "Templates For You" tabs
- **Template System** with categories and favorites
- **AI Conversations** with automatic workspace creation
- **Project Management** with duplicated templates and outputs
- **Hamburger Menu** with recent items and navigation

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **Vite** for blazing-fast development
- **Tailwind CSS** for styling
- **Lucide React** for icons

## 📦 Installation

```bash
npm install
```

## 🏃 Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## 🏗️ Build

```bash
npm run build
```

## 👀 Preview Build

```bash
npm run preview
```

## 🌐 GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages.

**See [GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md) for detailed setup instructions.**

### Quick Deploy

1. Push to GitHub
2. Enable GitHub Pages in repository Settings → Pages → Source: **GitHub Actions**
3. Your site will be live at `https://<username>.github.io/<repository>/`

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
