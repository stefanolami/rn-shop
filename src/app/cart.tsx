import {
	Alert,
	FlatList,
	Image,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { useCartStore } from '../store/cart-store'
import { StatusBar } from 'expo-status-bar'
import { createOrder, createOrderItem } from '../api/api'

type CartItemType = {
	id: number
	title: string
	price: number
	quantity: number
	image: any
	maxQuantity: number
}

type CartItemProps = {
	item: CartItemType
	onRemove: (id: number) => void
	onIncrement: (id: number) => void
	onDecrement: (id: number) => void
}

const CartItem = ({
	item,
	onDecrement,
	onIncrement,
	onRemove,
}: CartItemProps) => {
	return (
		<View style={styles.cartItem}>
			<Image
				source={{ uri: item.image }}
				style={styles.itemImage}
			/>
			<View style={styles.itemDetails}>
				<Text style={styles.itemTitle}>{item.title}</Text>
				<Text style={styles.itemPrice}>
					${(item.price * item.quantity).toFixed(2)}
				</Text>
				<View style={styles.quantityContainer}>
					<TouchableOpacity
						style={styles.quantityButton}
						onPress={() => onDecrement(item.id)}
					>
						<Text style={styles.quantityButtonText}>-</Text>
					</TouchableOpacity>
					<Text style={styles.itemQuantity}>{item.quantity}</Text>
					<TouchableOpacity
						style={styles.quantityButton}
						onPress={() => {
							onIncrement(item.id)
							console.log(item)
						}}
					>
						<Text style={styles.quantityButtonText}>+</Text>
					</TouchableOpacity>
				</View>
			</View>
			<TouchableOpacity
				style={styles.removeButton}
				onPress={() => onRemove(item.id)}
			>
				<Text style={styles.removeButtonText}>Remove</Text>
			</TouchableOpacity>
		</View>
	)
}

const Cart = () => {
	const {
		items,
		removeItem,
		incrementItem,
		decrementItem,
		getTotalPrice,
		resetCart,
	} = useCartStore()

	const { mutateAsync: createSupabaseOrder } = createOrder()
	const { mutateAsync: createSupabaseOrderItem } = createOrderItem()

	const handleCheckout = async () => {
		const totalPrice = parseFloat(getTotalPrice())

		try {
			await createSupabaseOrder(
				{ totalPrice },
				{
					onSuccess: async (data) => {
						await createSupabaseOrderItem(
							items.map((item) => ({
								orderId: data.id,
								productId: item.id,
								quantity: item.quantity,
							})),
							{
								onSuccess: () => {
									alert('Order created successfully')
									resetCart()
								},
								onError: (error) => {
									console.error(
										'Error creating order items:',
										error.message
									)
									alert(
										'An error occurred while creating the order items'
									)
								},
							}
						)
					},
				}
			)
		} catch (error) {
			console.error('Error creating order:', error)
			alert('An error occurred while creating the order')
		}
	}

	return (
		<View style={styles.container}>
			<StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
			<FlatList
				data={items}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<CartItem
						item={item}
						onRemove={removeItem}
						onIncrement={incrementItem}
						onDecrement={decrementItem}
					/>
				)}
				contentContainerStyle={styles.cartList}
			/>
			<View style={styles.footer}>
				<Text style={styles.totalText}>Total: ${getTotalPrice()}</Text>
				<TouchableOpacity
					style={styles.checkoutButton}
					onPress={handleCheckout}
				>
					<Text style={styles.checkoutButtonText}>Checkout</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default Cart

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingHorizontal: 16,
	},
	cartList: {
		paddingVertical: 16,
	},
	cartItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
		padding: 16,
		borderRadius: 8,
		backgroundColor: '#f9f9f9',
	},
	itemImage: {
		width: 80,
		height: 80,
		borderRadius: 8,
	},
	itemDetails: {
		flex: 1,
		marginLeft: 16,
	},
	itemTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 4,
	},
	itemPrice: {
		fontSize: 16,
		color: '#888',
		marginBottom: 4,
	},
	itemQuantity: {
		fontSize: 14,
		color: '#666',
	},
	removeButton: {
		padding: 8,
		backgroundColor: '#ff5252',
		borderRadius: 8,
	},
	removeButtonText: {
		color: '#fff',
		fontSize: 14,
	},
	footer: {
		borderTopWidth: 1,
		borderColor: '#ddd',
		paddingVertical: 16,
		paddingHorizontal: 16,
		alignItems: 'center',
	},
	totalText: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	checkoutButton: {
		backgroundColor: '#28a745',
		paddingVertical: 12,
		paddingHorizontal: 32,
		borderRadius: 8,
	},
	checkoutButtonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold',
	},
	quantityContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	quantityButton: {
		width: 30,
		height: 30,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 15,
		backgroundColor: '#ddd',
		marginHorizontal: 5,
	},
	quantityButtonText: {
		fontSize: 18,
		fontWeight: 'bold',
	},
})
