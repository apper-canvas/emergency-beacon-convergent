import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import { getRouteConfig } from "@/router/route.utils";
import Layout from "@/components/organisms/Layout";
import Root from "@/layouts/Root";

// Lazy load components
const Home = lazy(() => import('@/components/pages/Home'))
const Dashboard = lazy(() => import('@/components/pages/Dashboard'))
const Templates = lazy(() => import('@/components/pages/Templates'))
const WorkItems = lazy(() => import('@/components/pages/WorkItems'))
const Profile = lazy(() => import('@/components/pages/Profile'))
const Login = lazy(() => import('@/components/pages/Login'))
const Signup = lazy(() => import('@/components/pages/Signup'))
const Callback = lazy(() => import('@/components/pages/Callback'))
const ErrorPage = lazy(() => import('@/components/pages/ErrorPage'))
const NotFound = lazy(() => import('@/components/pages/NotFound'))
const ResetPassword = lazy(() => import('@/components/pages/ResetPassword'))
const PromptPassword = lazy(() => import('@/components/pages/PromptPassword'))

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
  </div>
)

// createRoute helper
const createRoute = ({ path, index, element, access, children, ...meta }) => {
  const configPath = index ? "/" : (path.startsWith('/') ? path : `/${path}`)
  const config = getRouteConfig(configPath)
  const finalAccess = access || config?.allow
  
  return {
    ...(index ? { index: true } : { path }),
    element: element ? <Suspense fallback={<LoadingSpinner />}>{element}</Suspense> : element,
    handle: { access: finalAccess, ...meta },
    ...(children && { children })
  }
}

// Router configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      // Public home page
      createRoute({
        index: true,
        element: <Home />,
        title: 'Home'
      }),
      
      // Main app with bottom navigation
// Main app with bottom navigation
      {
        path: '/',
        element: <Layout />,
        children: [
          createRoute({
            path: 'dashboard',
            element: <Dashboard />,
            title: 'Dashboard'
          }),
          createRoute({
            path: 'templates',
            element: <Templates />,
            title: 'Templates'
          }),
          createRoute({
            path: 'work-items',
            element: <WorkItems />,
            title: 'Work Items'
          }),
          createRoute({
            path: 'profile',
            element: <Profile />,
            title: 'Profile'
          })
        ]
      },
      
      // Auth routes (outside Layout)
      createRoute({
        path: 'login',
        element: <Login />,
        title: 'Login'
      }),
      createRoute({
        path: 'signup',
        element: <Signup />,
        title: 'Sign Up'
      }),
      createRoute({
        path: 'callback',
        element: <Callback />,
        title: 'Authentication Callback'
      }),
      createRoute({
        path: 'error',
        element: <ErrorPage />,
        title: 'Error'
      }),
      createRoute({
        path: 'reset-password/:appId/:fields',
        element: <ResetPassword />,
        title: 'Reset Password'
      }),
      createRoute({
        path: 'prompt-password/:appId/:emailAddress/:provider',
        element: <PromptPassword />,
        title: 'Prompt Password'
      }),
      
      // 404 catch-all route
      createRoute({
        path: '*',
        element: <NotFound />,
        title: 'Page Not Found'
      })
    ]
  }
])