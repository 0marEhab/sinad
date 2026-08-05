import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import CreateInvoice from './pages/CreateInvoice'
import EditInvoice from './pages/EditInvoice'
import Clients from './pages/Clients'
import { MainLayout } from './components/layout/MainLayout'
import { ProtectedRoute } from './components/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />
          },
          {
            path: "create-invoice",
            element: <CreateInvoice />
          },
          {
            path: "edit-invoice/:id",
            element: <EditInvoice />
          },
          {
            path: "clients",
            element: <Clients />
          }
        ]
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  }
])

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <RouterProvider router={router} />
  )
}

export default App
