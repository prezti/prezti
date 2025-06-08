# Contributing to Prezti

Thanks for wanting to contribute! This is a Next.js app with Supabase, so if you're familiar with that stack, you should feel right at home.

## Development Philosophy

We're currently in a **transition period** with a **frontend-first approach**:

### **Phase 1: Frontend-First (Current Focus)**

- Perfect the presentation editor user experience
- All functionality working with localStorage
- Core features: editing, themes, export, drag-and-drop
- No authentication or cloud storage needed
- Focus on polish, performance, and user experience

### **Phase 2: Backend Integration (Coming Next)**

- Move from localStorage to Supabase database
- Add user authentication and accounts
- Implement cloud storage and sharing
- Real-time collaboration features

**Why this approach?** It lets us iterate quickly on the editor experience without backend complexity, then add persistence and collaboration once the core UX is solid.

## Getting Started

### Local Setup

1. **Fork and clone:**

```bash
git clone https://github.com/prezti/prezti.git
cd prezti
npm install
```

2. **Set up Supabase locally:**

```bash
npx supabase start
```

This will give you local database URLs and keys.

**Note:** Supabase is currently only needed for the waitlist functionality. The presentation editor works completely offline.

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

5. **Start dev server:**

```bash
npm run dev
```

Now you can access:

- **Waitlist**: http://localhost:3000
- **Presentation Editor**: http://localhost:3000/app

## Making Changes

### Development Workflow

1. Create a branch: `git checkout -b your-feature-name`
2. Make your changes
3. Test that it works: `npm run build && npm run lint`
4. Commit and push
5. Open a PR

### Code Style

We use ESLint and TypeScript. The linter will catch most issues:

```bash
npm run lint
```

### Project Structure

The codebase is organized like this:

- `src/app/` - Next.js 15 app router pages
- `src/app/page.tsx` - Landing page with waitlist
- `src/app/(app)/app/` - Presentation editor
- `src/components/` - React components (UI, landing, slide editor, etc.)
- `src/server/` - API routes and database schema
- `src/stores/` - Zustand state management
- `src/lib/` - Utilities and configs

### Key Technologies

If you're working on specific areas, here's what you should know:

- **Slide Editor**: HTML/CSS elements with absolute positioning and CSS transforms
- **Drag & Drop**: dnd-kit for element manipulation and drag-and-drop
- **Database**: Drizzle ORM with Supabase PostgreSQL (currently waitlist only)
- **UI**: Radix UI components with TailwindCSS 4.0
- **Forms**: React Hook Form with Zod validation
- **Export**: pptxgenjs for PowerPoint export, html2canvas for images
- **Data Storage**: Currently localStorage for presentations, Supabase for waitlist

## Current Architecture

### Presentation Editor (`/app`)

The editor renders slide elements as HTML/CSS DOM elements with:

- Absolute positioning for element placement
- CSS transforms for rotation and scaling
- dnd-kit for drag-and-drop interactions
- Zustand for state management
- Local storage for persistence

### Landing Page (`/`)

Simple waitlist signup that stores emails in Supabase.

### Data Flow

- **Presentations**: JSON format stored in localStorage
- **Waitlist**: Stored in Supabase `waitlist_emails` table
- **Themes**: Applied via CSS custom properties and utility classes

## Types of Contributions

### **Phase 1 Focus Areas (Current Priority)**

These align with our frontend-first approach:

- **Editor UX Improvements**: Better drag-and-drop, selection, keyboard shortcuts
- **New Slide Templates**: More layout options and content types
- **Theme System**: Better theme editor, more theme options
- **Export Enhancements**: PDF export, better PowerPoint compatibility
- **Mobile Responsiveness**: Touch interactions, responsive editor
- **Accessibility**: Keyboard navigation, screen reader support
- **Performance**: Optimizations for large presentations

### **Phase 2 Areas (Future)**

These require backend integration:

- **Database Integration**: Moving from localStorage to Supabase
- **Authentication**: User accounts and sessions
- **Cloud Storage**: Save presentations online
- **Real-time Collaboration**: Multi-user editing
- **Sharing & Permissions**: Public links, team access

### Bug Fixes

- Check existing issues first
- Include steps to reproduce
- Test your fix locally

### Documentation

- Fix typos and improve clarity
- Add examples for complex features
- Update setup instructions if things change

## Commit Messages

Use clear, descriptive messages:

```
feat: add slide duplication
fix: resolve theme switching bug
docs: update installation steps
```

## Need Help?

- **Issues**: Use GitHub issues for bugs and feature requests
- **Questions**: GitHub discussions or Twitter [@prezti_com](https://twitter.com/prezti_com)
- **Urgent**: Ping [@YonatanLavy](https://twitter.com/YonatanLavy)

## What We're Looking For Right Now

**High Priority (Phase 1):**

- Editor experience improvements
- Bug fixes and performance optimizations
- New slide templates and layouts
- Better mobile/touch support
- Export format improvements
- Accessibility enhancements

**Medium Priority:**

- Documentation and examples
- Theme system enhancements
- Keyboard shortcuts and power user features

**Future (Phase 2):**

- Database integration planning
- Authentication system design
- Collaboration features architecture

## Testing

Currently no automated tests (we know, we know). For now:

- Test your changes manually
- Check different browsers if it's UI-related
- Make sure the build works: `npm run build`
- Test both waitlist (`/`) and editor (`/app`) routes
- Test localStorage persistence (presentations should survive page refresh)

## Contributing to the Transition

If you're interested in **Phase 2 backend work**, feel free to:

- Open issues discussing database schema for presentations
- Propose authentication flow designs
- Share ideas for collaboration features
- Help plan the localStorage → database migration

---

That's it! We're building something cool together, one phase at a time. Focus on making the editor experience amazing, and we'll handle the backend complexity later.
