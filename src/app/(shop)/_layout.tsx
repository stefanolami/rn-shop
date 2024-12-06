import { Tabs } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TabsLayout() {
	return (
		<SafeAreaView>
			<Tabs>
				<Tabs.Screen
					name="index"
					options={{
						headerShown: false,
					}}
				/>
				<Tabs.Screen
					name="orders"
					options={{}}
				/>
			</Tabs>
		</SafeAreaView>
	)
}
