// components/AdminQRReader.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const AdminQRReader = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState<Array<{ value: string; timestamp: Date }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [isInitialized, setIsInitialized] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerElementRef = useRef<HTMLDivElement>(null);

  // Initialize scanner when component mounts
  useEffect(() => {
    // Check camera permissions on mount
    const checkCameraPermission = async () => {
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
          setCameraPermission(result.state as 'prompt' | 'granted' | 'denied');
          result.addEventListener('change', () => {
            setCameraPermission(result.state as 'prompt' | 'granted' | 'denied');
          });
        } catch {
          setCameraPermission('prompt');
        }
      }
    };

    checkCameraPermission();
    setIsInitialized(true);

    return () => {
      // Clean up scanner when component unmounts
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanning = useCallback(async () => {
    try {
      setError(null);
      setScanResult(null);
      
      // Set scanning state to true first to ensure the element is rendered
      setIsScanning(true);
      
      // Wait a bit to ensure the DOM is updated
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Check if the element exists
      const readerElement = document.getElementById('qr-reader');
      if (!readerElement) {
        console.error('QR reader element not found in DOM');
        setError('Scanner element not found. Please refresh the page and try again.');
        setIsScanning(false);
        return;
      }

      // Create new scanner instance
      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;

      // Get available cameras
      const cameras = await Html5Qrcode.getCameras();
      
      if (cameras && cameras.length > 0) {
        // Use the first camera (usually back camera on mobile)
        const cameraId = cameras[0].id;
        
        await html5QrCode.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          (decodedText) => {
            setScanResult(decodedText);
            setScanHistory(prev => [
              { value: decodedText, timestamp: new Date() },
              ...prev.slice(0, 9) // Keep only the last 10 scans
            ]);
            stopScanning();
          },
          (errorMessage) => {
            // Handle scan error silently
            console.warn(errorMessage);
          }
        );
        
        setCameraPermission('granted');
      } else {
        setError('No camera found on this device');
        setIsScanning(false);
      }
    } catch (err) {
      console.error('Error starting scanner:', err);
      setIsScanning(false);
      if (err instanceof Error) {
        if (err.message.includes('Permission denied') || err.message.includes('NotAllowedError')) {
          setError('Camera permission denied. Please allow camera access in your browser settings.');
          setCameraPermission('denied');
        } else if (err.message.includes('NotFoundError')) {
          setError('No camera found on this device.');
        } else {
          setError(`Failed to start scanner: ${err.message}`);
        }
      } else {
        setError('Failed to start scanner');
      }
    }
  }, []);

  const stopScanning = useCallback(() => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().catch(error => {
        console.error('Failed to stop scanner', error);
      });
    }
    setIsScanning(false);
  }, []);

  const clearHistory = () => {
    setScanHistory([]);
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission('granted');
      setError(null);
    } catch (err) {
      setCameraPermission('denied');
      setError('Camera permission denied. Please allow camera access in your browser settings.');
    }
  };

  // Don't render until initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#3c0052] flex items-center justify-center">
        <div className="text-white text-2xl">Initializing scanner...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* QR Scanner Section */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">QR Code Scanner</h3>
        
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md">
            {/* Always render the QR reader element but control its visibility */}
            <div 
              id="qr-reader" 
              className={`rounded-lg overflow-hidden bg-black ${!isScanning ? 'hidden' : ''}`}
              style={{ minHeight: '300px' }}
            />
            
            {!isScanning && (
              <div className="bg-black/30 rounded-lg p-8 flex flex-col items-center justify-center h-64">
                <div className="text-6xl mb-4">📷</div>
                <p className="text-gray-300 mb-4 text-center">Click the button below to start scanning QR codes</p>
                
                {cameraPermission === 'denied' && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-300 text-sm text-center">
                      Camera permission denied. Please allow camera access in your browser settings.
                    </p>
                  </div>
                )}
                
                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-300 text-sm text-center">{error}</p>
                  </div>
                )}
                
                {cameraPermission === 'denied' ? (
                  <button
                    onClick={requestCameraPermission}
                    className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-lg transition-colors"
                  >
                    Request Camera Permission
                  </button>
                ) : (
                  <button
                    onClick={startScanning}
                    className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-lg transition-colors"
                  >
                    Start Scanning
                  </button>
                )}
              </div>
            )}
            
            {isScanning && (
              <button
                onClick={stopScanning}
                className="w-full mt-4 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
              >
                Stop Scanning
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scan Result */}
      {scanResult && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Scan Result</h3>
          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-gray-300 mb-2">Scanned Value:</p>
            <div className="bg-black/50 rounded p-3 break-all">
              <p className="text-white font-mono">{scanResult}</p>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => navigator.clipboard.writeText(scanResult)}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-lg transition-colors"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setScanResult(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scan History */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Scan History</h3>
          {scanHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
            >
              Clear History
            </button>
          )}
        </div>
        
        {scanHistory.length === 0 ? (
          <div className="bg-black/30 rounded-lg p-8 text-center">
            <p className="text-gray-300">No scan history yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scanHistory.map((item, index) => (
              <div key={index} className="bg-black/30 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 mr-4">
                    <p className="text-gray-300 text-sm mb-1">
                      {item.timestamp.toLocaleString()}
                    </p>
                    <p className="text-white font-mono break-all">{item.value}</p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(item.value)}
                    className="px-3 py-1 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQRReader;