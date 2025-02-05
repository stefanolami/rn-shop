import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../providers/auth-provider'
import { generateOrderSlug } from '../utils/utils'

/**
 * Fetches products and categories from the database.
 *
 * @returns {UseQueryResult<{ products: any[]; categories: any[] }, Error>} Query result containing products and categories.
 */
export const getProductsAndCategories = () => {
	return useQuery({
		queryKey: ['products', 'categories'],
		queryFn: async () => {
			const [products, categories] = await Promise.all([
				supabase.from('products').select('*'),
				supabase.from('categories').select('*'),
			])

			if (products.error || categories.error) {
				throw new Error('Error fetching data')
			}

			return { products: products.data, categories: categories.data }
		},
	})
}

/**
 * Fetches a product by its slug.
 *
 * @param {string} slug - The slug of the product.
 * @returns {UseQueryResult<any, Error>} Query result containing the product data.
 */
export const getProduct = (slug: string) => {
	return useQuery({
		queryKey: ['product', slug],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('products')
				.select('*')
				.eq('slug', slug)
				.single()

			if (error || !data) {
				throw new Error('Error fetching data: ' + error?.message)
			}

			return data
		},
	})
}

/**
 * Fetches a category and its associated products by the category slug.
 *
 * @param {string} slug - The slug of the category.
 * @returns {UseQueryResult<{ category: any; products: any[] }, Error>} Query result containing the category and its products.
 */
export const getCategoryAndProducts = (slug: string) => {
	return useQuery({
		queryKey: ['categoryAndProducts', slug],
		queryFn: async () => {
			const { data: category, error } = await supabase
				.from('categories')
				.select('*')
				.eq('slug', slug)
				.single()
			if (error) {
				throw new Error('Error fetching data: ' + error.message)
			}
			if (!category) {
				throw new Error('Category not found')
			}
			const products = await supabase
				.from('products')
				.select('*')
				.eq('category', category.id)
			return { category, products: products.data }
		},
	})
}

/**
 * Fetches the orders of the currently authenticated user.
 *
 * @returns {UseQueryResult<any[], Error>} Query result containing the user's orders.
 */
export const getMyOrders = () => {
	const {
		user: { id },
	} = useAuth()

	return useQuery({
		queryKey: ['orders', id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('orders')
				.select('*')
				.eq('user', id)

			if (error) {
				throw new Error('Error fetching orders: ' + error.message)
			}

			return data
		},
	})
}

/**
 * Creates a new order for the currently authenticated user.
 *
 * @returns {UseMutationResult<any, Error, { totalPrice: number }, unknown>} Mutation result for creating an order.
 */
export const createOrder = () => {
	const {
		user: { id },
	} = useAuth()

	const slug = generateOrderSlug()

	const queryClient = useQueryClient()

	return useMutation({
		async mutationFn({ totalPrice }: { totalPrice: number }) {
			const { data, error } = await supabase
				.from('orders')
				.insert({
					totalPrice,
					slug,
					user: id,
					status: 'Pending',
				})
				.select('*')
				.single()

			if (error) {
				throw new Error('Error creating order: ' + error.message)
			}

			return data
		},

		async onSuccess() {
			await queryClient.invalidateQueries({ queryKey: ['orders'] })
		},
	})
}

/**
 * Creates new order items.
 *
 * @returns {UseMutationResult<any, Error, { orderId: number; productId: number; quantity: number }[], unknown>} Mutation result for creating order items.
 */
export const createOrderItem = () => {
	return useMutation({
		async mutationFn(
			insertData: {
				orderId: number
				productId: number
				quantity: number
			}[]
		) {
			const { data, error } = await supabase
				.from('order_items')
				.insert(
					insertData.map(({ orderId, productId, quantity }) => ({
						order: orderId,
						product: productId,
						quantity,
					}))
				)
				.select('*, product_details:products(*)')

			const productQuantities = insertData.reduce(
				(acc, { productId, quantity }) => {
					if (!acc[productId]) {
						acc[productId] = 0
					}
					acc[productId] += quantity
					return acc
				},
				{} as Record<number, number>
			)

			await Promise.all(
				Object.entries(productQuantities).map(
					async ([productId, totalQuantity]) => {
						await supabase.rpc('decrement_product_quantity', {
							product_id: Number(productId),
							quantity: totalQuantity,
						})
					}
				)
			)

			if (error) {
				throw new Error('Error creating order items: ' + error.message)
			}

			return data
		},
	})
}

export const getMyOrder = (slug: string) => {
	const {
		user: { id },
	} = useAuth()

	return useQuery({
		queryKey: ['orders', slug],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('orders')
				.select('*, order_items:order_items(*, products: products(*))')
				.eq('slug', slug)
				.single()

			if (error || !data) {
				throw new Error('Error fetching data: ' + error?.message)
			}

			return data
		},
	})
}
