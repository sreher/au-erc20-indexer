import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";

import {WagmiProvider} from 'wagmi';
import {getDefaultConfig, RainbowKitProvider, darkTheme, midnightTheme, lightTheme} from "@rainbow-me/rainbowkit";
import {mainnet, sepolia, goerli} from "wagmi/chains";
import {ComponentPreviews, useInitial} from "./dev/index.js";
import { ChakraProvider } from '@chakra-ui/react'

const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: '70ab9aefa3ab84aa31330868579d4ecd',
    chains: [mainnet, sepolia, goerli],
    ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    initialChain={sepolia}
                    locale="en-EN"
                    showRecentTransactions={true}
                    theme={lightTheme({
                        accentColor: '#7b3fe4',
                        accentColorForeground: 'white',
                        borderRadius: 'medium',
                        fontStack: 'rounded',
                        overlayBlur: 'none',
                    })
                    }>
                    <ChakraProvider>
                        <App/>
                    </ChakraProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    </React.StrictMode>,
)