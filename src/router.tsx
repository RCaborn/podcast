import { createBrowserRouter } from 'react-router-dom'

const Placeholder = () => null

export const router = createBrowserRouter([
  { path: '/', element: <Placeholder /> },
  { path: '/articles/:slug', element: <Placeholder /> },
  { path: '/newsletter', element: <Placeholder /> },
  { path: '/newsletter/:slug', element: <Placeholder /> },
  { path: '/community', element: <Placeholder /> },
  { path: '/community/:threadId', element: <Placeholder /> },
  { path: '/join', element: <Placeholder /> },
  { path: '/login', element: <Placeholder /> },
  { path: '/profile/:userId', element: <Placeholder /> },
])
