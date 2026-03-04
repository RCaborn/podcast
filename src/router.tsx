import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'

const Placeholder = () => null

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/articles/:slug', element: <Placeholder /> },
      { path: '/newsletter', element: <Placeholder /> },
      { path: '/newsletter/:slug', element: <Placeholder /> },
      { path: '/community', element: <Placeholder /> },
      { path: '/community/:threadId', element: <Placeholder /> },
      { path: '/join', element: <Placeholder /> },
      { path: '/login', element: <Placeholder /> },
      { path: '/profile/:userId', element: <Placeholder /> },
    ],
  },
])
