import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ArticlePage from './pages/ArticlePage'
import NewsletterPage from './pages/NewsletterPage'

const Placeholder = () => null

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/articles/:slug', element: <ArticlePage /> },
      { path: '/newsletter', element: <NewsletterPage /> },
      { path: '/newsletter/:slug', element: <ArticlePage /> },
      { path: '/community', element: <Placeholder /> },
      { path: '/community/:threadId', element: <Placeholder /> },
      { path: '/join', element: <Placeholder /> },
      { path: '/login', element: <Placeholder /> },
      { path: '/profile/:userId', element: <Placeholder /> },
    ],
  },
])
