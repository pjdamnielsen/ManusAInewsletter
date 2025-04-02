"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UnsubscribePage() {
  const [status, setStatus] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get status and token from URL
    const params = new URLSearchParams(window.location.search);
    const statusParam = params.get('status');
    const tokenParam = params.get('token');
    
    setStatus(statusParam);
    setToken(tokenParam);
  }, []);

  const handleUnsubscribe = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/unsubscribe?token=${token}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to unsubscribe');
      }
      
      // Redirect will happen automatically from the API
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Newsletter Unsubscribe
        </h1>
        
        {status === 'success' ? (
          <div className="text-center">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-semibold mb-4">Successfully Unsubscribed</h2>
            <p className="text-gray-600 mb-6">
              You have been successfully unsubscribed from our newsletter. You will no longer receive emails from us.
            </p>
            <p className="text-gray-600">
              If you unsubscribed by mistake, you can always 
              <Link href="/" className="text-blue-600 hover:underline ml-1">
                subscribe again
              </Link>.
            </p>
          </div>
        ) : status === 'already' ? (
          <div className="text-center">
            <div className="text-blue-600 text-5xl mb-4">ℹ</div>
            <h2 className="text-xl font-semibold mb-4">Already Unsubscribed</h2>
            <p className="text-gray-600 mb-6">
              You have already unsubscribed from our newsletter. You will not receive any more emails from us.
            </p>
            <p className="text-gray-600">
              If you would like to subscribe again, you can 
              <Link href="/" className="text-blue-600 hover:underline ml-1">
                click here
              </Link>.
            </p>
          </div>
        ) : token ? (
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Are you sure you want to unsubscribe from our newsletter? You will no longer receive updates from us.
            </p>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <div className="flex justify-center space-x-4">
              <Link 
                href="/"
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-200"
              >
                Cancel
              </Link>
              <button
                onClick={handleUnsubscribe}
                disabled={isLoading}
                className={`px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Processing...' : 'Confirm Unsubscribe'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-yellow-600 text-5xl mb-4">⚠</div>
            <h2 className="text-xl font-semibold mb-4">Invalid Request</h2>
            <p className="text-gray-600 mb-6">
              The unsubscribe link appears to be invalid or expired. Please use the unsubscribe link provided in the newsletter email.
            </p>
            <p className="text-gray-600">
              If you continue to have issues, please contact us directly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
