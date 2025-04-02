import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VerifyPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get status from URL
    const params = new URLSearchParams(window.location.search);
    const verifiedParam = params.get('verified');
    const tokenParam = params.get('token');
    
    if (verifiedParam) {
      setStatus(verifiedParam);
      setIsLoading(false);
    } else if (tokenParam) {
      // If token is present, call the verify API
      const verifySubscription = async () => {
        try {
          const response = await fetch(`/api/verify?token=${tokenParam}`);
          
          if (!response.ok) {
            setStatus('error');
          }
          // The API will redirect to this page with a status parameter
        } catch (err) {
          setStatus('error');
        } finally {
          setIsLoading(false);
        }
      };
      
      verifySubscription();
    } else {
      setStatus('invalid');
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Verifying Your Subscription</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Please wait while we verify your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Email Verification
        </h1>
        
        {status === 'success' ? (
          <div className="text-center">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-semibold mb-4">Successfully Verified</h2>
            <p className="text-gray-600 mb-6">
              Thank you for verifying your email address. Your subscription to our newsletter is now complete.
            </p>
            <p className="text-gray-600">
              You will now receive our newsletter at the email address you provided.
            </p>
          </div>
        ) : status === 'already' ? (
          <div className="text-center">
            <div className="text-blue-600 text-5xl mb-4">ℹ</div>
            <h2 className="text-xl font-semibold mb-4">Already Verified</h2>
            <p className="text-gray-600 mb-6">
              Your email address has already been verified. You are subscribed to our newsletter.
            </p>
            <p className="text-gray-600">
              If you wish to unsubscribe, please use the unsubscribe link in any of our emails.
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-yellow-600 text-5xl mb-4">⚠</div>
            <h2 className="text-xl font-semibold mb-4">Verification Failed</h2>
            <p className="text-gray-600 mb-6">
              We couldn't verify your email address. The verification link may be invalid or expired.
            </p>
            <p className="text-gray-600 mb-4">
              Please try subscribing again or contact us if you continue to have issues.
            </p>
            <Link 
              href="/"
              className="inline-block px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Return to Subscription Page
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
