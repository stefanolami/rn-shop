import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

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

export const getCategoryAndProducts = (slug: string) => {
	return useQuery({
		queryKey: ['categoryAndProducts', slug],
		queryFn: async () => {
			const { data: category, error } = await supabase
				.from('categories')
				.select('*')
				.eq('slug', slug)
				.single()
			if (!category) {
				throw new Error('Category not found')
			}
			if (error) {
				throw new Error('Error fetching data: ' + error)
			}
			const products = await supabase
				.from('products')
				.select('*')
				.eq('category', category.id)
			return { category, products: products.data }
		},
	})
}
