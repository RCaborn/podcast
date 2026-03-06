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
import NotFoundPage from './pages/NotFoundPage'
import RequireAdmin from './components/auth/RequireAdmin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminArticles from './pages/admin/AdminArticles'
import AdminArticleEdit from './pages/admin/AdminArticleEdit'
import AdminUsers from './pages/admin/AdminUsers'
import AdminUserEdit from './pages/admin/AdminUserEdit'

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
      {
        path: '/admin',
        element: <RequireAdmin />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'articles', element: <AdminArticles /> },
          { path: 'articles/new', element: <AdminArticleEdit /> },
          { path: 'articles/:id/edit', element: <AdminArticleEdit /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'users/:id', element: <AdminUserEdit /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
