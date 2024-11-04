import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Faucet from './Faucet.tsx'
import Stake from './Stake.tsx'
import Mint from './Mint.tsx'
import Use from './Use.tsx'

import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

import '@rainbow-me/rainbowkit/styles.css'
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi'
import {
  bscTestnet
} from 'wagmi/chains'
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query"

import { Toaster } from 'react-hot-toast';

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [bscTestnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
})

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/faucet",
    element: <Faucet />,
  },
  {
    path: "/stake",
    element: <Stake />,
  },
  {
    path: "/mint",
    element: <Mint />,
  },
  {
    path: "/use",
    element: <Use />,
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Toaster
            toastOptions={{
              duration: 5000,
            }}
          />
          <RouterProvider router={router} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
