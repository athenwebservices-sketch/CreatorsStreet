// components/RazorpayPayment.tsx
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { apiService } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface RazorpayPaymentProps {
  cartItems: CartItem[];
  totalAmount: number;
  onSuccess: (response: any) => void;
  onFailure: (error: any) => void;
  onDismiss: () => void;
}

const RazorpayPayment = ({ 
  cartItems, 
  totalAmount,
  onSuccess, 
  onFailure, 
  onDismiss
}: RazorpayPaymentProps) => {
  const { token } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const hasInitialized = useRef(false);
  const razorpayInstance = useRef<any>(null);
  const orderCreated = useRef(false);

  const loadRazorpayScript = useCallback((): Promise<boolean> => {
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
  }, []);

  const initiatePayment = useCallback(async () => {
    // Prevent multiple initializations
    if (hasInitialized.current || isProcessing || orderCreated.current) {
      console.log('RazorpayPayment: Already initialized or processing, skipping');
      return;
    }

    hasInitialized.current = true;
    setIsProcessing(true);
    console.log('RazorpayPayment: Initiating payment');

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      // Create order only once
      if (!orderCreated.current) {
        orderCreated.current = true;
        
        const items = cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity
        }));
        
        const orderData = await apiService.post(`/api/orders`, {
          items: items,
        });
        console.log('RazorpayPayment: Order created:', orderData);

        const itemsSummary = cartItems.length > 1 
          ? `${cartItems.length} items` 
          : cartItems[0]?.name || 'Items';

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
          amount: totalAmount * 100,
          currency: 'INR',
          name: 'Creators Street',
          description: itemsSummary,
          image: '/logo.png',
          prefill: {
            email: 'customer@example.com',
            contact: '9999999999',
          },
          notes: {
            orderId: orderData._id,
            items: JSON.stringify(cartItems),
          },
          handler: async function (response: any) {
            console.log('RazorpayPayment: Payment successful:', response);
            
            // Prevent multiple handler calls
            if (razorpayInstance.current) {
              razorpayInstance.current.off('payment.success');
            }
            
            let postPaymentError: Error | null = null;
            let finalOrderId = orderData._id;

            try {
              const orderNumber = orderData.order_id || orderData.orderNumber || `ORD-${orderData._id}`;
              const updatedOrder = await apiService.put(`/api/orders/by-number/${orderNumber}/status`, { 
                status: 'paid', 
                paymentStatus: "payment successful", 
              });
              
              finalOrderId = updatedOrder._id || updatedOrder.data?._id || orderData._id;

              const paymentPayload = {
                orderId: finalOrderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                signature: response.razorpay_signature,
                amount: totalAmount,
              };
              
              await apiService.post(`/api/payments`, paymentPayload);
              console.log('RazorpayPayment: Payment record created');
            } catch (error) {
              console.error('RazorpayPayment: Post-payment error:', error);
              postPaymentError = error instanceof Error ? error : new Error('Unknown error');
            }

            onSuccess({
              ...response,
              orderId: finalOrderId,
              postPaymentError: postPaymentError,
              preventRedirect: true,
            });
          },
          modal: {
            ondismiss: function () {
              console.log('RazorpayPayment: Modal dismissed');
              setIsProcessing(false);
              hasInitialized.current = false;
              orderCreated.current = false;
              onDismiss();
            },
            escape: true,
          },
        };

        razorpayInstance.current = new window.Razorpay(options);
        razorpayInstance.current.open();
      }
    } catch (error: unknown) {
      console.error('RazorpayPayment: Payment error:', error);
      setIsProcessing(false);
      hasInitialized.current = false;
      orderCreated.current = false;
      const errorMessage = error instanceof Error ? error.message : 'Payment error';
      onFailure(errorMessage);
    }
  }, [cartItems, totalAmount, isProcessing, loadRazorpayScript, onSuccess, onFailure, onDismiss]);

  useEffect(() => {
    // Only initialize once
    if (!hasInitialized.current && !isProcessing) {
      initiatePayment();
    }
  }, [initiatePayment, isProcessing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (razorpayInstance.current) {
        razorpayInstance.current.close();
      }
      hasInitialized.current = false;
      orderCreated.current = false;
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default RazorpayPayment;