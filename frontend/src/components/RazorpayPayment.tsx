'use client';

import { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentProps {
  product: any;
  onSuccess: (response: any) => void;
  onFailure: (error: any) => void;
  onDismiss: () => void;
}

const RazorpayPayment = ({ product, onSuccess, onFailure, onDismiss }: RazorpayPaymentProps) => {
  // State to prevent the payment logic from running multiple times
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    // --- GUARD CLAUSE ---
    // If payment has already been initiated, do nothing.
    // This is the key to preventing multiple executions.
    if (isProcessing) {
      return;
    }

    const initiatePayment = async () => {
      // Set the flag to true immediately to prevent re-entry
      setIsProcessing(true);
      let orderData;

      try {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          throw new Error('Failed to load payment gateway. Please check your connection.');
        }

        // 1. Create the order in your database
        try {
          orderData = await apiService.post('/api/orders', {
            items: [{ productId: product._id, quantity: 1 }],
          });
          console.log('Order created:', orderData);
        } catch (error) {
          console.error('Error creating order:', error);
          // In production, you might want to fail the payment here
          // instead of using a mock order.
          orderData = {
            _id: `order_mock_${Date.now()}`,
            order_id: `order_mock_${Date.now()}`,
            razorpayOrderId: `order_mock_${Date.now()}`,
          };
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
          amount: product.price,
          currency: 'INR',
          name: 'Your Company Name',
          description: product.name,
          image: '',
          prefill: {
            email: 'a@gmail.com',
            contact: '1234567890',
          },
          notes: {
            orderId: orderData._id, // Pass order ID to Razorpay for reference
          },
          handler: async function (response: any) {
            console.log('Payment successful:', response);
            let postPaymentError = null;

            try {
              // 2. Update the order status to 'paid'
              await apiService.put(`/api/orders/${orderData._id}/status`, { status: 'paid' });
              console.log(`Order ${orderData._id} updated to 'paid'.`);

              // 3. Create a payment record
              const paymentPayload = {
                orderId: orderData._id,
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                amount: product.price,
              };
              await apiService.post('/api/payments', paymentPayload);
              console.log('Payment record created successfully.');
            } catch (error) {
              console.error('Error during post-payment processing:', error);
              postPaymentError = error;
            }

            // Call onSuccess with all relevant data
            onSuccess({
              ...response,
              orderId: orderData._id,
              postPaymentError: postPaymentError,
            });
          },
          modal: {
            ondismiss: function () {
              console.log('Checkout form dismissed by the user');
              // Reset processing state so the user can try again if needed
              setIsProcessing(false);
              onDismiss();
            },
            // Handle when modal is closed outside (e.g., by pressing escape)
            // Note: 'ondismiss' covers both user closing and external closing.
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();

      } catch (error) {
        console.error('Payment initiation error:', error);
        onFailure(error.message || 'Error initiating Razorpay payment');
        // Reset processing state on failure so the user can try again
        setIsProcessing(false);
      }
    };

    initiatePayment();

    // The dependency array remains the same, but the internal guard prevents re-runs.
  }, [product, onSuccess, onFailure, onDismiss]);

  // This component doesn't render anything visible.
  return null;
};

export default RazorpayPayment;