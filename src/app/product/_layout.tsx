import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const ProductLayout = () => {
	return (
		<Stack>
			<Stack.Screen
				name="[slug]"
				options={({ navigation }) => ({
					headerShown: false,
					headerLeft: () => (
						<TouchableOpacity onPress={() => navigation.goBack()}>
							<Ionicons
								name="arrow-back"
								size={24}
								color="black"
							/>
						</TouchableOpacity>
					),
				})}
			/>
		</Stack>
	)
}

export default ProductLayout
