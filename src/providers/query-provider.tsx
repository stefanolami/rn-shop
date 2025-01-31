import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'

const queryCLient = new QueryClient()

export default function QueryProvider({ children }: PropsWithChildren) {
	return (
		<QueryClientProvider client={queryCLient}>
			{children}
		</QueryClientProvider>
	)
}
