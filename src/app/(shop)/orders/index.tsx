import {
	ActivityIndicator,
	FlatList,
	ListRenderItem,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native'
import { Link, Stack } from 'expo-router'
import { Tables } from '../../../types/database.types'
import { getMyOrders } from '../../../api/api'
import { format } from 'date-fns'
import { useOrderUpdateSubscription } from '../../../api/subscription'

const renderItem: ListRenderItem<Tables<'orders'>> = ({ item }) => {
	return (
		<Link
			href={`/orders/${item.slug}`}
			asChild
		>
			<Pressable style={styles.orderContainer}>
				<View style={styles.orderContent}>
					<View style={styles.orderDetailsContainer}>
						<Text style={styles.orderItem}>{item.slug}</Text>
						<Text style={styles.orderDetails}>
							{item.description}
						</Text>
						<Text style={styles.orderDate}>
							{format(new Date(item.created_at), 'MMM dd, yyyy')}
						</Text>
					</View>
					<View
						style={[
							styles.statusBadge,
							styles[
								`statusBadge_${
									item.status as
										| 'Pending'
										| 'Delivered'
										| 'Shipped'
								}`
							],
						]}
					>
						<Text style={styles.statusText}>
							{item.status.toUpperCase()}
						</Text>
					</View>
				</View>
			</Pressable>
		</Link>
	)
}

const OrdersPage = () => {
	//useOrderUpdateSubscription()
	const { data: orders, error, isLoading } = getMyOrders()

	if (isLoading) return <ActivityIndicator />

	if (error || !orders) return <Text>Error: {error?.message}</Text>

	if (!orders.length) {
		return (
			<Text
				style={{
					fontSize: 16,
					color: '#555',
					textAlign: 'center',
					padding: 10,
					paddingTop: 30,
				}}
			>
				No orders found
			</Text>
		)
	}

	return (
		<View style={styles.container}>
			<Stack.Screen options={{ title: 'Orders' }} />
			<FlatList
				data={orders}
				keyExtractor={(item) => item.id.toString()}
				renderItem={renderItem}
			/>
		</View>
	)
}

export default OrdersPage

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	orderContainer: {
		backgroundColor: '#f8f8f8',
		padding: 16,
		marginVertical: 8,
		borderRadius: 8,
	},
	orderContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	orderDetailsContainer: {
		flex: 1,
	},
	orderItem: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	orderDetails: {
		fontSize: 14,
		color: '#555',
	},
	orderDate: {
		fontSize: 12,
		color: '#888',
		marginTop: 4,
	},
	statusBadge: {
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderRadius: 4,
		alignSelf: 'flex-start',
	},
	statusText: {
		fontSize: 12,
		fontWeight: 'bold',
		color: '#fff',
	},
	statusBadge_Pending: {
		backgroundColor: '#ffcc00',
	},
	statusBadge_Delivered: {
		backgroundColor: '#4caf50',
	},
	statusBadge_Shipped: {
		backgroundColor: '#2196f3',
	},
})
