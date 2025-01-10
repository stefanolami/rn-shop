import { StyleSheet, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome } from '@expo/vector-icons'

function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>['name']
	color: string
}) {
	return (
		<FontAwesome
			size={24}
			{...props}
			style={{ color: '#1BC464' }}
		/>
	)
}

const TabsLayout = () => {
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
