// pages/index.js

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect } from 'react';

const stripePromise = loadStripe('pk_test_51N4kbSSIJUfqLb7hHmQs0vpwTQzADHpnXUE0mDQiE3OkHeXgGJaMU2ELuSOGbBseIMGYndXc7mztU64mbq7KOSYQ00qBFAafl2'); // Replace with your Stripe publishable key

const Payment = () => {
    const handleClick = async () => {
        const stripe = await stripePromise;

        const { error } = await stripe.redirectToCheckout({
            lineItems: [
                { price: 'price_1P7g9WSIJUfqLb7hqx5auAd7', quantity: 1 }, // Replace with your product price ID
            ],
            mode: 'payment',
            successUrl: `${window.location.origin}/profile?tab=booking-history`,
            cancelUrl: `${window.location.origin}/profile?tab=hostel-booking-history`,
        });

        if (error) {
            console.error(error);
        }
    };
useEffect(() => {
    handleClick()
}, [])

    return (<></>
        // <div>
        //     <h1>Welcome to My Next.js App</h1>
        //     <button onClick={handleClick}>Pay with Stripe</button>
        // </div>
    );
};

export default Payment;
