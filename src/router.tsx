import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ArticlePage from './pages/ArticlePage'
import NewsletterPage from './pages/NewsletterPage'
import CommunityPage from './pages/CommunityPage'
import ThreadPage from './pages/ThreadPage'

const Placeholder = () => null

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/articles/:slug', element: <ArticlePage /> },
      { path: '/newsletter', element: <NewsletterPage /> },
      { path: '/newsletter/:slug', element: <ArticlePage /> },
      { path: '/community', element: <CommunityPage /> },
      { path: '/community/:threadId', element: <ThreadPage /> },
      { path: '/join', element: <Placeholder /> },
      { path: '/login', element: <Placeholder /> },
      { path: '/profile/:userId', element: <Placeholder /> },
    ],
  },
])
