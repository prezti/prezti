# Prezti

A presentation editor built with Next.js and Supabase. Currently in development with a waitlist signup - the presentation editor is accessible at `/app`.

## What is this?

Prezti is an open-source presentation platform that lets you create slides quickly. It's built with modern web technologies and can be self-hosted. The editor uses HTML/CSS elements with drag-and-drop functionality.

**Current Status:**

- 🎯 **Landing page with waitlist** at `/` (root)
- 🚀 **Full presentation editor** available at `/app`
- 💾 **Data stored locally** (presentations saved in localStorage)
- 🔄 **In development** - database schema currently supports waitlist only

**Development Approach:**
We're in a **transition period** focusing on:

1. **Phase 1 (Current)**: Frontend-first development with localStorage

   - Full-featured presentation editor working locally
   - All core functionality implemented and tested
   - Export capabilities (PowerPoint, images) working
   - Theme system and UI components complete

2. **Phase 2 (Next)**: Backend integration
   - Move from localStorage to Supabase database
   - Add user authentication and accounts
   - Real-time collaboration features
   - Cloud storage and sharing

This approach lets us perfect the user experience and core functionality before adding backend complexity.

**Key features:**

- HTML/CSS-based slide editor with absolute positioning
- Drag and drop elements with dnd-kit
- Theme system with customizable templates
- AI-powered content generation (optional)
- Export to PowerPoint and PDF
- Real-time preview
- Self-hostable

## Tech Stack

- **Frontend:** Next.js 15.3.2, React 19, TypeScript 5
- **Database:** Supabase with Drizzle ORM (currently waitlist only)
- **Styling:** TailwindCSS 4.0, Radix UI components
- **Editor:** HTML/CSS elements with absolute positioning and transforms
- **Drag & Drop:** dnd-kit for element manipulation
- **Forms:** React Hook Form with Zod validation
- **State:** Zustand for global state
- **UI:** Lucide icons, Sonner for toasts, Framer Motion
- **Export:** pptxgenjs for PowerPoint, html2canvas for images

## Quick Start

### Prerequisites

- Node.js 18+
- A Supabase project (local or hosted) - _currently only needed for waitlist_

### Setup

1. **Clone and install:**

```bash
git clone https://github.com/prezti/prezti.git
cd prezti
npm install
```

2. **Set up Supabase:**

For local development (recommended):

```bash
npx supabase start
```

Or use hosted Supabase and get your project URL and keys.

3. **Environment variables:**

Copy the example file and fill in your credentials:

```bash
cp env.example .env.local
```

Then edit `.env.local` with your Supabase details (you'll get these from `npx supabase start`).

4. **Database setup:**

```bash
npm run db:push
npm run db:generate
```

5. **Start development:**

```bash
npm run dev
```

Visit http://localhost:3000 for the waitlist or http://localhost:3000/app for the editor

**Note:** The presentation editor works completely offline - Supabase is only needed for the waitlist functionality.

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Drizzle types
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio
```

### Project Structure

```
src/
├── app/                 # Next.js 15 app router
│   ├── page.tsx        # Landing page with waitlist
│   └── (app)/app/      # Presentation editor
├── components/
│   ├── ui/             # Radix UI components
│   ├── landing/        # Landing page and waitlist
│   ├── slide/          # Presentation editor
│   └── global/         # Layout components
├── lib/                # Utilities and configurations
├── server/
│   ├── api/           # API routes
│   └── db/            # Database schema (Drizzle)
├── stores/            # Zustand stores
├── types/             # TypeScript definitions
└── utils/             # Helper functions
```

## Architecture Notes

The slide editor renders presentation elements as HTML/CSS with absolute positioning and CSS transforms. Each element (text, images, shapes) is a DOM element that can be dragged, resized, and styled. The dnd-kit library handles drag-and-drop interactions.

Presentations are stored as JSON with element positions and properties. The theme system allows for customizable colors, fonts, and layouts. Currently, presentation data is saved to localStorage - database integration for presentations is planned.

Supabase currently handles the waitlist functionality. The frontend uses React 19 with Next.js 15's app router for optimal performance.

## Current State & Roadmap

### **Phase 1: Frontend-First (Current)**

- **`/` (root)**: Landing page with waitlist signup
- **`/app`**: Full presentation editor (localStorage-based)
- **Database**: Only waitlist emails table exists
- **Presentations**: Stored in browser localStorage
- **Export**: PowerPoint and image export working
- **Focus**: Perfecting user experience and core functionality

### **Phase 2: Backend Integration (Next)**

- Move presentations from localStorage to Supabase
- Add user authentication and accounts
- Implement cloud storage and sharing
- Add real-time collaboration
- Team workspaces and permissions

This phased approach ensures we deliver a polished, fully-functional editor experience before adding backend complexity.

## Deployment

### Vercel (easiest)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Self-hosted

```bash
npm run build
npm start
```

Set up a reverse proxy (nginx/caddy) and configure your domain.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Quick contribution workflow:**

1. Fork the repo
2. Create a feature branch
3. Make changes
4. Test locally
5. Submit a PR

**Current Focus Areas:**

- Frontend editor improvements and bug fixes
- New slide templates and themes
- Export enhancements
- Mobile responsiveness
- Accessibility improvements

## License

Apache 2.0 - see [LICENSE](LICENSE)

## Links

- **GitHub:** https://github.com/prezti/prezti
- **Twitter:** [@prezti_com](https://twitter.com/prezti_com)
- **Creator:** [@YonatanLavy](https://twitter.com/YonatanLavy)

---

Built with Next.js 15, React 19, and Supabase.
