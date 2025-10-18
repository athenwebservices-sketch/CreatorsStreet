// components/QRModal.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/lib/api';
interface QRModalProps {
  orderId: string;
  onClose: () => void;
  error?: string | null;
}

const QRModal = ({ orderId, onClose, error }: QRModalProps) => {
  const { user } = useAuth();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [qrError, setQrError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Function to send the confirmation email
  const sendConfirmationEmail = async (qrCodeDataUrl: string) => {
    if (!user?.email || emailSent) return;
    
    try {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3c0052;">Payment Confirmation</h2>
          <p>Thank you for your purchase.</p>
          <p>Your payment has been successfully processed. Please find your order details below:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <h3>Your Order QR Code</h3>
            <p>Please save this QR code for your records. You may need to show it when collecting your order.</p>
            <img src="${qrCodeDataUrl}" alt="Order QR Code" style="max-width: 200px; margin: 10px auto; display: block;" />
          </div>
          
          <p style="font-size: 12px; color: #666; margin-top: 30px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `;

      // Use the apiService to send the email
      await apiService.post('/api/email', {
        to: user.email,
        subject: `Order Confirmation - ${orderId}`,
        html: emailHtml,
      });
      
      setEmailSent(true);
      console.log('QRModal: Confirmation email sent successfully');
    } catch (err) {
      console.error('QRModal: Failed to send confirmation email:', err);
      setEmailError(err instanceof Error ? err.message : 'Failed to send confirmation email');
    }
  };

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (!orderId) {
      console.log('QRModal: No orderId provided');
      setIsGenerating(false);
      return;
    }

    console.log('QRModal: Starting QR code generation');
    setIsGenerating(true);
    setQrError(null);

    // Generate QR code using a single method
    const generateQRCode = async () => {
      try {
        const url = await QRCode.toDataURL(orderId, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'L'
        });
        
        setQrDataUrl(url);
        console.log('QRModal: QR code generated successfully');
        
        // Send email with the generated QR code
        await sendConfirmationEmail(url);
      } catch (err) {
        console.error('QRModal: QR code generation failed:', err);
        setQrError('Failed to generate QR code. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    };

    // Add timeout
    const timeoutId = setTimeout(() => {
      console.log('QRModal: Generation timeout');
      setQrError('QR code generation timed out');
      setIsGenerating(false);
    }, 5000);

    generateQRCode().finally(() => {
      clearTimeout(timeoutId);
    });
  }, [orderId, user]);

  const handleDownload = () => {
    console.log('QRModal: Download button clicked');
    if (qrDataUrl) {
      const downloadLink = document.createElement('a');
      downloadLink.download = `order-${orderId}.png`;
      downloadLink.href = qrDataUrl;
      downloadLink.click();
      console.log('QRModal: Download initiated');
    }
  };

  const handleRetry = () => {
    console.log('QRModal: Retry button clicked');
    setQrDataUrl('');
    setQrError(null);
    setIsGenerating(true);
    
    // Force regeneration
    setTimeout(async () => {
      if (orderId) {
        try {
          const url = await QRCode.toDataURL(orderId, {
            width: 200,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            },
            errorCorrectionLevel: 'L'
          });
          
          setQrDataUrl(url);
          console.log('QRModal: Retry successful');
          
          // Send email with the regenerated QR code
          await sendConfirmationEmail(url);
        } catch (err) {
          setQrError(err instanceof Error ? err.message : 'Failed to generate QR code');
        } finally {
          setIsGenerating(false);
        }
      }
    }, 100);
  };

  // Function to manually resend the email
  const handleResendEmail = async () => {
    if (!qrDataUrl) return;
    
    setEmailError(null);
    await sendConfirmationEmail(qrDataUrl);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[999999] p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Payment Successful!</h2>
          <button
            onClick={() => {
              console.log('QRModal: Close button clicked');
              onClose();
            }}
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
            {isGenerating ? (
              <div className="w-[200px] h-[200px] flex flex-col items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mb-2"></div>
                <p className="text-gray-500 text-sm">Generating QR Code...</p>
              </div>
            ) : qrError ? (
              <div className="w-[200px] h-[200px] flex flex-col items-center justify-center bg-gray-100">
                <svg className="w-12 h-12 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-500 text-sm text-center px-2">{qrError}</p>
                <button
                  onClick={handleRetry}
                  className="mt-2 px-3 py-1 bg-yellow-400 text-black text-sm rounded hover:bg-yellow-300 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : qrDataUrl ? (
              <img 
                src={qrDataUrl} 
                alt="Order QR Code" 
                className="w-[200px] h-[200px] block"
                onError={(e) => {
                  console.error('QRModal: Image failed to load');
                  e.currentTarget.src = '';
                  setQrError('QR code image failed to display');
                }}
                onLoad={() => {
                  console.log('QRModal: QR code image loaded successfully');
                }}
              />
            ) : (
              <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-100">
                <p className="text-gray-500 text-sm">No QR code data</p>
              </div>
            )}
          </div>
          
          <p className="text-gray-600 mb-2">Order ID: {orderId || 'Loading...'}</p>
          
          {/* Email status notification */}
          {emailSent && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-2 text-sm w-full">
              <p>Confirmation email sent to {user?.email}</p>
            </div>
          )}
          
          {emailError && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded mb-2 text-sm w-full">
              <p>Failed to send email: {emailError}</p>
              <button 
                onClick={handleResendEmail}
                className="mt-1 text-blue-600 underline text-xs"
              >
                Try again
              </button>
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              disabled={!qrDataUrl || isGenerating || !!qrError}
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

export default QRModal; 