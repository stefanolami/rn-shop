import { ActivityIndicator, StyleSheet, Text } from 'react-native'
import React from 'react'
import { Redirect, Tabs } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome } from '@expo/vector-icons'
import { useAuth } from '../../providers/auth-provider'

function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>['name']
	focus: boolean
}) {
	return (
		<FontAwesome
			size={24}
			{...props}
			style={{ color: `${props.focus ? '#1BC464' : 'gray'}` }}
		/>
	)
}

const TabsLayout = () => {
	const { session, mounting } = useAuth()

	if (mounting) return <ActivityIndicator />
	if (!session) return <Redirect href="/auth" />

	return (
		<SafeAreaView style={styles.safeArea}>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: '#1BC464',
					tabBarInactiveTintColor: 'gray',
					tabBarLabelStyle: { fontSize: 16 },
					tabBarStyle: {
						borderTopLeftRadius: 20,
						borderTopRightRadius: 20,
						height: 60,
					},
					headerShown: false,
				}}
			>
				<Tabs.Screen
					name="index"
					options={{
						title: 'Shop',
						tabBarIcon(props) {
							return (
								<TabBarIcon
									name="shopping-cart"
									focus={props.focused}
									{...props}
								/>
							)
						},
					}}
				/>
				<Tabs.Screen
					name="orders"
					options={{
						title: 'Orders',
						tabBarIcon(props) {
							return (
								<TabBarIcon
									name="book"
									focus={props.focused}
									{...props}
								/>
							)
						},
					}}
				/>
			</Tabs>
		</SafeAreaView>
	)
}

export default TabsLayout

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
})
