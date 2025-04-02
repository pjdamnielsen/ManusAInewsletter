import React, { useState, useEffect } from 'react';
import { hasCookie, setCookie } from 'cookies-next';
import SubscriptionForm from '@/components/SubscriptionForm';
import CookieConsent from '@/components/CookieConsent';

export default function Home() {
  const [cookieConsent, setCookieConsent] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if user has already given cookie consent
    setCookieConsent(hasCookie('cookie-consent'));
  }, []);

  const handleCookieAccept = () => {
    setCookie('cookie-consent', 'true', { maxAge: 60 * 60 * 24 * 365 }); // 1 year
    setCookieConsent(true);
  };

  const handleCookieDecline = () => {
    setCookieConsent(true); // Just hide the banner, but don't set the cookie
  };

  const handleSubscribe = async (data: { 
    email: string; 
    firstName: string; 
    lastName: string; 
    consent: boolean 
  }) => {
    setIsLoading(true);
    setError(undefined);
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to subscribe');
      }
      
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-50">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl">
          <h1 className="text-2xl font-bold">Newsletter Subscription</h1>
        </div>
      </div>

      <div className="relative flex place-items-center">
        <SubscriptionForm 
          onSubmit={handleSubscribe}
          isLoading={isLoading}
          error={error}
          success={success}
        />
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4">
          <h2 className="mb-3 text-2xl font-semibold">
            Stay Updated
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Get the latest news and updates delivered directly to your inbox.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4">
          <h2 className="mb-3 text-2xl font-semibold">
            Privacy First
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Your data is protected and we comply with GDPR regulations.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4">
          <h2 className="mb-3 text-2xl font-semibold">
            Easy Unsubscribe
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            You can unsubscribe at any time with a single click.
          </p>
        </div>
      </div>

      {!cookieConsent && (
        <CookieConsent 
          onAccept={handleCookieAccept} 
          onDecline={handleCookieDecline} 
        />
      )}
    </main>
  );
}
