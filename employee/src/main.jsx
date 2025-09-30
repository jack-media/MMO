import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RouterProvider,
  RootRoute,
  Route,
  createRouter,
} from '@tanstack/react-router'
import { ConfigProvider } from 'antd'
import AppLayout from './layouts/AppLayout.jsx'
import HomePage from './pages/Home.jsx'
import OrdersPage from './pages/Orders.jsx'
import AnalyticsPage from './pages/Analytics.jsx'
import 'antd/dist/reset.css'
import './index.css'

const queryClient = new QueryClient()

const rootRoute = new RootRoute({ component: AppLayout })
const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})
const ordersRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'orders',
  component: OrdersPage,
})
const analyticsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'analytics',
  component: AnalyticsPage,
})

const routeTree = rootRoute.addChildren([homeRoute, ordersRoute, analyticsRoute])
const router = createRouter({ routeTree })

function Providers({ children }) {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1677ff',
              fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            },
          }}
        >
          {children}
        </ConfigProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')).render(
  <Providers>
    <RouterProvider router={router} />
  </Providers>,
)



