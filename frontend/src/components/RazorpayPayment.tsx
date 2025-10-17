// components/RazorpayPayment.tsx
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { apiService } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';

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
  redirectUrl?: string;
}

const QRModal = ({ orderId, onClose, error }: { 
  orderId: string, 
  onClose: () => void, 
  error?: string | null 
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restore body scroll when modal is closed
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (orderId && canvasRef.current) {
      // Generate QR code using the qrcode library
      QRCode.toCanvas(canvasRef.current, orderId, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }, (error) => {
        if (error) {
          console.error('Error generating QR code:', error);
        } else {
          // Convert canvas to data URL for download
          const dataUrl = canvasRef.current?.toDataURL('image/png');
          if (dataUrl) {
            setQrDataUrl(dataUrl);
          }
        }
      });
    }
  }, [orderId]);

  const handleDownload = () => {
    if (qrDataUrl) {
      const downloadLink = document.createElement('a');
      downloadLink.download = `order-${orderId}.png`;
      downloadLink.href = qrDataUrl;
      downloadLink.click();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}
    >
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Payment Successful!</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">There was an issue updating your order, but your payment was successful.</p>
            <p className="text-xs mt-1">Error: {error}</p>
          </div>
        )}
        
        <div className="text-center mb-4">
          <p className="text-green-600 font-medium mb-2">Your payment has been processed successfully.</p>
          <p className="text-gray-600 text-sm mb-4">Please save this QR code for your records.</p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-lg mb-4 border border-gray-200">
            {orderId ? (
              <canvas 
                ref={canvasRef}
                width={200}
                height={200}
                className="block"
              />
            ) : (
              <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-100">
                <p className="text-gray-500 text-sm">Generating QR Code...</p>
              </div>
            )}
          </div>
          
          <p className="text-gray-600 mb-4">Order ID: {orderId || 'Loading...'}</p>
          
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              disabled={!qrDataUrl}
              className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download QR Code
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RazorpayPayment = ({ 
  product, 
  onSuccess, 
  onFailure, 
  onDismiss, 
  redirectUrl = '/customer-dashboard'
}: RazorpayPaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { token } = useAuth();
  const orderCreatedRef = useRef(false);
  const modalContainerRef = useRef<HTMLDivElement | null>(null);
  const paymentSuccessRef = useRef(false);
  const modalTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Helper function to clean up body styles left by the Razorpay modal.
   */
  const cleanupBodyStyles = useCallback(() => {
    // Remove the inline style that Razorpay adds
    if (document.body.style.overflow === 'hidden') {
      document.body.style.overflow = ''; // Reset to default
    }
    
    // Also remove any classes Razorpay might add
    document.body.classList.remove('razorpay-checkout-frame-open', 'razorpay-checkout-frame');
    
    // As a fallback, check the style attribute for the overflow property
    const bodyStyle = document.body.getAttribute('style');
    if (bodyStyle && bodyStyle.includes('overflow: hidden')) {
      // Remove only the overflow property from the style string
      const updatedStyles = bodyStyle
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('overflow:'))
        .join('; ');
      
      if (updatedStyles) {
        document.body.setAttribute('style', updatedStyles);
      } else {
        document.body.removeAttribute('style');
      }
    }
  }, []);

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

  const closeModal = useCallback(() => {
    setShowQRModal(false);
    paymentSuccessRef.current = false;
    if (modalTimeoutRef.current) {
      clearTimeout(modalTimeoutRef.current);
      modalTimeoutRef.current = null;
    }
    router.push(redirectUrl);
  }, [router, redirectUrl]);

  const showQRModalWithDelay = useCallback((finalOrderId: string, postPaymentError: string | null) => {
    // Clear any existing timeout
    if (modalTimeoutRef.current) {
      clearTimeout(modalTimeoutRef.current);
    }
    
    // Set the order ID and error state
    setOrderId(finalOrderId);
    setError(postPaymentError);
    
    // Show the modal immediately
    setShowQRModal(true);
    console.log('QR Modal should be visible now with order ID:', finalOrderId);
    
    // Force a re-render after a short delay to ensure the modal is visible
    modalTimeoutRef.current = setTimeout(() => {
      setShowQRModal(true);
      console.log('QR Modal forced to show with order ID:', finalOrderId);
    }, 100);
  }, []);

  const initiatePayment = useCallback(async () => {
    // Skip if payment is already processing or order has been created
    if (isProcessing || orderCreatedRef.current) {
      return;
    }

    setIsProcessing(true);
    orderCreatedRef.current = true;
    paymentSuccessRef.current = false;
    let orderData;

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Failed to load payment gateway. Please check your connection.');
      }

      // Create the order in your backend
      try {
        orderData = await apiService.post(`/api/orders`, {
          items: [{ productId: product._id, quantity: 1 }],
        });
        console.log('Order created:', orderData);
      } catch (error) {
        console.error('Error creating order:', error);
        // In production, you might want to fail the payment here
        orderData = {
          _id: `order_mock_${Date.now()}`,
          order_id: `order_mock_${Date.now()}`,
          razorpayOrderId: `order_mock_${Date.now()}`,
        };
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: product.price * 100, // Razorpay expects amount in paise (INR)
        currency: 'INR',
        name: 'Creators Street', // Replace with your company name
        description: product.name,
        image: '/logo.png', // Add your logo path
        prefill: {
          email: 'customer@example.com', // Pre-fill if user data is available
          contact: '9999999999',
        },
        notes: {
          orderId: orderData._id, // Pass your internal order ID
          productId: product._id,
        },
        handler: async function (response: any) {
          console.log('Payment successful:', response);
          let postPaymentError: Error | null = null;
          let finalOrderId = orderData._id; // Default to the original order ID

          try {
            // Update the order status to 'paid' using the new API endpoint
            console.log('Updating order status...');
            
            // Use the order number instead of order ID for the API call
            const orderNumber = orderData.order_id || orderData.orderNumber || `ORD-${orderData._id}`;
            const updatedOrder = await apiService.put(`/api/orders/by-number/${orderNumber}/status`, { status: 'paid', payment: "paid" });
            console.log(`Order ${orderNumber} updated to 'paid'.`, updatedOrder);
            
            // Set the order ID from the response
            finalOrderId = updatedOrder._id || updatedOrder.data?._id || orderData._id;

            // Create a payment record in your backend
           const paymentPayload = {
              orderId: finalOrderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
              amount: product.price,
            };
            console.log('Creating payment record:', paymentPayload);
            await apiService.post(`/api/payments`, paymentPayload);
            console.log('Payment record created successfully.');
          } catch (error) {
            console.error('Error during post-payment processing:', error);
            postPaymentError = error instanceof Error ? error : new Error('An unknown error occurred');
          }

          // Mark payment as successful
          paymentSuccessRef.current = true;
          
          // Call the parent's success handler but don't let it redirect
          onSuccess({
            ...response,
            orderId: finalOrderId,
            postPaymentError: postPaymentError,
            preventRedirect: true, // Add a flag to prevent redirect
          });
          
          // Wait a bit for Razorpay modal to close, then show our modal
          setTimeout(() => {
            cleanupBodyStyles();
            showQRModalWithDelay(finalOrderId, postPaymentError?.message || null);
          }, 500);
        },
        modal: {
          ondismiss: function () {
            console.log('Checkout form dismissed by the user');
            
            // Call cleanup when the modal is dismissed
            cleanupBodyStyles();
            
            // If payment was successful but modal was dismissed, still show QR modal
            if (paymentSuccessRef.current) {
              console.log('Payment was successful, showing QR modal after dismiss');
              showQRModalWithDelay(orderId, error);
            } else {
              setIsProcessing(false);
              orderCreatedRef.current = false; // Reset to allow retry
              onDismiss();
            }
          },
          // This handles cases where the modal is closed by pressing 'Escape'
          escape: true,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error: unknown) {
      console.error('Payment initiation error:', error);
      // Call cleanup if payment fails to initiate
      cleanupBodyStyles();
      const errorMessage = error instanceof Error ? error.message : 'Error initiating Razorpay payment';
      setError(errorMessage);
      onFailure(errorMessage);
      setIsProcessing(false);
      orderCreatedRef.current = false; // Reset to allow retry
    }
  }, [product, isProcessing, loadRazorpayScript, cleanupBodyStyles, onSuccess, onFailure, onDismiss, showQRModalWithDelay, orderId, error]);

  useEffect(() => {
    initiatePayment();
  }, [initiatePayment]);

  // Create a portal container for the modal if it doesn't exist
  useEffect(() => {
    // Check if container already exists
    let container = document.getElementById('razorpay-qr-modal-portal') as HTMLDivElement | null;
    
    if (!container) {
      container = document.createElement('div');
      container.id = 'razorpay-qr-modal-portal';
      document.body.appendChild(container);
    }
    
    modalContainerRef.current = container;
    
    return () => {
      // Don't remove the container on unmount as it might be needed by other instances
    };
  }, []);

  // Debug log to check if showQRModal is changing
  useEffect(() => {
    console.log('showQRModal changed to:', showQRModal);
  }, [showQRModal]);

  // This component now renders nothing to the DOM directly
  // The QR modal is rendered using a portal
  return (
    <>
      {showQRModal && modalContainerRef.current && createPortal(
        <QRModal 
          orderId={orderId} 
          onClose={closeModal} 
          error={error}
        />, 
        modalContainerRef.current
      )}
    </>
  );
};

export default RazorpayPayment;