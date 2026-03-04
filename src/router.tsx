import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ArticlePage from './pages/ArticlePage'
import NewsletterPage from './pages/NewsletterPage'
import CommunityPage from './pages/CommunityPage'
import ThreadPage from './pages/ThreadPage'
import JoinPage from './pages/JoinPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'

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
      { path: '/join', element: <JoinPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/profile/:userId', element: <Placeholder /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
