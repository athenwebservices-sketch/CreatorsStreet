// components/ProductCard.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import RazorpayPayment from './RazorpayPayment';
import QRCode from 'qrcode';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category?: string;
  description?: string;
  image?: string;
  createdAt: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('info');
  
  // QR Modal states
  const [showQRModal, setShowQRModal] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [postPaymentError, setPostPaymentError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  console.log("test")
  // Show notification helper
  const showNotificationMessage = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  // Generate QR code when order ID changes
  useEffect(() => {
    if (orderId && canvasRef.current) {
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

  const handlePaymentSuccess = (response: any) => {
    console.log('Payment successful:', response);
    setPaymentSuccess(true);
    setIsProcessing(false);
    setShowPayment(false);
    
    // Set order ID and show QR modal
    setOrderId(response.orderId);
    setPostPaymentError(response.postPaymentError?.message || null);
    setShowQRModal(true);
    
    // Show success message
    showNotificationMessage(
      'Payment successful! Your order has been created.',
      'success'
    );
    
    // If there's a post-payment error, show it
    if (response.postPaymentError) {
      console.error('Post-payment error:', response.postPaymentError);
      setTimeout(() => {
        showNotificationMessage(
          'Payment was successful, but there was an issue updating your order. Please contact support.',
          'error'
        );
      }, 2000);
    }
  };

  const handlePaymentFailure = (error: any) => {
    console.error('Payment failed:', error);
    setPaymentError(error);
    setIsProcessing(false);
    setShowPayment(false);
    showNotificationMessage(`Payment failed: ${error}`, 'error');
  };

  const handlePaymentDismiss = () => {
    setShowPayment(false);
    setIsProcessing(false);
    showNotificationMessage('Payment cancelled', 'info');
  };

  const handleBuyClick = () => {
    if (product.stock <= 0) {
      showNotificationMessage('This product is out of stock', 'error');
      return;
    }
    setIsProcessing(true);
    setShowPayment(true);
  };

  const handleDownloadQR = () => {
    if (qrDataUrl) {
      const downloadLink = document.createElement('a');
      downloadLink.download = `order-${orderId}.png`;
      downloadLink.href = qrDataUrl;
      downloadLink.click();
    }
  };

  const handleCloseQRModal = () => {
    setShowQRModal(false);
    // Redirect to customer dashboard after closing the modal
    window.location.href = '/customer-dashboard';
  };

  return (
    <>
      <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
        {/* Product Image */}
        <div className="relative h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/20">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-6xl opacity-50">📦</div>
            </div>
          )}
          
          {/* Stock Badge */}
          {/* <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              product.stock > 0 
                ? 'bg-green-500/80 text-white' 
                : 'bg-red-500/80 text-white'
            }`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            </span>
          </div> */}

          {/* Category Badge */}
          {product.category && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-500/80 text-white">
                {product.category}
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold text-yellow-400">
              ₹{product.price.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">
              ID: {product._id.slice(-8)}
            </div>
          </div>

          {/* Buy Button */}
          <button
            onClick={handleBuyClick}
            disabled={isProcessing || paymentSuccess || product.stock <= 0}
            className={`w-full py-2 px-4 font-semibold rounded-lg transition-all duration-300 ${
              paymentSuccess
                ? 'bg-green-500 text-white cursor-not-allowed'
                : isProcessing
                ? 'bg-gray-500 text-white cursor-wait'
                : product.stock <= 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-yellow-400 hover:bg-yellow-300 text-black hover:shadow-lg'
            }`}
          >
            {paymentSuccess ? (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Payment Successful
              </span>
            ) : isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : product.stock <= 0 ? (
              'Out of Stock'
            ) : (
              'Buy Now'
            )}
          </button>
        </div>
      </div>

      {/* Razorpay Payment Component */}
      {showPayment && !paymentSuccess && (
        <RazorpayPayment
          product={product}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
          onDismiss={handlePaymentDismiss}
        />
      )}

      {/* QR Modal */}
      {showQRModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}
        >
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Payment Successful!</h2>
              <button
                onClick={handleCloseQRModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {postPaymentError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p className="text-sm">There was an issue updating your order, but your payment was successful.</p>
                <p className="text-xs mt-1">Error: {postPaymentError}</p>
              </div>
            )}
            
            <div className="text-center mb-4">
              <p className="text-green-600 font-medium mb-2">Your payment has been processed successfully.</p>
              <p className="text-gray-600 text-sm mb-4">Please save this QR code for your records.</p>
              <div className="bg-green-100 text-green-700 px-3 py-2 rounded-md inline-block mb-2">
                  <p className="text-sm">QR code has been sent to your email</p>
                </div>
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
                  onClick={handleDownloadQR}
                  disabled={!qrDataUrl}
                  className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Download QR Code
                </button>
                <button
                  onClick={handleCloseQRModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {showNotification && (
        <div className={`fixed bottom-4 right-4 max-w-sm p-4 rounded-lg shadow-lg transform transition-all duration-300 z-50 ${
          notificationType === 'success' 
            ? 'bg-green-500 text-white'
            : notificationType === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-blue-500 text-white'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {notificationType === 'success' ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : notificationType === 'error' ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{notificationMessage}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setShowNotification(false)}
                className="inline-flex text-white hover:text-gray-200 focus:outline-none"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;