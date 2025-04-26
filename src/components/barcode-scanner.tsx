"use client";
import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, Result, BarcodeFormat } from '@zxing/library';
import { Camera, CameraOff, Clipboard, RotateCcw } from 'lucide-react';

interface BarcodeScannerProps {
  onScan?: (result: string) => void;
}

export default function BarcodeScanner({ onScan }: BarcodeScannerProps) {

  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const scannerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [loadingCamera, setLoadingCamera] = useState<boolean>(false);
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Create the scanner with UPC_A
  useEffect(() => {
    const hints = new Map();
    hints.set(2, [BarcodeFormat.UPC_A,]);
    scannerRef.current = new BrowserMultiFormatReader(hints); //because it only takes a map

    return () => {
      if (scanning) {
        scannerRef.current?.reset();
      }
    };
  }, []);

  const startScanning = async () => {
    if (!scannerRef.current) return;
    
    if (scanning) {
      stopScanning();
      return;
    }

    setLoadingCamera(true);
    setError(null);
    setLastResult(null);

    try {
      // permission
      await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setHasPermission(true);

      // Start scanning
      scannerRef.current.decodeFromVideoDevice(
        undefined,  // using default device
        videoRef.current!,
        (result: Result | null) => {
          setLoadingCamera(false);
          
          if (result) {
            const text = result.getText();
            setLastResult(text);
            
            setScanSuccess(true);
            setTimeout(() => setScanSuccess(false), 1500);
            if (onScan) {
              stopScanning();
            }
          }
        }
      );
      
      setScanning(true);
    } catch (err) {
      setLoadingCamera(false);
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Permission denied - allow camera access');
          setHasPermission(false);
        } else {
          setError(`Error accessing camera: ${err.message}`);
        }
      } else {
        setError('Error occured while accessing camera');
      }
      
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.reset();
      onScan(lastResult);
      setScanning(false);
    }
  };

  const resetScanner = () => {
    setLastResult(null);
    setError(null);
    if (scanning) {
      stopScanning();
    }
  };

  const handleCopy = () => {
    if (lastResult) {
      navigator.clipboard.writeText(lastResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className={`relative rounded-lg overflow-hidden bg-gray-900 ${scanning ? 'shadow-lg' : ''}`}>
        <div className={`relative aspect-[4/3] ${scanning ? 'opacity-100' : 'opacity-50'} transition-opacity`}>
          <video 
            ref={videoRef} 
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: "scaleX(-1)" }} // have to do this because for some reason its defaulted to mirrored
          />
          
          {scanning && !loadingCamera && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-4/5 h-1/2 border-2 rounded-lg 
                ${scanSuccess ? 'border-green-500 bg-green-500/10' : 'border-white/50'} 
                transition-colors duration-300`}>
                {scanSuccess && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="animate-ping absolute h-5 w-5 rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative rounded-full h-3 w-3 bg-green-500"></span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {loadingCamera && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white text-sm">Accessing camera...</p>
              </div>
            </div>
          )}
          
          {!scanning && !loadingCamera && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-white text-center p-4">
                <CameraOff className="mx-auto mb-2 h-8 w-8 text-white/70" />
                <p>Camera is inactive</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white p-4 border-t border-gray-200">
          {hasPermission === false && (
            <div className="mb-3 p-2 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {error && hasPermission !== false && (
            <div className="mb-3 p-2 bg-yellow-50 text-yellow-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {lastResult && (
            <div className="mb-3 p-2 bg-green-50 text-green-700 rounded-md overflow-hidden">
              <div className="flex items-start justify-between">
                <p className="font-mono text-sm truncate flex-1">
                  {lastResult}
                </p>
                <div className="flex items-center">
                  <Clipboard className="w-4 h-4 text-green-600 flex-shrink-0 ml-2 cursor-pointer" 
                    onClick={handleCopy} 
                  />
                  {copied && (
                    <span className="ml-2 text-green-600 text-sm">
                      Barcode copied!
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <button
              onClick={startScanning}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                scanning 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } transition-colors`}
              disabled={loadingCamera}
            >
              <Camera className="w-5 h-5" />
              <span>{scanning ? 'Stop Scanning' : 'Start Scanning'}</span>
            </button>
            
            <button
              onClick={resetScanner}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center space-x-2 transition-colors"
              disabled={!lastResult && !error}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};