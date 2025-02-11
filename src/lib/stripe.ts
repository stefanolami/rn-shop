// 1 setup the payment sheet
// 2 stripe checkout form

import {
	initPaymentSheet,
	presentPaymentSheet,
} from '@stripe/stripe-react-native'
import { supabase } from './supabase'
import { CollectionMode } from '@stripe/stripe-react-native/lib/typescript/src/types/PaymentSheet'

const fetchStripeKeys = async (totalAmount: number) => {
	const { data, error } = await supabase.functions.invoke('stripe-checkout', {
		body: {
			totalAmount,
		},
	})

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export const setupStripePaymentSheet = async (totalAmount: number) => {
	const { paymentIntent, publicKey } = await fetchStripeKeys(totalAmount)

	if (!paymentIntent || !publicKey) {
		throw new Error('Failed to fetch Stripe keys')
	}

	const { error } = await initPaymentSheet({
		merchantDisplayName: 'StefanoLami',
		paymentIntentClientSecret: paymentIntent,
		billingDetailsCollectionConfiguration: {
			name: 'always' as CollectionMode,
			phone: 'always' as CollectionMode,
		},
	})

	if (error) {
		throw new Error(`Failed to initialize payment sheet: ${error.message}`)
	}

	return true

	console.log('Payment sheet initialized successfully')
}

export const openStripeCheckout = async () => {
	const { error } = await presentPaymentSheet({})

	if (error) {
		console.log('error opening checkout: ', error.message)
		//throw new Error(error.message)
	} else {
		return true
	}
}
