import { createBrowserRouter } from "react-router-dom"
import { lazy, Suspense } from "react"
import Layout from "@/components/organisms/Layout"

// Lazy load all page components
const AlertPage = lazy(() => import("@/components/pages/AlertPage"))
const ActivePage = lazy(() => import("@/components/pages/ActivePage"))
const FacilitiesPage = lazy(() => import("@/components/pages/FacilitiesPage"))
const HistoryPage = lazy(() => import("@/components/pages/HistoryPage"))
const NotFound = lazy(() => import("@/components/pages/NotFound"))

// Loading fallback component
const PageLoadingFallback = ({ children }) => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
      <div className="text-center space-y-4">
        <svg className="animate-spin h-12 w-12 text-red-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <div className="text-red-600 font-semibold">Loading Emergency System...</div>
      </div>
    </div>
  }>
    {children}
  </Suspense>
)

// Define main routes
const mainRoutes = [
  {
    path: "",
    index: true,
    element: <PageLoadingFallback><AlertPage /></PageLoadingFallback>
  },
  {
    path: "active",
    element: <PageLoadingFallback><ActivePage /></PageLoadingFallback>
  },
  {
    path: "facilities",
    element: <PageLoadingFallback><FacilitiesPage /></PageLoadingFallback>
  },
  {
    path: "history",
    element: <PageLoadingFallback><HistoryPage /></PageLoadingFallback>
  },
  {
    path: "*",
    element: <PageLoadingFallback><NotFound /></PageLoadingFallback>
  }
]

// Create routes array with layout wrapper
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
]

export const router = createBrowserRouter(routes)