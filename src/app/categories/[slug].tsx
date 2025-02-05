import {
	View,
	Text,
	StyleSheet,
	Image,
	FlatList,
	ActivityIndicator,
} from 'react-native'
import { Redirect, Stack, useLocalSearchParams, usePathname } from 'expo-router'
import ProductListItem from '../../components/product-list-item'
import { getCategoryAndProducts } from '../../api/api'

const Category = () => {
	const { slug } = useLocalSearchParams<{ slug: string }>()

	const { data, error, isLoading } = getCategoryAndProducts(slug)

	if (isLoading) return <ActivityIndicator />

	if (error || !data) {
		return (
			<Text>
				Error:{' '}
				{error?.message ||
					'An unknown error occurred, try again later.'}
			</Text>
		)
	}

	const { category, products } = data

	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					title: category.name,
					headerShown: true,
					headerTitleAlign: 'center',
					headerBackVisible: true,
					headerLeft: () => null,
				}}
			/>
			<Image
				source={{ uri: category.imageUrl }}
				style={styles.categoryImage}
			/>
			<Text style={styles.categoryName}>{category.name}</Text>
			<FlatList
				data={products}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => <ProductListItem product={item} />}
				numColumns={3}
				columnWrapperStyle={styles.productRow}
				contentContainerStyle={styles.productList}
			/>
		</View>
	)
}

export default Category

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 16,
	},
	categoryImage: {
		width: '100%',
		height: 200,
		resizeMode: 'cover',
		borderRadius: 8,
		marginBottom: 16,
	},
	categoryName: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	productList: {
		flexGrow: 1,
	},
	productRow: {
		justifyContent: 'space-between',
	},
	productContainer: {
		flex: 1,
		margin: 8,
	},
	productImage: {
		width: '100%',
		height: 150,
		borderRadius: 8,
		resizeMode: 'cover',
	},
	productTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginTop: 8,
	},
	productPrice: {
		fontSize: 14,
		color: '#888',
		marginTop: 4,
	},
})
