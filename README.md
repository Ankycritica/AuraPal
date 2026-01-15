# AuraPal

A privacy-first, mindful-connection web application scaffold. Built with React, Vite, TailwindCSS, and ShadCN UI.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm test
```

## 📁 Project Structure

```
AuraPal/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # ShadCN UI primitives
│   │   └── ...             # Custom components (Hero, FeatureCard, etc.)
│   ├── pages/              # Page components
│   ├── store/              # Zustand state management
│   ├── lib/                # Utilities and mock data
│   ├── hooks/              # Custom React hooks
│   ├── test/               # Test setup and stubs
│   ├── App.jsx             # Main app with routing
│   └── main.jsx            # Entry point
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
└── vite.config.js          # Vite configuration
```

## 🎨 Tech Stack

- **React 19+** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **ShadCN UI** - Component primitives
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **ESLint + Prettier** - Code quality

## 🔐 Authentication

Currently uses **mock authentication** stored in localStorage. 

**TODO:** Integrate with a real auth provider:
- [Magic.Link](https://magic.link/)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Auth0](https://auth0.com/)
- Custom backend API

See `src/store/useStore.js` for integration points.

## 💬 Messaging

Messaging is **mocked** with local state. 

**TODO:** Integrate with real-time messaging:
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Pusher](https://pusher.com/)
- [Socket.io](https://socket.io/)
- Custom WebSocket server

See `src/store/useStore.js` → `useMessageStore` for integration points.

## 💳 Payments

Payment integration is **stubbed** with placeholder buttons.

**TODO:** Integrate payment providers:
- [Stripe](https://stripe.com/) for subscriptions
- PayPal buttons
- Cash App links

See `src/pages/Pricing.jsx` for integration points.

## 🧪 Testing

Test stubs are provided using Jest and React Testing Library. Run tests with:

```bash
npm test
```

Add more tests in `src/components/__tests__/` and `src/pages/__tests__/`.

## 🎯 Key Features

### Implemented
- ✅ Responsive layout with navigation
- ✅ Home, About, Features, Pricing pages
- ✅ Sign In/Sign Up with guest mode
- ✅ Onboarding flow
- ✅ Dashboard with suggested matches
- ✅ Profile editor
- ✅ Messages UI (mock data)
- ✅ Safety & Community Guidelines
- ✅ Privacy controls
- ✅ Report/Block functionality
- ✅ Accessibility features (skip links, ARIA labels, keyboard navigation)

### TODO / Integration Points
- 🔲 Real authentication (see `src/store/useStore.js`)
- 🔲 Real-time messaging (see `src/store/useStore.js`)
- 🔲 Payment integration (see `src/pages/Pricing.jsx`)
- 🔲 End-to-end encryption (currently mocked)
- 🔲 Image upload and cropping (onboarding)
- 🔲 Analytics opt-in (currently disabled)

## 🎨 Design System

- **Primary Color:** `#4f46e5` (indigo-600)
- **Font:** Inter (Google Fonts)
- **Spacing:** Tailwind default scale
- **Components:** ShadCN UI with custom styling

See `tailwind.config.js` for full design tokens.

## 📝 Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
VITE_AUTH_PROVIDER=
VITE_AUTH_API_KEY=
VITE_STRIPE_PUBLIC_KEY=
VITE_PAYPAL_CLIENT_ID=
VITE_ENABLE_ANALYTICS=false
```

## 🚢 Deployment

Build for production:

```bash
npm run build
```

The `dist/` folder contains the production build. Deploy to:
- Vercel
- Netlify
- Cloudflare Pages
- Any static hosting service

## 🔒 Privacy & Analytics

- **Analytics:** Disabled by default
- **Tracking:** No third-party trackers
- **Data:** Minimal collection, stored in localStorage (mock)
- **TODO:** Replace localStorage with secure backend storage

## 📚 Documentation

- [React Router Docs](https://reactrouter.com/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [ShadCN UI](https://ui.shadcn.com/)
- [Zustand Docs](https://github.com/pmndrs/zustand)

## 🤝 Contributing

This is a scaffold project. To extend it:

1. Replace mock data with real API calls
2. Integrate authentication provider
3. Add real-time messaging
4. Implement payment processing
5. Add end-to-end encryption
6. Set up backend services

## 📄 License

MIT

---

Built with ❤️ for privacy-first, authentic connection.
