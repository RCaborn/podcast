import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ArticlePage from './pages/ArticlePage'
import NewsletterPage from './pages/NewsletterPage'
import CommunityPage from './pages/CommunityPage'
import ThreadPage from './pages/ThreadPage'
import JoinPage from './pages/JoinPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import DirectoryPage from './pages/DirectoryPage'
import SubscribePage from './pages/SubscribePage'
import NotFoundPage from './pages/NotFoundPage'
import AdminGuard from './components/admin/AdminGuard'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import ArticlesAdminPage from './pages/admin/ArticlesAdminPage'
import ArticleEditorPage from './pages/admin/ArticleEditorPage'
import HomepageCurationPage from './pages/admin/HomepageCurationPage'
import CommunityModerationPage from './pages/admin/CommunityModerationPage'
import ThreadModerationPage from './pages/admin/ThreadModerationPage'

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
      { path: '/profile/:userId', element: <ProfilePage /> },
      { path: '/directory', element: <DirectoryPage /> },
      { path: '/subscribe', element: <SubscribePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    element: <AdminGuard />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin', element: <AdminDashboardPage /> },
          { path: '/admin/articles', element: <ArticlesAdminPage /> },
          { path: '/admin/articles/new', element: <ArticleEditorPage /> },
          { path: '/admin/articles/:id/edit', element: <ArticleEditorPage /> },
          { path: '/admin/homepage', element: <HomepageCurationPage /> },
          { path: '/admin/community', element: <CommunityModerationPage /> },
          { path: '/admin/community/:threadId', element: <ThreadModerationPage /> },
        ],
      },
    ],
  },
])
