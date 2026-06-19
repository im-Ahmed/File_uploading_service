# FilePin — Frontend

A Pinterest-style React + Tailwind frontend for the File Uploading Service backend.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:5173
```

When the app loads for the first time, you'll be prompted to enter your backend server URL (e.g. `http://localhost:3000`).

## 🏗 Build for Production

```bash
npm run build
# Output is in the /dist folder
```

## 📁 Project Structure

```
filepin/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AuthForm.jsx        # Login / Register tabs
│   │   ├── FileModal.jsx       # File detail modal
│   │   ├── FilterChips.jsx     # All / Images / Docs / Other
│   │   ├── HeroStrip.jsx       # Dark CTA banner (logged-out)
│   │   ├── Icons.jsx           # All SVG icons
│   │   ├── Navbar.jsx          # Top nav with search + health dot
│   │   ├── PinCard.jsx         # Single masonry card
│   │   ├── PinGrid.jsx         # Masonry grid + skeletons + empty state
│   │   ├── ServerSetup.jsx     # First-time server URL config
│   │   └── UploadCard.jsx      # Drag-and-drop upload sidebar card
│   ├── hooks/
│   │   ├── useAuth.js          # Login, register, logout state
│   │   └── useFiles.js         # Load, upload, delete, getById
│   ├── lib/
│   │   └── api.js              # All API calls (maps to Postman collection)
│   ├── App.jsx                 # Root component
│   ├── index.css               # Tailwind directives + custom utilities
│   └── main.jsx                # React entry point
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## 🔌 API Endpoints Used

| Method | Endpoint | Used for |
|--------|----------|----------|
| POST | `/users/register` | Sign up |
| POST | `/users/login` | Log in (stores JWT) |
| POST | `/users/refresh-token` | Token refresh |
| GET | `/users/current-user` | Restore session |
| GET | `/users/logout` | Log out |
| POST | `/files/upload` | Upload file (multipart) |
| GET | `/files/` | Load all files |
| GET | `/files/:id` | File detail modal |
| DELETE | `/files/d/:id` | Delete a file |
| GET | `/healthcheck` | Nav health dot |

## 🎨 Design System

Built on the Pinterest design tokens:
- **Primary red** `#e60023` — CTAs only
- **Masonry grid** — 4 cols → 3 → 2 → 1 (responsive)
- **Rounded corners** — sm `8px`, md `16px`, lg `32px`, full pill
- **Skeleton loading**, drag-and-drop upload, hover overlays

## ⚙️ Configuration

The server URL is stored in `localStorage` under the key `fp_server`.
You can change it at any time using the **Change** link in the sidebar.
