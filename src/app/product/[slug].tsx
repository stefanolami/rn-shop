import { Redirect, Stack, useLocalSearchParams } from 'expo-router'
import {
	ActivityIndicator,
	FlatList,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { useToast } from 'react-native-toast-notifications'
import { useState } from 'react'

import { useCartStore } from '../../store/cart-store'
import { getProduct } from '../../api/api'

const ProductDetails = () => {
	const { slug } = useLocalSearchParams<{ slug: string }>()
	const toast = useToast()

	const { data: product, error, isLoading } = getProduct(slug)

	const { items, addItem, incrementItem, decrementItem } = useCartStore()

	const [quantity, setQuantity] = useState(1)

	if (isLoading) return <ActivityIndicator />
	if (error) return <Text style={styles.errorMessage}>{error.message}</Text>
	if (!product) return <Redirect href="/404" />

	const increaseQuantity = () => {
		if (quantity < product.maxQuantity) {
			setQuantity((prev) => prev + 1)
		} else {
			toast.show('You have reached the maximum quantity', {
				type: 'warning',
				placement: 'top',
				duration: 1500,
			})
		}
	}
	const decreaseQuantity = () => {
		if (quantity > 1) {
			setQuantity((prev) => prev - 1)
		}
	}
	const addToCart = () => {
		addItem({
			id: product.id,
			title: product.title,
			image: product.heroImage,
			price: product.price,
			quantity,
		})
		toast.show('Added to cart', {
			type: 'success',
			placement: 'top',
			duration: 1500,
		})
	}

	const totalPrice = (product.price * quantity).toFixed(2)

	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					title: product.title,
					headerTitleAlign: 'center',
					headerBackVisible: true,
					headerLeft: () => null,
				}}
			/>
			<Image
				source={{ uri: product.heroImage }}
				style={styles.heroImage}
			/>
			<View
				style={{
					padding: 16,
					flex: 1,
				}}
			>
				<Text style={styles.title}>{product.title}</Text>
				<Text style={styles.slug}>{product.slug}</Text>
				<View style={styles.priceContainer}>
					<Text style={styles.price}>
						${product.price.toFixed(2)}
					</Text>
					<Text style={styles.price}>Total Price: ${totalPrice}</Text>
				</View>
				<FlatList
					data={product.images}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item }) => (
						<Image
							source={{ uri: item }}
							style={styles.image}
						/>
					)}
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.imageContainer}
				/>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.quantityButton}
						onPress={decreaseQuantity}
						disabled={quantity <= 1}
					>
						<Text style={styles.quantityButtonText}>-</Text>
					</TouchableOpacity>
					<Text style={styles.quantity}>{quantity}</Text>
					<TouchableOpacity
						style={styles.quantityButton}
						onPress={increaseQuantity}
						disabled={quantity >= product.maxQuantity}
					>
						<Text style={styles.quantityButtonText}>+</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.addToCartButton,
							{ opacity: quantity === 0 ? 0.5 : 1 },
						]}
						onPress={addToCart}
						disabled={quantity === 0}
					>
						<Text style={styles.addToCartText}>Add to Cart</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}

export default ProductDetails

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	heroImage: {
		width: '100%',
		height: 250,
		resizeMode: 'cover',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginVertical: 8,
	},
	slug: {
		fontSize: 18,
		color: '#555',
		marginBottom: 16,
	},
	priceContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
		justifyContent: 'space-between',
	},
	price: {
		color: '#000',
		fontWeight: 'bold',
	},
	image: {
		width: 100,
		height: 100,
		borderRadius: 8,
		marginRight: 8,
	},
	imageContainer: {
		marginBottom: 16,
	},
	buttonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		marginBottom: 16,
	},
	quantityButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#007bff',
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 8,
	},
	quantityButtonText: {
		fontSize: 24,
		color: '#fff',
	},
	quantity: {
		fontSize: 18,
		fontWeight: 'bold',
		marginHorizontal: 8,
	},
	addToCartButton: {
		flex: 1,
		backgroundColor: '#28a745',
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: 8,
	},
	addToCartText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold',
	},
	errorMessage: {
		color: '#f00',
		fontSize: 18,
		marginTop: 20,
		textAlign: 'center',
	},
})
