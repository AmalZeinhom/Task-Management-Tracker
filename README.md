# Task Management Tracker

## 1. Project Overview

**Problem:** Teams need a lightweight, project-centric task management experience that connects authenticated users to projects, epics, tasks, and member collaboration without cumbersome setup.

**Solution:** A modern React SPA built with Vite, Tailwind and Supabase. It supports secure authentication, project creation, epic planning, member management, and a draggable task board for fast status updates.

## 2. Live Demo

https://task-management-tracker.vercel.app/

## 3. Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Supabase (Auth + REST)
- Axios
- React Router DOM
- Redux Toolkit
- React Query
- DnD Kit
- Framer Motion
- Zod
- React Hook Form
- React Hot Toast

## 4. Architecture Decisions

- **SPA routing with nested routes:** `react-router-dom` powers project-specific workflows under `/projects/:projectId/*`.
- **Centralized API client:** `src/API/axiosInstance.ts` handles Supabase auth headers and refresh token flows in one place.
- **Custom hooks:** `useEpics`, `useProjectName`, and `useUpdateEpics` encapsulate data fetching and page behavior.
- **Redux for auth state:** Authentication state is managed through Redux Toolkit while API requests rely on cookie-based session tokens.
- **Composable layout:** `src/Components/Layout.tsx` separates navigation and shared page scaffolding from business logic.

## 5. Data Flow

1. User logs in or signs up via Supabase auth endpoints.
2. Access and refresh tokens are stored in cookies.
3. `axiosInstance` attaches `Authorization` and `apikey` headers to requests.
4. Pages fetch project, epic, task, and member data from Supabase REST endpoints.
5. Drag-and-drop status changes patch task records and invalidate cached queries.
6. UI state is rendered from API responses, with local state syncing for epics and task board interactions.

## 6. Technical Highlights

- **Token refresh on 401:** Axios response interceptor automatically handles session expiration and retries.
- **Board view drag-and-drop:** `@dnd-kit/core` enables intuitive task movement across status columns.
- **Animated transitions:** `framer-motion` adds polished page and overlay animations.
- **Supabase REST approach:** Direct REST calls reduce backend complexity and improve iteration speed.
- **Error feedback:** `react-hot-toast` surfaces success and error states consistently.

## 7. Key Features

- Secure authentication: Sign up, log in, forgot password, reset password
- Project lifecycle: create, list, edit, and manage projects
- Team collaboration: invite members and browse project members
- Epic planning: create, list, and update epics
- Task management: create tasks, assign epics, set due dates, update status
- Drag-and-drop board: move tasks between workflow columns
- Search and workspace controls

## 8. Performance Optimization

- **Vite bundling:** fast development startup and optimized production builds.
- **Centralized API layer:** avoids repeated request configuration.
- **React Query cache management:** targeted invalidation limits unnecessary refetches.
- **Tailwind utility CSS:** keeps styles atomic and bundle size small.
- **Minimal rerenders:** status columns and drag overlays render only when needed.

## 9. Security Considerations

- Tokens stored in secure cookies with SameSite=strict
- Axios interceptor prevents unauthorized access loops
- Sensitive operations validated server-side via Supabase policies

## 10. Folder Structure

```
.
├── public/
├── src/
│   ├── API/
│   │   └── axiosInstance.ts
│   ├── Common/
│   ├── Components/
│   ├── Constants/
│   ├── hooks/
│   ├── Pages/
│   │   ├── Epics/
│   │   ├── Projects/
│   │   ├── Subpages/
│   │   └── Tasks/
│   ├── Store/
│   └── Types/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── vite.config.ts
```

## 11. Installation

1. Clone the repository

```bash
git clone <repo-url>
cd Task-Management-Tracker
pnpm install
```

2. Create a `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
```

3. Run locally

```bash
pnpm dev
```

## 12. Limitation

- Offline mode is not supported.
- Unit and integration tests are not included.

## 13. Future Improvements

- Add Supabase realtime or WebSocket updates for collaborative boards.
- Implement role-based permissions and member roles.
- Add automated tests for auth and task flows.
- Add audit history, notifications, and dark mode.

## 14. Challenges & Solutions

- Handling token expiration during concurrent requests  
  → solved using axios interceptor queueing strategy

- Drag-and-drop performance with large task lists  
  → optimized rendering using conditional overlays

- Syncing server state with local UI state  
  → solved via React Query invalidation + local state isolation