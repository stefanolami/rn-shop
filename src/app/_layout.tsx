import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { ToastProvider } from 'react-native-toast-notifications'
import AuthProvider from '../providers/auth-provider'
import QueryProvider from '../providers/query-provider'
import NotificationProvider from '../providers/notifications-provider'

const RootLayout = () => {
	return (
		<ToastProvider>
			<AuthProvider>
				<QueryProvider>
					<NotificationProvider>
						<Stack>
							<Stack.Screen
								name="(shop)"
								options={{ headerShown: false, title: 'Shop' }}
							/>
							<Stack.Screen
								name="categories"
								options={{
									headerShown: false,
									title: 'Categories',
								}}
							/>
							<Stack.Screen
								name="product"
								options={{
									headerShown: false,
									title: 'Product',
								}}
							/>
							<Stack.Screen
								name="cart"
								options={{
									presentation: 'modal',
									title: 'Shopping Cart',
									headerTitleAlign: 'center',
								}}
							/>
							<Stack.Screen
								name="auth"
								options={{ headerShown: false }}
							/>
						</Stack>
					</NotificationProvider>
				</QueryProvider>
			</AuthProvider>
		</ToastProvider>
	)
}

export default RootLayout
