"use client"
import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
const client = new QueryClient()
const QueryProvider = ({ children }: { children: React.ReactNode }) => {
    return <QueryClientProvider client={client} >
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
}

export default QueryProvider